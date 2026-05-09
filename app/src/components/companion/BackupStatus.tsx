"use client"

import { useState } from "react"
import { useConnectionStore } from "@/lib/store/connection-store"
import { explorerAccountUrl } from "@/lib/solana/transactions"

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

  const statusLabel = isTransferring
    ? "TRANSFERRING"
    : isConnected
      ? "UPLINK · SOLANA DEVNET"
      : "UPLINK OFFLINE"
  const statusTone = isTransferring
    ? "var(--console-accent)"
    : isConnected
      ? "var(--console-phosphor)"
      : "var(--console-text-faint)"

  return (
    <section className="flex flex-col">
      {/* UPLINK STATUS */}
      <div className="flex items-center gap-2 px-5 pt-4 pb-3">
        <span
          className={`uplink-dot ${isConnected ? "is-live" : ""} ${
            isTransferring ? "is-busy" : ""
          }`}
          style={{ color: statusTone }}
        />
        <span className="console-label" style={{ color: statusTone }}>
          {statusLabel}
        </span>
      </div>

      <div className="console-hair" />

      {/* WALLET ADDRESS — full address with copy + faucet + explorer */}
      <WalletAddressRow publicKey={publicKey} />

      <div className="console-hair" />

      {/* STATUS GRID — 3 essential readouts */}
      <div className="grid grid-cols-3 gap-px bg-[var(--console-hair)]">
        <StatusCell
          label="BALANCE"
          value={solBalance !== null ? `${solBalance.toFixed(3)} SOL` : "—"}
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
    </section>
  )
}

interface StatusCellProps {
  label: string
  value: string
  accent?: boolean
  phosphor?: boolean
}

function WalletAddressRow({ publicKey }: { publicKey: string | null }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!publicKey) return
    try {
      await navigator.clipboard.writeText(publicKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  const faucetUrl = publicKey
    ? `https://faucet.solana.com/?cluster=devnet&address=${publicKey}`
    : "https://faucet.solana.com/?cluster=devnet"

  return (
    <div className="px-5 py-3 flex flex-col gap-1.5 bg-[var(--console-panel)]">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="console-label">WALLET ADDRESS</span>
        {publicKey && (
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleCopy}
              className="console-label hover:text-[color:var(--console-phosphor)] transition-colors"
              style={{ letterSpacing: "0.12em" }}
            >
              {copied ? "COPIED" : "COPY"}
            </button>
            <a
              href={faucetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="console-label hover:text-[color:var(--console-phosphor)] transition-colors"
              style={{ letterSpacing: "0.12em" }}
            >
              FAUCET ↗
            </a>
            <a
              href={explorerAccountUrl(publicKey)}
              target="_blank"
              rel="noopener noreferrer"
              className="console-label hover:text-[color:var(--console-phosphor)] transition-colors"
              style={{ letterSpacing: "0.12em" }}
            >
              EXPLORER ↗
            </a>
          </div>
        )}
      </div>
      <span
        className="console-value-mono-sm break-all"
        style={{ fontSize: 11, lineHeight: 1.45, color: "var(--console-text)" }}
      >
        {publicKey ?? "— unlock device with backup enabled —"}
      </span>
    </div>
  )
}

function StatusCell({ label, value, accent, phosphor }: StatusCellProps) {
  const valueClass = accent
    ? "console-value console-accent-text"
    : phosphor
      ? "console-value console-phosphor-text"
      : "console-value"

  return (
    <div className="bg-[var(--console-panel)] px-3 py-3 flex flex-col gap-1.5 min-w-0">
      <span className="console-label truncate">{label}</span>
      <span className={`${valueClass} truncate`} style={{ fontSize: 12 }}>
        {value}
      </span>
    </div>
  )
}
