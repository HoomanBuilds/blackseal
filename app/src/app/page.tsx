"use client"

import { DeviceShell } from "@/components/device/DeviceShell"
import { ScreenRouter } from "@/components/screens/ScreenRouter"
import { CompanionPanel } from "@/components/companion/CompanionPanel"
import { useAutoLock } from "@/lib/hooks/useAutoLock"
import { useVaultPersistence } from "@/lib/hooks/useVaultPersistence"

export default function Home() {
  useAutoLock()
  useVaultPersistence()

  return (
    <main className="min-h-screen desk-surface flex items-center justify-center gap-12 p-8">
      <DeviceShell>
        <ScreenRouter />
      </DeviceShell>

      <CompanionPanel />
    </main>
  )
}
