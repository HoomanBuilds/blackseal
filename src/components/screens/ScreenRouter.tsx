"use client"

import { useDeviceStore } from "@/lib/store/device-store"
import { BootScreen } from "./BootScreen"
import { GenerateSeed } from "./GenerateSeed"
import { VerifySeed } from "./VerifySeed"
import { SetPin } from "./SetPin"
import { PinUnlock } from "./PinUnlock"

export function ScreenRouter() {
  const screen = useDeviceStore((s) => s.screen)

  switch (screen) {
    case "BOOT_SCREEN":
      return <BootScreen />
    case "GENERATE_SEED":
      return <GenerateSeed />
    case "VERIFY_SEED":
      return <VerifySeed />
    case "SET_PIN":
      return <SetPin />
    case "PIN_UNLOCK":
      return <PinUnlock />
    default:
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div style={{ fontSize: 11 }}>{screen}</div>
          <div className="oled-text-dim" style={{ fontSize: 10, marginTop: 4 }}>
            Not implemented
          </div>
        </div>
      )
  }
}
