"use client"

import { useConnectionStore } from "@/lib/store/connection-store"
import { explorerTxUrl } from "@/lib/solana/transactions"

const TYPE_LABEL: Record<string, { label: string; className: string }> = {
  init: { label: "INIT", className: "text-[color:var(--console-magenta)]" },
  backup: { label: "UPLINK", className: "console-phosphor-text" },
  restore: { label: "DNLINK", className: "console-accent-text" },
  delete: { label: "WIPE", className: "text-[color:var(--console-warn)]" },
}

function truncSig(sig: string): string {
  return `${sig.slice(0, 8)}…${sig.slice(-6)}`
}

function formatClock(timestamp: number): string {
  const d = new Date(timestamp)
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`
}

export function TransactionLog() {
  const transactions = useConnectionStore((s) => s.transactions)

  return (
    <section className="flex flex-col flex-1 min-h-0">
      <header className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span className="console-label">CHAIN LOG</span>
          <span className="console-hex">/ 0x{transactions.length.toString(16).padStart(3, "0")}</span>
        </div>
        <span className="console-hex">stdout → devnet</span>
      </header>
      <div className="console-hair" />
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto console-scroll-fade px-3 py-2">
          {transactions.length === 0 ? (
            <div className="h-full flex items-center justify-center py-12">
              <div className="text-center">
                <div className="console-hex mb-2">— NO TRANSACTIONS —</div>
                <div className="console-hex" style={{ fontSize: 9 }}>awaiting signal</div>
              </div>
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              {transactions.map((tx, idx) => {
                const meta = TYPE_LABEL[tx.type] ?? TYPE_LABEL.init
                return (
                  <li
                    key={tx.signature}
                    className={`console-tx-row ${idx === 0 ? "is-fresh" : ""}`}
                  >
                    <span className="console-hex whitespace-nowrap">
                      {formatClock(tx.timestamp)}
                    </span>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span
                        className={`${meta.className} text-[10px] font-bold tracking-[0.25em]`}
                      >
                        {meta.label}
                      </span>
                      <a
                        href={explorerTxUrl(tx.signature)}
                        target="_blank"
                        rel="noreferrer"
                        className="console-hex truncate hover:text-[color:var(--console-accent)] transition-colors"
                      >
                        {truncSig(tx.signature)}
                      </a>
                    </div>
                    <a
                      href={explorerTxUrl(tx.signature)}
                      target="_blank"
                      rel="noreferrer"
                      className="console-label hover:text-[color:var(--console-accent)] transition-colors"
                      aria-label="Open in Solana Explorer"
                    >
                      ↗
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
