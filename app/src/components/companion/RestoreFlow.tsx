"use client"

import { useConnectionStore } from "@/lib/store/connection-store"

interface RestoreFlowProps {
  onBackup: () => void
  onRestore: () => void
  canBackup: boolean
  canRestore: boolean
}

export function RestoreFlow({
  onBackup,
  onRestore,
  canBackup,
  canRestore,
}: RestoreFlowProps) {
  const isTransferring = useConnectionStore((s) => s.isTransferring)

  return (
    <div className="grid grid-cols-2 gap-px bg-[var(--console-hair)]">
      <button
        type="button"
        onClick={onBackup}
        disabled={!canBackup || isTransferring}
        className={
          "console-btn is-primary py-3.5 border-0 rounded-none disabled:opacity-40 disabled:cursor-not-allowed " +
          (isTransferring ? "is-transferring" : "")
        }
      >
        <span>{isTransferring ? "TRANSFERRING…" : "↑ COMMIT BACKUP"}</span>
      </button>
      <button
        type="button"
        onClick={onRestore}
        disabled={!canRestore || isTransferring}
        className={
          "console-btn py-3.5 border-0 rounded-none disabled:opacity-40 disabled:cursor-not-allowed " +
          (isTransferring ? "is-transferring" : "")
        }
      >
        <span>↓ FETCH RESTORE</span>
      </button>
    </div>
  )
}
