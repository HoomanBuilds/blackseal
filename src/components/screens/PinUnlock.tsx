"use client"

import { useCallback } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { PinPad } from "@/components/device/PinPad"

export function PinUnlock() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const setLocked = useDeviceStore((s) => s.setLocked)
  const failedAttempts = useDeviceStore((s) => s.failedAttempts)
  const incrementFailedAttempts = useDeviceStore((s) => s.incrementFailedAttempts)
  const resetFailedAttempts = useDeviceStore((s) => s.resetFailedAttempts)
  const wipeDevice = useDeviceStore((s) => s.wipeDevice)

  const handleSubmit = useCallback(
    (pin: string) => {
      const storedPin = localStorage.getItem("bs_pin")
      if (pin === storedPin) {
        resetFailedAttempts()
        setLocked(false)
        setScreen("MAIN_MENU")
      } else {
        const newAttempts = failedAttempts + 1
        if (newAttempts >= 3) {
          localStorage.clear()
          wipeDevice()
          setScreen("WIPE_ANIMATION")
        } else {
          incrementFailedAttempts()
        }
      }
    },
    [failedAttempts, resetFailedAttempts, incrementFailedAttempts, setLocked, setScreen, wipeDevice]
  )

  return (
    <div className="flex flex-col h-full">
      <div className="oled-text-dim" style={{ fontSize: 10 }}>
        ENTER PIN
      </div>
      {failedAttempts > 0 && (
        <div style={{ fontSize: 10, color: "#ff4444", marginTop: 2 }}>
          Incorrect. {3 - failedAttempts} attempt{3 - failedAttempts !== 1 ? "s" : ""} left.
          {failedAttempts === 2 && " Next fail wipes all data."}
        </div>
      )}
      <div className="flex-1 flex items-center justify-center">
        <PinPad key={failedAttempts} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
