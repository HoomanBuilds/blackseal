"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { ScreenLayout } from "@/components/device/ScreenLayout"

interface Option {
  title: string
  description: string
}

const OPTIONS: Option[] = [
  { title: "Yes, Enable Backup", description: "Encrypted backup on Solana" },
  { title: "No, Local Only", description: "Vault never leaves this device" },
]

export function BackupChoice() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const setBackupEnabled = useDeviceStore((s) => s.setBackupEnabled)
  const setSetupComplete = useDeviceStore((s) => s.setSetupComplete)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const initVault = useVaultStore((s) => s.initVault)

  const [selected, setSelected] = useState(0)
  const prevSeq = useRef(buttonSeq)

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq

    if (buttonAction === "up" || buttonAction === "down") {
      setSelected((s) => (s === 0 ? 1 : 0))
    } else if (buttonAction === "confirm") {
      const enabled = selected === 0
      setBackupEnabled(enabled)
      setSetupComplete(true)
      initVault(enabled)
      localStorage.setItem("bs_setup", "true")
      localStorage.setItem("bs_backup", enabled ? "true" : "false")
      setScreen("SETUP_COMPLETE")
    }
  }, [buttonAction, buttonSeq, selected, setBackupEnabled, setSetupComplete, initVault, setScreen])

  return (
    <ScreenLayout
      title="BACKUP"
      hints={[
        { key: "▲▼", label: "Select" },
        { key: "OK", label: "Confirm" },
      ]}
    >
      <div className="flex flex-col h-full px-1 py-2">
        <div className="oled-text" style={{ fontSize: 13, fontWeight: 600 }}>
          Store encrypted backup on Solana?
        </div>
        <div className="oled-text-secondary" style={{ fontSize: 10, marginTop: 2 }}>
          Backup is optional. You can change this later.
        </div>
        <div className="flex-1 flex flex-col gap-2 justify-center mt-2">
          {OPTIONS.map((opt, i) => {
            const isSel = i === selected
            return (
              <div
                key={opt.title}
                className={`oled-card ${isSel ? "is-selected" : ""}`}
                style={{
                  borderColor: isSel ? "var(--oled-accent)" : "var(--oled-border)",
                  background: isSel ? "var(--oled-selection-bg)" : "var(--oled-card-bg)",
                }}
              >
                <div
                  className={isSel ? "oled-text" : "oled-text-secondary"}
                  style={{ fontSize: 12, fontWeight: 600 }}
                >
                  {opt.title}
                </div>
                <div className="oled-text-dim" style={{ fontSize: 10, marginTop: 2 }}>
                  {opt.description}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ScreenLayout>
  )
}
