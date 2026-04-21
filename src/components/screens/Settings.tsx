"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore, type DeviceScreen } from "@/lib/store/device-store"

type MenuItem = { label: string; action: "screen" | "wipe"; screen?: DeviceScreen }

export function Settings() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const backupEnabled = useDeviceStore((s) => s.backupEnabled)
  const setBackupEnabled = useDeviceStore((s) => s.setBackupEnabled)

  const items: MenuItem[] = [
    { label: "Change PIN", action: "screen", screen: "CHANGE_PIN" },
    { label: backupEnabled ? "Disable Backup" : "Enable Backup", action: "screen", screen: "SETTINGS" },
    { label: "Wipe Device", action: "screen", screen: "WIPE_DEVICE" },
  ]

  const [selected, setSelected] = useState(0)
  const prevSeq = useRef(0)

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq

    if (buttonAction === "up") {
      setSelected((s) => Math.max(0, s - 1))
    } else if (buttonAction === "down") {
      setSelected((s) => Math.min(items.length - 1, s + 1))
    } else if (buttonAction === "left") {
      setScreen("MAIN_MENU")
    } else if (buttonAction === "confirm") {
      const item = items[selected]
      if (selected === 1) {
        const next = !backupEnabled
        setBackupEnabled(next)
        localStorage.setItem("bs_backup", next ? "true" : "false")
      } else if (item.screen) {
        setScreen(item.screen)
      }
    }
  }, [buttonAction, buttonSeq, selected, items, backupEnabled, setBackupEnabled, setScreen])

  return (
    <div className="flex flex-col h-full">
      <div className="oled-text-dim" style={{ fontSize: 10 }}>
        SETTINGS
      </div>
      <div className="flex-1 flex flex-col justify-center" style={{ gap: 2 }}>
        {items.map((item, i) => (
          <div
            key={item.label}
            style={{ fontSize: 12 }}
            className={i === selected ? "" : "oled-text-dim"}
          >
            {i === selected ? ">" : " "} {item.label}
          </div>
        ))}
      </div>
      <div className="oled-text-dim" style={{ fontSize: 10 }}>
        [◄] Back [OK] Select
      </div>
    </div>
  )
}
