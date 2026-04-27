"use client"

import { useEffect, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { ScreenLayout } from "@/components/device/ScreenLayout"

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

  return (
    <ScreenLayout hideStatusBar>
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <div className="oled-text-danger" style={{ fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>
          WIPING…
        </div>
        <div
          style={{
            width: 220,
            height: 6,
            background: "var(--oled-border)",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "var(--oled-danger)",
              transition: "width 80ms linear",
            }}
          />
        </div>
        <div className="oled-text-dim" style={{ fontSize: 10 }}>
          {progress}%
        </div>
        {done && (
          <div className="oled-text-secondary" style={{ fontSize: 11, marginTop: 4 }}>
            Device wiped.
          </div>
        )}
      </div>
    </ScreenLayout>
  )
}
