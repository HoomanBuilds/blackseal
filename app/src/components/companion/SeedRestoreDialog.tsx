"use client"

import { useState } from "react"
import { validateSeedPhrase } from "@/lib/crypto/bip39"

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (phrase: string) => Promise<void>
}

export function SeedRestoreDialog({ open, onClose, onSubmit }: Props) {
  const [phrase, setPhrase] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const normalized = phrase.trim().toLowerCase().replace(/\s+/g, " ")
  const wordCount = normalized ? normalized.split(" ").length : 0
  const isValid = wordCount === 24 && validateSeedPhrase(normalized)

  const handleSubmit = async () => {
    if (!isValid || busy) return
    setBusy(true)
    setError(null)
    try {
      await onSubmit(normalized)
    } catch (err) {
      setError(err instanceof Error ? err.message : "restore failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="console-panel w-[520px] p-5 flex flex-col gap-4"
        style={{ fontFamily: "var(--font-console), ui-monospace, monospace" }}
      >
        <header className="flex items-center justify-between">
          <span className="console-display-heading text-[13px]">RESTORE FROM DEVNET</span>
          <span className="console-hex">// SEED IMPORT</span>
        </header>
        <div className="console-hair" />

        <p className="console-label leading-relaxed text-[10px] tracking-[0.18em] opacity-80">
          Paste the 24-word seed phrase from your previous device. Words only, separated by spaces.
          The seed stays local — only the derived public key ever reaches Solana.
        </p>

        <textarea
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          disabled={busy}
          spellCheck={false}
          autoFocus
          rows={5}
          className="w-full bg-[var(--console-bg)] border border-[var(--console-hair-bright)] p-3 text-[12px] text-[color:var(--console-phosphor)] tracking-wider outline-none focus:border-[color:var(--console-accent)] transition-colors resize-none"
          placeholder="word1 word2 word3 … word24"
          style={{ fontFamily: "var(--font-console), ui-monospace, monospace" }}
        />

        <div className="flex items-center justify-between">
          <span className="console-hex">
            {wordCount}/24 words {isValid ? "· OK" : wordCount === 24 ? "· INVALID" : ""}
          </span>
          {error && (
            <span className="text-[10px] tracking-[0.2em] text-[color:var(--console-warn)]">
              ERR · {error}
            </span>
          )}
        </div>

        <div className="console-hair" />

        <div className="grid grid-cols-2 gap-px bg-[var(--console-hair)]">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="console-btn py-3 border-0 rounded-none"
          >
            <span>CANCEL</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || busy}
            className="console-btn is-primary py-3 border-0 rounded-none"
          >
            <span>{busy ? "FETCHING…" : "↓ PULL VAULT"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
