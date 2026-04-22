"use client"

import { useCallback, useMemo, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useConnectionStore } from "@/lib/store/connection-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { useCompanionConnection } from "@/lib/hooks/useCompanionConnection"
import { runBackup, runRestore } from "@/lib/companion/backup-flow"
import { BackupStatus } from "./BackupStatus"
import { TransactionLog } from "./TransactionLog"
import { RestoreFlow } from "./RestoreFlow"

export function CompanionPanel() {
  useCompanionConnection()

  const backupEnabled = useDeviceStore((s) => s.backupEnabled)
  const setupComplete = useDeviceStore((s) => s.setupComplete)
  const isLocked = useDeviceStore((s) => s.isLocked)
  const seedPhrase = useDeviceStore((s) => s.seedPhrase)
  const encryptionKey = useDeviceStore((s) => s.encryptionKey)
  const vault = useVaultStore((s) => s.vault)
  const setVault = useVaultStore((s) => s.setVault)

  const isConnected = useConnectionStore((s) => s.isConnected)
  const setTransferring = useConnectionStore((s) => s.setTransferring)
  const setLastBackup = useConnectionStore((s) => s.setLastBackup)
  const addTransaction = useConnectionStore((s) => s.addTransaction)

  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const sessionId = useMemo(
    () => Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, "0"),
    []
  )

  const canBackup =
    setupComplete && !isLocked && backupEnabled && isConnected && !!vault && !!seedPhrase && !!encryptionKey
  const canRestore = backupEnabled && isConnected && !!seedPhrase && !!encryptionKey

  const handleBackup = useCallback(async () => {
    if (!vault || !encryptionKey || !seedPhrase) return
    setErrorMsg(null)
    setTransferring(true)
    try {
      const result = await runBackup(vault, encryptionKey, seedPhrase)
      const now = Date.now()
      if (result.initSignature) {
        addTransaction({ signature: result.initSignature, type: "init", timestamp: now })
      }
      addTransaction({ signature: result.signature, type: "backup", timestamp: now })
      setLastBackup(now, result.version)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "backup failed")
    } finally {
      setTransferring(false)
    }
  }, [vault, encryptionKey, seedPhrase, addTransaction, setLastBackup, setTransferring])

  const handleRestore = useCallback(async () => {
    if (!encryptionKey || !seedPhrase) return
    setErrorMsg(null)
    setTransferring(true)
    try {
      const result = await runRestore(encryptionKey, seedPhrase)
      if (!result) {
        setErrorMsg("no backup found on chain")
        return
      }
      setVault(result.vault)
      addTransaction({
        signature: `restore-${Date.now().toString(16)}`,
        type: "restore",
        timestamp: Date.now(),
      })
      setLastBackup(result.lastUpdated * 1000, result.version)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "restore failed")
    } finally {
      setTransferring(false)
    }
  }, [encryptionKey, seedPhrase, setVault, addTransaction, setLastBackup, setTransferring])

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
        onBackup={handleBackup}
        onRestore={handleRestore}
        canBackup={canBackup}
        canRestore={canRestore}
      />

      {errorMsg && (
        <div className="px-5 py-2 text-[10px] tracking-[0.2em] text-[color:var(--console-warn)] border-t border-[var(--console-hair)]">
          ERR · {errorMsg}
        </div>
      )}

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
