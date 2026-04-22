"use client"

import { useConnectionStore } from "@/lib/store/connection-store"

function truncateKey(key: string | null, head = 6, tail = 6): string {
  if (!key) return "—"
  if (key.length <= head + tail + 3) return key
  return `${key.slice(0, head)}···${key.slice(-tail)}`
}

function formatTimeAgo(timestamp: number | null): string {
  if (!timestamp) return "NEVER"
  const diffSec = Math.floor((Date.now() - timestamp) / 1000)
  if (diffSec < 5) return "JUST NOW"
  if (diffSec < 60) return `${diffSec}s AGO`
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m AGO`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h AGO`
  return `${Math.floor(diffSec / 86400)}d AGO`
}

export function BackupStatus() {
  const isConnected = useConnectionStore((s) => s.isConnected)
  const isTransferring = useConnectionStore((s) => s.isTransferring)
  const publicKey = useConnectionStore((s) => s.publicKeyBase58)
  const solBalance = useConnectionStore((s) => s.solanaBalance)
  const lastBackupTime = useConnectionStore((s) => s.lastBackupTime)
  const backupVersion = useConnectionStore((s) => s.backupVersion)

  return (
    <section className="flex flex-col">
      {/* UPLINK STATUS — headline moment */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`console-dot is-pulse ${
                isConnected
                  ? "text-[color:var(--console-phosphor)]"
                  : "text-[color:var(--console-text-faint)]"
              }`}
            />
            <span className="console-label">
              {isConnected ? "UPLINK · SOLANA DEVNET" : "UPLINK OFFLINE"}
            </span>
          </div>
        </div>
        <div className="console-ticker" aria-hidden>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="console-hair" />

      {/* STATUS GRID — data-dense readouts */}
      <div className="grid grid-cols-2 gap-px bg-[var(--console-hair)]">
        <StatusCell label="SIGNER" value={truncateKey(publicKey)} mono />
        <StatusCell
          label="BALANCE"
          value={solBalance !== null ? `${solBalance.toFixed(4)} SOL` : "—"}
          accent
        />
        <StatusCell
          label="LAST BACKUP"
          value={formatTimeAgo(lastBackupTime)}
          phosphor={!!lastBackupTime}
        />
        <StatusCell
          label="VERSION"
          value={`v${backupVersion.toString().padStart(3, "0")}`}
        />
      </div>

      {/* SIGNAL METER */}
      <div className="px-5 py-4 flex items-center gap-3">
        <span className="console-label">SIGNAL</span>
        <div className="console-meter flex-1">
          {isConnected && <div className="console-meter__fill" />}
        </div>
        <span
          className={`console-chip ${
            isTransferring
              ? "is-warn"
              : isConnected
                ? "is-live"
                : ""
          }`}
        >
          {isTransferring ? "TRANSFER" : isConnected ? "IDLE" : "DOWN"}
        </span>
      </div>
    </section>
  )
}

interface StatusCellProps {
  label: string
  value: string
  mono?: boolean
  accent?: boolean
  phosphor?: boolean
}

function StatusCell({ label, value, mono, accent, phosphor }: StatusCellProps) {
  const valueClass = accent
    ? "console-value console-accent-text"
    : phosphor
      ? "console-value console-phosphor-text"
      : mono
        ? "console-value-mono-sm"
        : "console-value"

  return (
    <div className="bg-[var(--console-panel)] px-5 py-4 flex flex-col gap-2">
      <span className="console-label">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  )
}
