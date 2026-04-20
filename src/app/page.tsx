"use client"

import { useState } from "react"
import { DeviceShell } from "@/components/device/DeviceShell"
import { ScreenRouter } from "@/components/screens/ScreenRouter"
import type { ButtonAction } from "@/components/device/Buttons"

export default function Home() {
  const [lastAction, setLastAction] = useState<ButtonAction | null>(null)

  function handleButtonPress(action: ButtonAction) {
    setLastAction(action)
    setTimeout(() => setLastAction(null), 50)
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center gap-12 p-8">
      <DeviceShell onButtonPress={handleButtonPress}>
        <ScreenRouter onButtonPress={lastAction} />
      </DeviceShell>

      <div className="w-[400px] h-[500px] rounded-xl border border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-zinc-600 text-sm">
        Companion App
      </div>
    </main>
  )
}
