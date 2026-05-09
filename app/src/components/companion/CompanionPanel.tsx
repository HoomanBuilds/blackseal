"use client"

import { useCallback, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useConnectionStore } from "@/lib/store/connection-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { useCompanionConnection } from "@/lib/hooks/useCompanionConnection"
import { runBackup, runRestore, restoreFromSeed } from "@/lib/companion/backup-flow"
import { BackupStatus } from "./BackupStatus"
import { TransactionLog } from "./TransactionLog"
import { RestoreFlow } from "./RestoreFlow"
import { SeedRestoreDialog } from "./SeedRestoreDialog"

export function CompanionPanel() {
  useCompanionConnection()

  const backupEnabled = useDeviceStore((s) => s.backupEnabled)
  const setupComplete = useDeviceStore((s) => s.setupComplete)
  const isLocked = useDeviceStore((s) => s.isLocked)
  const seedPhrase = useDeviceStore((s) => s.seedPhrase)
  const encryptionKey = useDeviceStore((s) => s.encryptionKey)
  const setSeedPhrase = useDeviceStore((s) => s.setSeedPhrase)
  const setEncryptionKey = useDeviceStore((s) => s.setEncryptionKey)
  const setBackupEnabled = useDeviceStore((s) => s.setBackupEnabled)
  const setScreen = useDeviceStore((s) => s.setScreen)
  const setPendingRestore = useDeviceStore((s) => s.setPendingRestore)
  const vault = useVaultStore((s) => s.vault)
  const setVault = useVaultStore((s) => s.setVault)
  const markAllBackedUp = useVaultStore((s) => s.markAllBackedUp)

  const isConnected = useConnectionStore((s) => s.isConnected)
  const setTransferring = useConnectionStore((s) => s.setTransferring)
  const setLastBackup = useConnectionStore((s) => s.setLastBackup)
  const addTransaction = useConnectionStore((s) => s.addTransaction)
  const setSolanaBalance = useConnectionStore((s) => s.setSolanaBalance)

  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false)

  const canBackup =
    setupComplete && !isLocked && backupEnabled && isConnected && !!vault && !!seedPhrase && !!encryptionKey
  const canRestore = backupEnabled && isConnected && !!seedPhrase && !!encryptionKey

  const refreshBalance = useCallback(async () => {
    if (!seedPhrase) return
    try {
      const { mnemonicToSeed } = await import("@/lib/crypto/bip39")
      const { deriveKeypairFromSeed } = await import("@/lib/crypto/solana-keypair")
      const { BlackSealClient } = await import("@/lib/solana/transactions")
      const { DEVNET_RPC } = await import("@/lib/solana/program")
      const seed = await mnemonicToSeed(seedPhrase)
      const keypair = deriveKeypairFromSeed(seed)
      const client = BlackSealClient.fromKeypair(keypair, DEVNET_RPC)
      const balance = await client.getBalanceSol()
      setSolanaBalance(balance)
    } catch {
      // non-fatal
    }
  }, [seedPhrase, setSolanaBalance])

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
      markAllBackedUp()
      void refreshBalance()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "backup failed")
    } finally {
      setTransferring(false)
    }
  }, [vault, encryptionKey, seedPhrase, addTransaction, setLastBackup, setTransferring, markAllBackedUp, refreshBalance])

  const handleRestore = useCallback(async () => {
    if (!encryptionKey || !seedPhrase) return
    setErrorMsg(null)
    setTransferring(true)
    try {
      const result = await runRestore(encryptionKey, seedPhrase)
      if (!result) {
        setErrorMsg("No backup found on chain.")
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

  const handleSeedRestore = useCallback(
    async (phrase: string) => {
      setErrorMsg(null)
      setTransferring(true)
      try {
        const result = await restoreFromSeed(phrase)
        if (!result) {
          throw new Error("No vault found for this seed")
        }
        setSeedPhrase(phrase)
        setEncryptionKey(result.encryptionKey)
        setBackupEnabled(true)
        setVault(result.vault)
        setPendingRestore(true)
        addTransaction({
          signature: `seed-restore-${Date.now().toString(16)}`,
          type: "restore",
          timestamp: Date.now(),
        })
        setLastBackup(result.lastUpdated * 1000, result.version)
        setRestoreDialogOpen(false)
        setScreen("SET_PIN")
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "seed restore failed")
      } finally {
        setTransferring(false)
      }
    },
    [
      setSeedPhrase,
      setEncryptionKey,
      setBackupEnabled,
      setVault,
      setPendingRestore,
      addTransaction,
      setLastBackup,
      setScreen,
      setTransferring,
    ]
  )

  const canOfferRestore = !setupComplete && !restoreDialogOpen

  // Inline hint about why actions might be disabled
  const disabledReason = (() => {
    if (!backupEnabled) return "Backup is disabled. Turn it on in device Settings."
    if (!setupComplete) return "Complete device setup to enable backup."
    if (isLocked) return "Unlock the device to transfer."
    if (!isConnected) return "Waiting for Solana devnet uplink…"
    return null
  })()

  return (
    <>
      <aside
        className="console-panel w-full flex flex-col overflow-hidden self-stretch"
        style={{
          fontFamily: "var(--font-console), ui-monospace, monospace",
        }}
      >
        {/* MASTHEAD — compact, single row */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-[var(--console-hair)]">
          <div className="flex items-center gap-3">
            <span className="console-display-heading text-[13px]">BLACK SEAL</span>
            <span
              className="console-hex"
              style={{ color: "var(--console-magenta)" }}
            >
              // COMPANION
            </span>
          </div>
          <span
            className={`console-chip ${backupEnabled ? "is-live" : "is-warn"}`}
          >
            {backupEnabled ? "BACKUP ON" : "LOCAL ONLY"}
          </span>
        </header>

        {/* RESTORE-EXISTING bar — only shown pre-setup */}
        {canOfferRestore && (
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-[var(--console-hair)] bg-[var(--console-panel-2)]">
            <span className="console-hex">Have an existing seed phrase?</span>
            <button
              type="button"
              onClick={() => setRestoreDialogOpen(true)}
              className="console-label hover:text-[color:var(--console-phosphor)] transition-colors"
              style={{ borderBottom: "1px solid var(--console-accent)", paddingBottom: 1 }}
            >
              ↓ RESTORE
            </button>
          </div>
        )}

        {/* SCROLLABLE BODY — status + log share remaining height */}
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
          <BackupStatus />

          <div className="console-hair" />

          <div className="flex-1 min-h-[180px] flex flex-col">
            <TransactionLog />
          </div>
        </div>

        {/* INLINE STATUS / ERROR — between log and controls */}
        {(errorMsg || disabledReason) && (
          <div
            key={errorMsg ?? disabledReason ?? ""}
            className="console-strip-enter px-5 py-2.5 border-t border-[var(--console-hair)] flex items-start gap-2"
            style={{
              background: errorMsg
                ? "rgba(255, 92, 92, 0.06)"
                : "rgba(255, 154, 60, 0.05)",
            }}
          >
            <span
              className="console-label shrink-0 mt-[1px]"
              style={{
                color: errorMsg
                  ? "var(--console-warn)"
                  : "var(--console-accent)",
              }}
            >
              {errorMsg ? "ERR" : "INFO"}
            </span>
            <span
              className="text-[11px] leading-[1.5]"
              style={{
                fontFamily: "var(--font-console), ui-monospace, monospace",
                color: "var(--console-text)",
                wordBreak: "break-word",
              }}
            >
              {errorMsg ?? disabledReason}
            </span>
            {errorMsg && (
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="ml-auto console-label shrink-0 hover:text-[color:var(--console-phosphor)] transition-colors"
                aria-label="Dismiss"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* CONTROLS — pinned at bottom, always visible */}
        <div className="border-t border-[var(--console-hair)]">
          <RestoreFlow
            onBackup={handleBackup}
            onRestore={handleRestore}
            canBackup={canBackup}
            canRestore={canRestore}
          />
        </div>
      </aside>
      <SeedRestoreDialog
        open={restoreDialogOpen}
        onClose={() => setRestoreDialogOpen(false)}
        onSubmit={handleSeedRestore}
      />
    </>
  )
}
