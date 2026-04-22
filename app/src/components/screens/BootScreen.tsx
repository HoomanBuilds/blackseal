"use client"

import { useEffect, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"

const TITLE = "BLACK SEAL"

export function BootScreen() {
  const [progress, setProgress] = useState(0)
  const [revealed, setRevealed] = useState(0)
  const setScreen = useDeviceStore((s) => s.setScreen)
  const setSetupComplete = useDeviceStore((s) => s.setSetupComplete)
  const setBackupEnabled = useDeviceStore((s) => s.setBackupEnabled)
  const setLocked = useDeviceStore((s) => s.setLocked)

  useEffect(() => {
    // Rehydrate persisted setup state so refreshes route correctly
    const hasPinHash = !!localStorage.getItem("bs_pin_hash")
    const hasSeed = !!localStorage.getItem("bs_seed_ct")
    const isSetup = hasPinHash && hasSeed
    setSetupComplete(isSetup)
    setBackupEnabled(localStorage.getItem("bs_backup") === "true")
    if (isSetup) setLocked(true)

    let timeoutId: ReturnType<typeof setTimeout>
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          timeoutId = setTimeout(() => {
            setScreen(isSetup ? "PIN_UNLOCK" : "GENERATE_SEED")
          }, 300)
          return 100
        }
        return p + 4
      })
    }, 60)
    return () => {
      clearInterval(interval)
      clearTimeout(timeoutId)
    }
  }, [setScreen, setSetupComplete, setBackupEnabled, setLocked])

  useEffect(() => {
    if (revealed >= TITLE.length) return
    const id = setTimeout(() => setRevealed((r) => r + 1), 50)
    return () => clearTimeout(id)
  }, [revealed])

  const barWidth = Math.floor((progress / 100) * 17)

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div style={{ fontSize: 16, fontWeight: "bold", letterSpacing: "0.15em" }}>
        {TITLE.slice(0, revealed)}
        {revealed < TITLE.length && <span className="animate-pulse">_</span>}
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
