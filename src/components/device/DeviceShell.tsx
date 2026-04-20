"use client"

import { OledScreen } from "./OledScreen"
import { Buttons, type ButtonAction } from "./Buttons"

interface DeviceShellProps {
  onButtonPress: (action: ButtonAction) => void
  children: React.ReactNode
}

export function DeviceShell({ onButtonPress, children }: DeviceShellProps) {
  return (
    <div className="device-shell" style={{ perspective: "1000px" }}>
      <div className="relative w-[400px] bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-700/50" style={{ transform: "rotateX(1deg)" }}>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-600" />

        <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-700/30 shadow-inner">
          <OledScreen>{children}</OledScreen>
        </div>

        <Buttons onPress={onButtonPress} />

        <div className="mt-4 text-center">
          <span className="text-zinc-500 text-[10px] tracking-[0.3em] font-medium uppercase">
            Black Seal v1.0
          </span>
        </div>
      </div>
    </div>
  )
}
