"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"

export function BackupChoice() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const setBackupEnabled = useDeviceStore((s) => s.setBackupEnabled)
  const setSetupComplete = useDeviceStore((s) => s.setSetupComplete)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const initVault = useVaultStore((s) => s.initVault)

  const [selected, setSelected] = useState(0)
  const prevSeq = useRef(0)

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
      setScreen("DASHBOARD")
    }
  }, [buttonAction, buttonSeq, selected, setBackupEnabled, setSetupComplete, initVault, setScreen])

  const options = ["Yes, Enable Backup", "No, Local Only"]

  return (
    <div className="flex flex-col h-full">
      <div className="oled-text-dim" style={{ fontSize: 10 }}>
        CLOUD BACKUP
      </div>
      <div className="oled-text-dim" style={{ fontSize: 10, marginTop: 2, lineHeight: 1.3 }}>
        Store encrypted backup on Solana?
      </div>
      <div className="flex-1 flex flex-col gap-1 justify-center">
        {options.map((opt, i) => (
          <div
            key={opt}
            style={{ fontSize: 12 }}
            className={i === selected ? "" : "oled-text-dim"}
          >
            {i === selected ? ">" : " "} {opt}
          </div>
        ))}
      </div>
      <div className="oled-text-dim" style={{ fontSize: 10 }}>
        [▲▼] Select [OK] Confirm
      </div>
    </div>
  )
}
