"use client"

import Image from "next/image"
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
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-[#DCDCE0] bg-[#F4F4F5]">
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline"
          style={{
            fontFamily: "var(--font-syne), system-ui, sans-serif",
            fontSize: 18,
            fontWeight: 600,
            color: "#171717",
            letterSpacing: "-0.02em",
          }}
        >
          <Image
            src="/blackseal-logo.png"
            alt="Black Seal"
            width={26}
            height={26}
            priority
            style={{ display: "block", width: 26, height: 26, objectFit: "contain" }}
          />
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

      <div
        className="text-center px-4 py-3"
        style={{
          background: "#EDEDF0",
          borderBottom: "1px solid #DCDCE0",
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
          fontSize: 14,
          color: "#52525B",
          lineHeight: 1.5,
        }}
      >
        A browser simulation of Black Seal, the offline hardware vault. Real encryption, real seed phrases, no install required.
      </div>

      <main className="flex-1 flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
        <DeviceShell>
          <ScreenRouter />
        </DeviceShell>

        <div className="hidden lg:flex lg:items-center">
          <UsbCable />
        </div>

        <div className="w-full max-w-[420px] lg:w-[420px] lg:max-w-[420px] flex">
          <CompanionPanel />
        </div>
      </main>

      <div className="app-footer-fade" aria-hidden="true" />

      <div className="app-footer-wordmark" aria-hidden="true">
        <svg
          viewBox="0 20 1000 175"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="bs-red-to-black"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="40"
              x2="0"
              y2="195"
            >
              <stop offset="0%" stopColor="#ff414c" />
              <stop offset="45%" stopColor="#ff414c" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="195"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fontFamily="var(--font-syne), system-ui, sans-serif"
            fontWeight="800"
            fontSize="220"
            fill="url(#bs-red-to-black)"
          >
            BLACKSEAL
          </text>
        </svg>
      </div>
    </div>
  )
}
