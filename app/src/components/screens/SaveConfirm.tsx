"use client"

import { useEffect } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { ScreenLayout } from "@/components/device/ScreenLayout"

export function SaveConfirm() {
  const message = useDeviceStore((s) => s.saveConfirmMessage)
  const returnScreen = useDeviceStore((s) => s.saveConfirmReturnScreen)
  const setScreen = useDeviceStore((s) => s.setScreen)
  const clearSaveConfirm = useDeviceStore((s) => s.clearSaveConfirm)

  useEffect(() => {
    const timer = setTimeout(() => {
      const target = returnScreen ?? "DASHBOARD"
      clearSaveConfirm()
      setScreen(target)
    }, 1500)
    return () => clearTimeout(timer)
  }, [returnScreen, setScreen, clearSaveConfirm])

  return (
    <ScreenLayout hideStatusBar>
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <div className="oled-text-success" style={{ fontSize: 22, fontWeight: 600 }}>
          ✓ SAVED
        </div>
        {message && (
          <div className="oled-text-secondary text-center" style={{ fontSize: 12 }}>
            {message}
          </div>
        )}
      </div>
    </ScreenLayout>
  )
}
