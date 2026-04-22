"use client"

import { useMemo } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useConnectionStore } from "@/lib/store/connection-store"
import { BackupStatus } from "./BackupStatus"
import { TransactionLog } from "./TransactionLog"
import { RestoreFlow } from "./RestoreFlow"

export function CompanionPanel() {
  const backupEnabled = useDeviceStore((s) => s.backupEnabled)
  const setupComplete = useDeviceStore((s) => s.setupComplete)
  const isLocked = useDeviceStore((s) => s.isLocked)
  const isConnected = useConnectionStore((s) => s.isConnected)

  const sessionId = useMemo(
    () => Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, "0"),
    []
  )

  const canBackup = setupComplete && !isLocked && backupEnabled && isConnected
  const canRestore = backupEnabled && isConnected

  return (
    <aside
      className={`console-panel w-[420px] h-[620px] flex flex-col overflow-hidden transition-opacity duration-300 ${
        backupEnabled ? "opacity-100" : "opacity-70"
      }`}
      style={{ fontFamily: "var(--font-console), ui-monospace, monospace" }}
    >
      {/* MASTHEAD */}
      <header className="flex items-stretch">
        <div className="flex-1 px-5 py-5 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="console-display-heading text-[14px]">BLACK SEAL</span>
            <span className="console-hex">// COMPANION</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="console-label">SESSION</span>
            <span className="console-hex">0x{sessionId}</span>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between px-5 py-5 border-l border-[var(--console-hair)]">
          <span
            className={`console-chip ${
              backupEnabled ? "is-live" : "is-warn"
            }`}
          >
            {backupEnabled ? "BACKUP ON" : "LOCAL ONLY"}
          </span>
          <span className="console-hex mt-3">rev.0.1.0-devnet</span>
        </div>
      </header>

      <div className="console-hair" />

      <BackupStatus />

      <div className="console-hair" />

      <TransactionLog />

      <div className="console-hair" />

      <RestoreFlow
        onBackup={() => console.log("backup")}
        onRestore={() => console.log("restore")}
        canBackup={canBackup}
        canRestore={canRestore}
      />

      {/* FOOTPRINT LEDGER */}
      <footer className="px-5 py-2.5 flex items-center justify-between border-t border-[var(--console-hair)]">
        <span className="console-hex opacity-60">
          [PDA] ${"<"}black_seal_vault${">"}
        </span>
        <span className="console-label opacity-60">AES-256-GCM</span>
      </footer>
    </aside>
  )
}
