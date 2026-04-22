"use client"

import { DeviceShell } from "@/components/device/DeviceShell"
import { ScreenRouter } from "@/components/screens/ScreenRouter"
import { UsbCable } from "@/components/device/UsbCable"
import { CompanionPanel } from "@/components/companion/CompanionPanel"
import { useAutoLock } from "@/lib/hooks/useAutoLock"
import { useVaultPersistence } from "@/lib/hooks/useVaultPersistence"

export default function Home() {
  useAutoLock()
  useVaultPersistence()

  return (
    <main className="min-h-screen desk-surface flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 p-4 lg:p-8">
      <DeviceShell>
        <ScreenRouter />
      </DeviceShell>

      <div className="hidden lg:block">
        <UsbCable />
      </div>

      <CompanionPanel />
    </main>
  )
}
