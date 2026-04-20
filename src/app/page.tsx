"use client"

import { DeviceShell } from "@/components/device/DeviceShell"
import type { ButtonAction } from "@/components/device/Buttons"

export default function Home() {
  function handleButtonPress(action: ButtonAction) {
    console.log("Button pressed:", action)
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center gap-12 p-8">
      <DeviceShell onButtonPress={handleButtonPress}>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-lg font-bold">BLACK SEAL</div>
          <div className="text-[10px] mt-1 opacity-60">v1.0</div>
          <div className="mt-3 text-[10px] opacity-40">Loading...</div>
        </div>
      </DeviceShell>

      <div className="w-[400px] h-[500px] rounded-xl border border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-zinc-600 text-sm">
        Companion App
      </div>
    </main>
  )
}
