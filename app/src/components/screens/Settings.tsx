"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useDeviceStore, type DeviceScreen } from "@/lib/store/device-store"
import { ScreenLayout } from "@/components/device/ScreenLayout"
import { OledIcon } from "@/components/device/OledIcon"

type IconName = "shield-key" | "cloud" | "trash"

interface MenuItem {
  icon: IconName
  label: string
  screen: DeviceScreen
  danger?: boolean
}

export function Settings() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)

  const items = useMemo<MenuItem[]>(
    () => [
      { icon: "shield-key", label: "Change PIN", screen: "CHANGE_PIN" },
      { icon: "cloud", label: "Backup", screen: "BACKUP_SETTINGS" },
      { icon: "trash", label: "Wipe Device", screen: "WIPE_DEVICE", danger: true },
    ],
    []
  )

  const [selected, setSelected] = useState(0)
  const prevSeq = useRef(buttonSeq)

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq

    if (buttonAction === "up") {
      setSelected((s) => Math.max(0, s - 1))
    } else if (buttonAction === "down") {
      setSelected((s) => Math.min(items.length - 1, s + 1))
    } else if (buttonAction === "left") {
      setScreen("VAULT_MENU")
    } else if (buttonAction === "confirm") {
      setScreen(items[selected].screen)
    }
  }, [buttonAction, buttonSeq, selected, items, setScreen])

  return (
    <ScreenLayout
      title="SETTINGS"
      showBack
      hints={[
        { key: "▲▼", label: "Move" },
        { key: "OK", label: "Open" },
        { key: "◄", label: "Back" },
      ]}
    >
      <div className="flex flex-col gap-1 py-2">
        {items.map((item, i) => {
          const isSel = selected === i
          const labelClass = item.danger
            ? isSel
              ? "oled-text-danger"
              : "oled-text-secondary"
            : isSel
              ? "oled-text"
              : "oled-text-secondary"
          return (
            <div key={item.label} className={`oled-row ${isSel ? "is-selected" : ""}`}>
              <OledIcon name={item.icon} size={14} className={labelClass} />
              <span className={labelClass} style={{ flex: 1, marginLeft: 10 }}>
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </ScreenLayout>
  )
}
