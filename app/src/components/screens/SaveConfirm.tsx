"use client"

import { useEffect } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { ScreenLayout } from "@/components/device/ScreenLayout"
import { OledIcon } from "@/components/device/OledIcon"

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
      <div className="oled-flash is-success" />
      <div className="flex flex-col items-center justify-center h-full gap-2 oled-saved-pop">
        <div
          className="oled-text-success flex items-center gap-2"
          style={{ fontSize: 22, fontWeight: 600 }}
        >
          <OledIcon name="check" size={22} strokeWidth={2.2} />
          SAVED
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
