"use client"

import { useDeviceStore } from "@/lib/store/device-store"
import { BootScreen } from "./BootScreen"

export function ScreenRouter() {
  const screen = useDeviceStore((s) => s.screen)

  switch (screen) {
    case "BOOT_SCREEN":
      return <BootScreen />
    default:
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-xs">{screen}</div>
          <div className="text-[10px] mt-2 opacity-40">Not implemented</div>
        </div>
      )
  }
}
