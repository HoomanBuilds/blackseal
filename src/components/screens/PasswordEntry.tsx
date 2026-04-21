"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"

const REVEAL_MS = 10_000

export function PasswordEntry() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const selectedId = useDeviceStore((s) => s.selectedPasswordId)
  const setSelectedPasswordId = useDeviceStore((s) => s.setSelectedPasswordId)
  const passwords = useVaultStore((s) => s.vault?.passwords ?? [])
  const deletePassword = useVaultStore((s) => s.deletePassword)

  const entry = passwords.find((p) => p.id === selectedId)
  const [revealed, setRevealed] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
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
    } else if (buttonAction === "down" && !confirmDelete) {
      setConfirmDelete(true)
    } else if (buttonAction === "up" && confirmDelete) {
      setConfirmDelete(false)
    } else if (buttonAction === "right" && confirmDelete && entry) {
      deletePassword(entry.id)
      setSelectedPasswordId(null)
      setScreen("PASSWORD_LIST")
    }
  }, [buttonAction, buttonSeq, confirmDelete, entry, deletePassword, setSelectedPasswordId, setScreen])

  if (!entry) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="oled-text-dim" style={{ fontSize: 11 }}>
          Not found
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="oled-text-dim" style={{ fontSize: 10 }}>
        PASSWORD
      </div>
      <div style={{ fontSize: 12, marginTop: 4, fontWeight: "bold" }}>
        {entry.label}
      </div>
      <div style={{ fontSize: 11, marginTop: 6, wordBreak: "break-all" }}>
        {revealed ? entry.password : "•".repeat(Math.min(entry.password.length, 18))}
      </div>
      {revealed && (
        <div className="oled-text-dim" style={{ fontSize: 9, marginTop: 2 }}>
          Hides in {remaining}s
        </div>
      )}
      <div className="flex-1" />
      {confirmDelete ? (
        <div style={{ fontSize: 10, color: "#ff4444" }}>
          Delete? [►] Yes [▲] Cancel
        </div>
      ) : (
        <div className="oled-text-dim" style={{ fontSize: 10 }}>
          [OK] {revealed ? "Hide" : "Reveal"} [▼] Del [◄] Back
        </div>
      )}
    </div>
  )
}
