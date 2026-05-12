"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { wordlist } from "@scure/bip39/wordlists/english.js"
import { useDeviceStore } from "@/lib/store/device-store"
import { useConnectionStore } from "@/lib/store/connection-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { restoreFromSeed } from "@/lib/companion/backup-flow"
import { validateSeedPhrase } from "@/lib/crypto/bip39"
import { ScreenLayout } from "@/components/device/ScreenLayout"

const TOTAL_WORDS = 24
const ALPHA = "abcdefghijklmnopqrstuvwxyz".split("")
type ActionKey = "DEL" | "CLR"
type CellKey = string | ActionKey
const ALPHA_ROW: CellKey[] = [...ALPHA, "DEL", "CLR"]

type Phase = "entry" | "verifying" | "found" | "nobackup" | "invalid"

export function RestoreSeed() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const setSeedPhrase = useDeviceStore((s) => s.setSeedPhrase)
  const setEncryptionKey = useDeviceStore((s) => s.setEncryptionKey)
  const setBackupEnabled = useDeviceStore((s) => s.setBackupEnabled)
  const setPendingRestore = useDeviceStore((s) => s.setPendingRestore)
  const setVault = useVaultStore((s) => s.setVault)
  const addTransaction = useConnectionStore((s) => s.addTransaction)
  const setLastBackup = useConnectionStore((s) => s.setLastBackup)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const prevSeq = useRef(buttonSeq)

  const [words, setWords] = useState<string[]>([])
  const [prefix, setPrefix] = useState("")
  const [activeRow, setActiveRow] = useState<"match" | "alpha">("alpha")
  const [alphaIdx, setAlphaIdx] = useState(0)
  const [matchIdx, setMatchIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>("entry")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const slot = words.length + 1
  const matches = useMemo(() => {
    if (!prefix) return [] as string[]
    return wordlist.filter((w) => w.startsWith(prefix)).slice(0, 4)
  }, [prefix])

  // Keep active row valid as matches appear/disappear
  useEffect(() => {
    if (matches.length === 0 && activeRow === "match") setActiveRow("alpha")
    if (matchIdx >= matches.length) setMatchIdx(Math.max(0, matches.length - 1))
  }, [matches, activeRow, matchIdx])

  const finalizeWord = useCallback(
    (word: string) => {
      const next = [...words, word]
      setWords(next)
      setPrefix("")
      setMatchIdx(0)
      setAlphaIdx(0)
      setActiveRow("alpha")
      if (next.length === TOTAL_WORDS) {
        const phrase = next.join(" ")
        if (!validateSeedPhrase(phrase)) {
          setPhase("invalid")
          setErrorMsg("Checksum failed. Verify words and try again.")
          return
        }
        setPhase("verifying")
        ;(async () => {
          try {
            const result = await restoreFromSeed(phrase)
            if (!result) {
              // Valid seed, no on-chain backup → continue with fresh local vault
              setSeedPhrase(phrase)
              setBackupEnabled(false)
              setPhase("nobackup")
              return
            }
            setSeedPhrase(phrase)
            setEncryptionKey(result.encryptionKey)
            setBackupEnabled(true)
            setVault(result.vault)
            setPendingRestore(true)
            addTransaction({
              signature: `seed-restore-${Date.now().toString(16)}`,
              type: "restore",
              timestamp: Date.now(),
            })
            setLastBackup(result.lastUpdated * 1000, result.version)
            setPhase("found")
          } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : "restore failed")
            setPhase("invalid")
          }
        })()
      }
    },
    [
      words,
      setSeedPhrase,
      setEncryptionKey,
      setBackupEnabled,
      setVault,
      setPendingRestore,
      addTransaction,
      setLastBackup,
    ]
  )

  // Physical keyboard support: letters auto-type into prefix, Backspace deletes,
  // Escape clears, Enter commits the active match (if any) — mirrors device buttons.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Skip if focused inside an input/textarea
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return

      if (phase === "verifying") return
      if (phase === "found" || phase === "nobackup" || phase === "invalid") return

      if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault()
        const ch = e.key.toLowerCase()
        const nextPrefix = prefix + ch
        const filtered = wordlist.filter((w) => w.startsWith(nextPrefix))
        if (filtered.length === 1) {
          finalizeWord(filtered[0])
        } else if (filtered.length > 0) {
          setPrefix(nextPrefix)
          const idx = ALPHA_ROW.indexOf(ch)
          if (idx >= 0) setAlphaIdx(idx)
          setActiveRow("alpha")
        }
        return
      }
      if (e.key === "Backspace") {
        e.preventDefault()
        setPrefix((p) => p.slice(0, -1))
        return
      }
      if (e.key === "Escape") {
        e.preventDefault()
        setPrefix("")
        setActiveRow("alpha")
        return
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [phase, prefix, finalizeWord])

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq

    // Terminal phases handle their own button mapping
    if (phase === "found" || phase === "nobackup") {
      if (buttonAction === "confirm") setScreen("SET_PIN")
      return
    }
    if (phase === "invalid") {
      if (buttonAction === "confirm") {
        setWords([])
        setPrefix("")
        setPhase("entry")
        setErrorMsg(null)
      }
      return
    }
    if (phase === "verifying") return

    // Entry phase
    if (buttonAction === "left") {
      if (activeRow === "alpha") {
        setAlphaIdx((i) => (i - 1 + ALPHA_ROW.length) % ALPHA_ROW.length)
      } else if (matches.length > 0) {
        setMatchIdx((i) => (i - 1 + matches.length) % matches.length)
      }
    } else if (buttonAction === "right") {
      if (activeRow === "alpha") {
        setAlphaIdx((i) => (i + 1) % ALPHA_ROW.length)
      } else if (matches.length > 0) {
        setMatchIdx((i) => (i + 1) % matches.length)
      }
    } else if (buttonAction === "up" || buttonAction === "down") {
      if (matches.length > 0) {
        setActiveRow((r) => (r === "match" ? "alpha" : "match"))
      }
    } else if (buttonAction === "confirm") {
      if (activeRow === "match" && matches[matchIdx]) {
        finalizeWord(matches[matchIdx])
        return
      }
      const cell = ALPHA_ROW[alphaIdx]
      if (cell === "DEL") {
        setPrefix((p) => p.slice(0, -1))
      } else if (cell === "CLR") {
        setPrefix("")
      } else {
        const nextPrefix = prefix + cell
        // auto-commit if exactly one BIP-39 match left
        const filtered = wordlist.filter((w) => w.startsWith(nextPrefix))
        if (filtered.length === 1) {
          finalizeWord(filtered[0])
        } else if (filtered.length === 0) {
          // invalid extension — ignore
        } else {
          setPrefix(nextPrefix)
        }
      }
    }
  }, [
    buttonAction,
    buttonSeq,
    activeRow,
    alphaIdx,
    matchIdx,
    matches,
    prefix,
    phase,
    finalizeWord,
    setScreen,
  ])

  // ---------- render ----------

  if (phase === "verifying") {
    return (
      <ScreenLayout hideStatusBar>
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <div className="oled-text" style={{ fontSize: 13, fontWeight: 600 }}>
            Checking backup…
          </div>
          <div className="oled-text-dim" style={{ fontSize: 10 }}>
            Querying Solana devnet
          </div>
        </div>
      </ScreenLayout>
    )
  }

  if (phase === "found") {
    return (
      <ScreenLayout hideStatusBar hints={[{ key: "OK", label: "Continue" }]}>
        <div className="flex flex-col items-center justify-center h-full gap-3 px-3 text-center">
          <div className="oled-text-success" style={{ fontSize: 13, fontWeight: 700 }}>
            Backup found
          </div>
          <div className="oled-text" style={{ fontSize: 11, lineHeight: 1.4 }}>
            Vault restored from devnet. Set a new PIN to continue.
          </div>
        </div>
      </ScreenLayout>
    )
  }

  if (phase === "nobackup") {
    return (
      <ScreenLayout hideStatusBar hints={[{ key: "OK", label: "Continue" }]}>
        <div className="flex flex-col items-center justify-center h-full gap-3 px-3 text-center">
          <div className="oled-text-warning" style={{ fontSize: 13, fontWeight: 700 }}>
            No backup found
          </div>
          <div className="oled-text" style={{ fontSize: 11, lineHeight: 1.4 }}>
            Seed is valid, but nothing on-chain. Continue with an empty vault.
          </div>
        </div>
      </ScreenLayout>
    )
  }

  if (phase === "invalid") {
    return (
      <ScreenLayout hideStatusBar hints={[{ key: "OK", label: "Retry" }]}>
        <div className="flex flex-col items-center justify-center h-full gap-3 px-3 text-center">
          <div className="oled-text-danger" style={{ fontSize: 13, fontWeight: 700 }}>
            Restore failed
          </div>
          <div className="oled-text-dim" style={{ fontSize: 10, lineHeight: 1.4 }}>
            {errorMsg ?? "Try again from word 1."}
          </div>
        </div>
      </ScreenLayout>
    )
  }

  return (
    <ScreenLayout
      hideStatusBar
      hints={[
        { key: "◄►", label: "Move" },
        { key: "▲▼", label: matches.length > 0 ? "Row" : "—" },
        { key: "OK", label: "Pick" },
      ]}
    >
      <div className="flex flex-col h-full px-2 py-1.5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="oled-text" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.4 }}>
            RESTORE
          </span>
          <span className="oled-text-secondary" style={{ fontSize: 10 }}>
            Word {slot} of {TOTAL_WORDS}
          </span>
        </div>

        {/* Typed prefix preview */}
        <div
          className="oled-text"
          style={{
            fontSize: 13,
            marginTop: 4,
            fontFamily: "var(--font-console)",
            background: "rgba(0,255,65,0.04)",
            padding: "2px 6px",
            borderRadius: 2,
            minHeight: 18,
            letterSpacing: 0.5,
          }}
        >
          {prefix || <span className="oled-text-dim">type letters…</span>}
          <span className="char-cursor oled-text-accent">▍</span>
        </div>

        {/* Matches row */}
        <div className="flex gap-1.5 mt-1.5 flex-wrap" style={{ minHeight: 18 }}>
          {matches.length === 0 ? (
            <span className="oled-text-dim" style={{ fontSize: 10 }}>
              {prefix ? "no match" : "↓ pick letter below"}
            </span>
          ) : (
            matches.map((m, i) => {
              const active = activeRow === "match" && i === matchIdx
              return (
                <span
                  key={m}
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-console)",
                    padding: "1px 5px",
                    border: `1px solid ${active ? "var(--oled-accent)" : "var(--oled-border)"}`,
                    background: active ? "rgba(74,158,255,0.10)" : "transparent",
                    color: active ? "var(--oled-accent)" : "var(--oled-text)",
                  }}
                >
                  {m}
                </span>
              )
            })
          )}
        </div>

        {/* Alphabet */}
        <div className="flex-1 flex items-center mt-1.5">
          <div
            className="flex flex-wrap gap-[2px]"
            style={{ fontFamily: "var(--font-console)" }}
          >
            {ALPHA_ROW.map((c, i) => {
              const active = activeRow === "alpha" && i === alphaIdx
              const isAction = c === "DEL" || c === "CLR"
              return (
                <span
                  key={c}
                  style={{
                    fontSize: 11,
                    minWidth: isAction ? 24 : 13,
                    height: 16,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: isAction ? "0 4px" : 0,
                    border: `1px solid ${active ? "var(--oled-accent)" : "var(--oled-border)"}`,
                    background: active ? "rgba(74,158,255,0.10)" : "transparent",
                    color: active ? "var(--oled-accent)" : isAction ? "var(--oled-text-warning)" : "var(--oled-text)",
                  }}
                >
                  {c}
                </span>
              )
            })}
          </div>
        </div>

        {/* Entered words trail */}
        <div className="oled-text-dim" style={{ fontSize: 9, marginTop: 4, lineHeight: 1.2, maxHeight: 24, overflow: "hidden" }}>
          {words.length === 0
            ? "no words yet"
            : words
                .slice(-6)
                .map((w, i) => `${words.length - Math.min(6, words.length) + i + 1}. ${w}`)
                .join("  ")}
        </div>
      </div>
    </ScreenLayout>
  )
}
