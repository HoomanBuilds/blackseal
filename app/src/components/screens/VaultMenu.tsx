"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useDeviceStore, type DeviceScreen } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { ScreenLayout } from "@/components/device/ScreenLayout"

interface MenuItem {
  icon: string
  label: string
  screen: DeviceScreen
  count?: number
}

export function VaultMenu() {
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const setScreen = useDeviceStore((s) => s.setScreen)
  const vault = useVaultStore((s) => s.vault)
  const [selected, setSelected] = useState(0)
  const lastSeq = useRef(buttonSeq)

  const items = useMemo<MenuItem[]>(
    () => [
      { icon: "🔑", label: "Passwords", screen: "PASSWORD_LIST", count: vault?.passwords.length ?? 0 },
      { icon: "📝", label: "Notes", screen: "NOTE_LIST", count: vault?.notes.length ?? 0 },
      { icon: "⚙", label: "Settings", screen: "SETTINGS" },
      { icon: "ℹ", label: "Device Info", screen: "DEVICE_INFO" },
    ],
    [vault?.passwords.length, vault?.notes.length]
  )

  useEffect(() => {
    if (buttonSeq === lastSeq.current) return
    lastSeq.current = buttonSeq
    if (buttonAction === "up") setSelected((s) => Math.max(0, s - 1))
    else if (buttonAction === "down") setSelected((s) => Math.min(items.length - 1, s + 1))
    else if (buttonAction === "left") setScreen("DASHBOARD")
    else if (buttonAction === "confirm") setScreen(items[selected].screen)
  }, [buttonAction, buttonSeq, selected, setScreen, items])

  return (
    <ScreenLayout
      title="VAULT"
      showBack
      hints={[
        { key: "▲▼", label: "Move" },
        { key: "OK", label: "Open" },
        { key: "◄", label: "Back" },
      ]}
    >
      <div className="flex flex-col gap-1 py-2">
        {items.map((item, i) => (
          <div key={item.label} className={`oled-row ${selected === i ? "is-selected" : ""}`}>
            <span style={{ fontSize: 14, marginRight: 10 }}>{item.icon}</span>
            <span className={selected === i ? "oled-text" : "oled-text-secondary"} style={{ flex: 1 }}>
              {item.label}
            </span>
            {item.count !== undefined && (
              <span className="oled-text-dim" style={{ fontSize: 11 }}>
                {item.count}
              </span>
            )}
          </div>
        ))}
      </div>
    </ScreenLayout>
  )
}
