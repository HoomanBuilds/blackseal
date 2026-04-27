"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { ScreenLayout } from "@/components/device/ScreenLayout"

export function WipeDevice() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const wipeDevice = useDeviceStore((s) => s.wipeDevice)
  const clearVault = useVaultStore((s) => s.clearVault)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)

  const options = [
    { label: "No, Cancel", danger: false },
    { label: "Yes, Wipe Everything", danger: true },
  ]
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
    <ScreenLayout
      title="WIPE DEVICE"
      showBack
      hints={[
        { key: "▲▼", label: "Move" },
        { key: "OK", label: "Confirm" },
        { key: "◄", label: "Back" },
      ]}
    >
      <div className="flex flex-col h-full px-1 py-2 gap-3">
        <div className="oled-text-danger" style={{ fontSize: 13, fontWeight: 600 }}>
          ⚠ ERASE ALL DATA?
        </div>
        <div className="oled-text-secondary" style={{ fontSize: 11, lineHeight: 1.4 }}>
          This will permanently delete every password, note, and the seed phrase
          stored on this device.
        </div>
        <div className="oled-text-dim" style={{ fontSize: 10 }}>
          This cannot be undone.
        </div>
        <div className="flex flex-col gap-1 mt-1">
          {options.map((opt, i) => {
            const isSel = selected === i
            const cls = opt.danger
              ? isSel
                ? "oled-text-danger"
                : "oled-text-secondary"
              : isSel
                ? "oled-text"
                : "oled-text-secondary"
            return (
              <div key={opt.label} className={`oled-row ${isSel ? "is-selected" : ""}`}>
                <span className={cls} style={{ fontSize: 12 }}>
                  {opt.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ScreenLayout>
  )
}
