"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { ScreenLayout } from "@/components/device/ScreenLayout"

const REVEAL_MS = 10_000

export function PasswordEntry() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const selectedId = useDeviceStore((s) => s.selectedPasswordId)
  const setSelectedPasswordId = useDeviceStore((s) => s.setSelectedPasswordId)
  const setEditingId = useDeviceStore((s) => s.setEditingId)
  const setDeleteTarget = useDeviceStore((s) => s.setDeleteTarget)
  const backupEnabled = useDeviceStore((s) => s.backupEnabled)
  const passwords = useVaultStore((s) => s.vault?.passwords ?? [])

  const entry = passwords.find((p) => p.id === selectedId)
  const [revealed, setRevealed] = useState(false)
  const [remaining, setRemaining] = useState(REVEAL_MS / 1000)
  const prevSeq = useRef(0)

  useEffect(() => {
    if (!revealed) return
    setRemaining(REVEAL_MS / 1000)
    const tick = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(tick)
          setRevealed(false)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(tick)
  }, [revealed])

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq

    if (buttonAction === "left") {
      setSelectedPasswordId(null)
      setScreen("PASSWORD_LIST")
    } else if (buttonAction === "confirm") {
      setRevealed((r) => !r)
    } else if (buttonAction === "right" && entry) {
      setEditingId(entry.id)
      setScreen("EDIT_PASSWORD")
    } else if (buttonAction === "down" && entry) {
      setDeleteTarget({ kind: "password", id: entry.id, label: entry.label })
      setScreen("DELETE_CONFIRM")
    }
  }, [buttonAction, buttonSeq, entry, setSelectedPasswordId, setScreen, setEditingId, setDeleteTarget])

  if (!entry) {
    return (
      <ScreenLayout title="CREDENTIAL" showBack>
        <div className="flex flex-col h-full items-center justify-center">
          <div className="oled-text-dim" style={{ fontSize: 11 }}>
            Not found
          </div>
        </div>
      </ScreenLayout>
    )
  }

  const masked = "•".repeat(Math.min(entry.password.length, 20))

  return (
    <ScreenLayout
      title="CREDENTIAL"
      showBack
      hints={[
        { key: "OK", label: revealed ? "Hide" : "Reveal" },
        { key: "▶", label: "Edit" },
        { key: "▼", label: "Delete" },
        { key: "◄", label: "Back" },
      ]}
    >
      <div className="flex flex-col gap-2 px-1 py-2">
        <div className="flex items-center justify-between">
          <span className="oled-text" style={{ fontSize: 14, fontWeight: 600 }}>
            {entry.label}
          </span>
          <BackupBadge backedUp={entry.backedUp} backupEnabled={backupEnabled} />
        </div>
        <div className="oled-divider" />
        <Field label="USER" value={entry.username || "—"} />
        <Field label="PASS" value={revealed ? entry.password : masked} />
        {revealed && (
          <div className="oled-text-dim text-center" style={{ fontSize: 10 }}>
            Hides in {remaining}s
          </div>
        )}
      </div>
    </ScreenLayout>
  )
}

function BackupBadge({ backedUp, backupEnabled }: { backedUp: boolean; backupEnabled: boolean }) {
  if (!backupEnabled)
    return (
      <span className="oled-text-dim" style={{ fontSize: 10 }}>
        BACKUP OFF
      </span>
    )
  return backedUp ? (
    <span className="oled-text-success" style={{ fontSize: 10 }}>
      SYNCED ✓
    </span>
  ) : (
    <span className="oled-text-warning" style={{ fontSize: 10 }}>
      NOT BACKED UP
    </span>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="oled-text-dim" style={{ fontSize: 11, width: 40 }}>
        {label}
      </span>
      <span
        className="oled-text"
        style={{ fontSize: 12, fontFamily: "var(--font-console)", wordBreak: "break-all" }}
      >
        {value}
      </span>
    </div>
  )
}
