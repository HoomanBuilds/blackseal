"use client"

import { useEffect, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"

export function WipeAnimation() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setDone(true)
          setTimeout(() => setScreen("BOOT_SCREEN"), 1500)
          return 100
        }
        return p + 5
      })
    }, 80)
    return () => clearInterval(interval)
  }, [setScreen])

  const barWidth = Math.floor((progress / 100) * 17)

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div style={{ fontSize: 13, fontWeight: "bold", color: "#ff4444" }}>
        WIPING...
      </div>
      <div style={{ fontSize: 12, marginTop: 10 }}>
        [{"\u2588".repeat(barWidth)}
        {"\u2591".repeat(17 - barWidth)}]
      </div>
      {done && (
        <div style={{ fontSize: 11, marginTop: 8 }}>
          Device wiped.
        </div>
      )}
    </div>
  )
}
