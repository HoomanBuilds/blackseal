"use client"

import Link from "next/link"
import { DeviceShell } from "@/components/device/DeviceShell"
import { ScreenRouter } from "@/components/screens/ScreenRouter"
import { UsbCable } from "@/components/device/UsbCable"
import { CompanionPanel } from "@/components/companion/CompanionPanel"
import { useAutoLock } from "@/lib/hooks/useAutoLock"
import { useVaultPersistence } from "@/lib/hooks/useVaultPersistence"

export default function SimulatorPage() {
  useAutoLock()
  useVaultPersistence()

  return (
    <div className="min-h-screen desk-surface flex flex-col">
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#E4E4E7]">
        <Link
          href="/"
          className="flex items-center gap-2 no-underline"
          style={{
            fontFamily: "var(--l-display, var(--font-display))",
            fontSize: 15,
            fontWeight: 600,
            color: "#171717",
            letterSpacing: "-0.02em",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 24,
              height: 24,
              borderRadius: 5,
              background: "#171717",
              color: "#FCFCFC",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "-0.04em",
            }}
          >
            B
          </span>
          Black Seal
        </Link>
        <span
          style={{
            fontFamily: "var(--font-console, ui-monospace, monospace)",
            fontSize: 11,
            color: "#A1A1AA",
            letterSpacing: "0.05em",
          }}
        >
          Simulator · v0.1.0
        </span>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 p-4 lg:p-8">
        <DeviceShell>
          <ScreenRouter />
        </DeviceShell>

        <div className="hidden lg:block">
          <UsbCable />
        </div>

        <CompanionPanel />
      </main>
    </div>
  )
}
