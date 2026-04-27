"use client"

import { useEffect, useRef } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { ScreenLayout } from "@/components/device/ScreenLayout"

export function SetupComplete() {
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const setScreen = useDeviceStore((s) => s.setScreen)
  const backupEnabled = useDeviceStore((s) => s.backupEnabled)
  const lastSeq = useRef(0)

  useEffect(() => {
    if (buttonSeq !== lastSeq.current && buttonAction === "confirm") {
      lastSeq.current = buttonSeq
      setScreen("DASHBOARD")
    }
  }, [buttonAction, buttonSeq, setScreen])

  return (
    <ScreenLayout hideStatusBar hints={[{ key: "OK", label: "Enter Vault" }]}>
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <div className="oled-text-success" style={{ fontSize: 18, fontWeight: 600 }}>
          ✓ VAULT READY
        </div>
        <div className="flex flex-col gap-1 mt-2" style={{ fontSize: 12 }}>
          <Row label="PIN set" value="✓" valueClass="oled-text-success" />
          <Row label="Seed secured" value="✓" valueClass="oled-text-success" />
          <Row
            label="Backup"
            value={backupEnabled ? "ON" : "OFF"}
            valueClass={backupEnabled ? "oled-text-success" : "oled-text-dim"}
          />
        </div>
      </div>
    </ScreenLayout>
  )
}

function Row({ label, value, valueClass }: { label: string; value: string; valueClass: string }) {
  return (
    <div className="flex items-center justify-between gap-8" style={{ minWidth: 200 }}>
      <span className="oled-text-secondary">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  )
}
