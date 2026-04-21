"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"

export function WipeDevice() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const wipeDevice = useDeviceStore((s) => s.wipeDevice)
  const clearVault = useVaultStore((s) => s.clearVault)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)

  const options = ["No, Cancel", "Yes, Wipe Everything"]
  const [selected, setSelected] = useState(0)
  const prevSeq = useRef(0)

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq

    if (buttonAction === "up" || buttonAction === "down") {
      setSelected((s) => (s === 0 ? 1 : 0))
    } else if (buttonAction === "left") {
      setScreen("SETTINGS")
    } else if (buttonAction === "confirm") {
      if (selected === 1) {
        localStorage.clear()
        clearVault()
        wipeDevice()
        setScreen("WIPE_ANIMATION")
      } else {
        setScreen("SETTINGS")
      }
    }
  }, [buttonAction, buttonSeq, selected, clearVault, wipeDevice, setScreen])

  return (
    <div className="flex flex-col h-full">
      <div style={{ fontSize: 10, color: "#ff4444" }}>WIPE DEVICE?</div>
      <div className="oled-text-dim" style={{ fontSize: 10, marginTop: 2, lineHeight: 1.3 }}>
        Erases all data. Cannot undo.
      </div>
      <div className="flex-1 flex flex-col justify-center" style={{ gap: 2 }}>
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
