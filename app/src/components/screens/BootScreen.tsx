"use client"

import { useEffect, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { ScreenLayout } from "@/components/device/ScreenLayout"

const TITLE = "BLACK SEAL"

export function BootScreen() {
  const [progress, setProgress] = useState(0)
  const [revealed, setRevealed] = useState(0)
  const setScreen = useDeviceStore((s) => s.setScreen)
  const setSetupComplete = useDeviceStore((s) => s.setSetupComplete)
  const setBackupEnabled = useDeviceStore((s) => s.setBackupEnabled)
  const setLocked = useDeviceStore((s) => s.setLocked)
  const incrementFailedAttempts = useDeviceStore((s) => s.incrementFailedAttempts)
  const wipeDevice = useDeviceStore((s) => s.wipeDevice)

  useEffect(() => {
    const hasPinHash = !!localStorage.getItem("bs_pin_hash")
    const hasSeed = !!localStorage.getItem("bs_seed_ct")
    const isSetup = hasPinHash && hasSeed
    setSetupComplete(isSetup)
    setBackupEnabled(localStorage.getItem("bs_backup") === "true")
    if (isSetup) setLocked(true)

    const persisted = parseInt(localStorage.getItem("bs_failed") || "0", 10)
    if (persisted >= 3) {
      localStorage.clear()
      wipeDevice()
    } else if (persisted > 0) {
      for (let i = 0; i < persisted; i++) incrementFailedAttempts()
    }

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
  }, [setScreen, setSetupComplete, setBackupEnabled, setLocked, incrementFailedAttempts, wipeDevice])

  useEffect(() => {
    if (revealed >= TITLE.length) return
    const id = setTimeout(() => setRevealed((r) => r + 1), 50)
    return () => clearTimeout(id)
  }, [revealed])

  return (
    <ScreenLayout hideStatusBar>
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <div
          className="oled-text"
          style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.18em" }}
        >
          {TITLE.slice(0, revealed)}
          {revealed < TITLE.length && <span className="animate-pulse oled-text-accent">_</span>}
        </div>
        <div className="oled-text-secondary" style={{ fontSize: 11 }}>
          Offline Vault
        </div>
        <div
          style={{
            width: 200,
            height: 4,
            background: "var(--oled-border)",
            borderRadius: 2,
            overflow: "hidden",
            marginTop: 10,
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "var(--oled-accent)",
              transition: "width 60ms linear",
            }}
          />
        </div>
        <div className="oled-text-dim" style={{ fontSize: 10, marginTop: 4 }}>
          v0.1.0
        </div>
      </div>
    </ScreenLayout>
  )
}
