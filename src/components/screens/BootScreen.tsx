"use client"

import { useEffect, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"

export function BootScreen() {
  const [progress, setProgress] = useState(0)
  const setScreen = useDeviceStore((s) => s.setScreen)
  const setupComplete = useDeviceStore((s) => s.setupComplete)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setScreen(setupComplete ? "PIN_UNLOCK" : "GENERATE_SEED")
          }, 300)
          return 100
        }
        return p + 4
      })
    }, 60)
    return () => clearInterval(interval)
  }, [setScreen, setupComplete])

  const barWidth = Math.floor((progress / 100) * 17)

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div style={{ fontSize: 16, fontWeight: "bold", letterSpacing: "0.15em" }}>
        BLACK SEAL
      </div>
      <div className="oled-text-dim" style={{ fontSize: 11, marginTop: 4 }}>
        Offline Vault
      </div>
      <div style={{ fontSize: 12, marginTop: 14 }}>
        [{"\u2588".repeat(barWidth)}
        {"\u2591".repeat(17 - barWidth)}]
      </div>
      <div className="oled-text-dim" style={{ fontSize: 10, marginTop: 4 }}>
        v1.0.0
      </div>
    </div>
  )
}
