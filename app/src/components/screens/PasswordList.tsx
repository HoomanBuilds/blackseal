"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { ScreenLayout } from "@/components/device/ScreenLayout"

const VISIBLE_COUNT = 6

export function PasswordList() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const backupEnabled = useDeviceStore((s) => s.backupEnabled)
  const passwords = useVaultStore((s) => s.vault?.passwords ?? [])
  const setSelectedPasswordId = useDeviceStore((s) => s.setSelectedPasswordId)

  const total = passwords.length + 1
  const [selected, setSelected] = useState(0)
  const prevSeq = useRef(0)

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq

    if (buttonAction === "up") {
      setSelected((s) => Math.max(0, s - 1))
    } else if (buttonAction === "down") {
      setSelected((s) => Math.min(total - 1, s + 1))
    } else if (buttonAction === "left") {
      setScreen("VAULT_MENU")
    } else if (buttonAction === "confirm") {
      if (selected === 0) {
        setScreen("ADD_PASSWORD")
      } else {
        const entry = passwords[selected - 1]
        if (entry) {
          setSelectedPasswordId(entry.id)
          setScreen("PASSWORD_ENTRY")
        }
      }
    }
  }, [buttonAction, buttonSeq, selected, total, passwords, setScreen, setSelectedPasswordId])

  const start = Math.max(0, Math.min(selected - Math.floor(VISIBLE_COUNT / 2), total - VISIBLE_COUNT))
  const end = Math.min(total, start + VISIBLE_COUNT)

  return (
    <ScreenLayout
      title={`PASSWORDS (${passwords.length})`}
      showBack
      hints={[
        { key: "▲▼", label: "Move" },
        { key: "OK", label: "Open" },
        { key: "◄", label: "Back" },
      ]}
    >
      <div className="flex flex-col gap-1 py-1">
        {Array.from({ length: end - start }).map((_, i) => {
          const idx = start + i
          const isSel = idx === selected
          if (idx === 0) {
            return (
              <div key="add" className={`oled-row ${isSel ? "is-selected" : ""}`}>
                <span className="oled-text-accent" style={{ marginRight: 8, fontSize: 12 }}>＋</span>
                <span className={isSel ? "oled-text" : "oled-text-secondary"}>Add New Password</span>
              </div>
            )
          }
          const p = passwords[idx - 1]
          if (!p) return null
          return (
            <div key={p.id} className={`oled-row ${isSel ? "is-selected" : ""}`}>
              {backupEnabled && (
                <span className={`oled-status-dot ${p.backedUp ? "is-success" : "is-warning"}`} />
              )}
              <span
                className={isSel ? "oled-text" : "oled-text-secondary"}
                style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {p.label}
              </span>
            </div>
          )
        })}
        {passwords.length === 0 && (
          <div className="oled-text-dim text-center" style={{ fontSize: 11, marginTop: 12 }}>
            No passwords saved yet
          </div>
        )}
      </div>
    </ScreenLayout>
  )
}
