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
      <div className="text-base font-bold tracking-wider">BLACK SEAL</div>
      <div className="text-[10px] mt-1 opacity-50">Offline Vault</div>
      <div className="mt-4 text-[10px]">
        [{"\u2588".repeat(barWidth)}
        {"\u2591".repeat(17 - barWidth)}]
      </div>
      <div className="mt-1 text-[10px] opacity-40">v1.0.0</div>
    </div>
  )
}
