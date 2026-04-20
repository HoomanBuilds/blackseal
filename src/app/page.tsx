"use client"

import { DeviceShell } from "@/components/device/DeviceShell"
import { ScreenRouter } from "@/components/screens/ScreenRouter"

export default function Home() {
  return (
    <main className="min-h-screen desk-surface flex items-center justify-center gap-12 p-8">
      <DeviceShell>
        <ScreenRouter />
      </DeviceShell>

      <div className="w-[400px] h-[500px] rounded-xl border border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-zinc-600 text-sm">
        Companion App
      </div>
    </main>
  )
}
