"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore, type DeviceScreen } from "@/lib/store/device-store"

const menuItems: { label: string; screen: DeviceScreen }[] = [
  { label: "Passwords", screen: "PASSWORD_LIST" },
  { label: "Notes", screen: "NOTE_LIST" },
  { label: "Settings", screen: "SETTINGS" },
]

export function MainMenu() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)

  const [selected, setSelected] = useState(0)
  const prevSeq = useRef(0)

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq

    if (buttonAction === "up") {
      setSelected((s) => Math.max(0, s - 1))
    } else if (buttonAction === "down") {
      setSelected((s) => Math.min(menuItems.length - 1, s + 1))
    } else if (buttonAction === "confirm") {
      setScreen(menuItems[selected].screen)
    }
  }, [buttonAction, buttonSeq, selected, setScreen])

  return (
    <div className="flex flex-col h-full">
      <div className="oled-text-dim" style={{ fontSize: 10 }}>
        MAIN MENU
      </div>
      <div className="flex-1 flex flex-col gap-1 justify-center">
        {menuItems.map((item, i) => (
          <div
            key={item.screen}
            style={{ fontSize: 14 }}
            className={i === selected ? "" : "oled-text-dim"}
          >
            {i === selected ? ">" : " "} {item.label}
          </div>
        ))}
      </div>
      <div className="oled-text-dim" style={{ fontSize: 10 }}>
        [▲▼] Select [OK] Enter
      </div>
    </div>
  )
}
