"use client"

import { useConnectionStore } from "@/lib/store/connection-store"

interface RestoreFlowProps {
  onBackup: () => void
  onRestore: () => void
  canBackup: boolean
  canRestore: boolean
}

export function RestoreFlow({ onBackup, onRestore, canBackup, canRestore }: RestoreFlowProps) {
  const isTransferring = useConnectionStore((s) => s.isTransferring)

  return (
    <section className="flex flex-col">
      <header className="flex items-center justify-between px-5 pt-4 pb-3">
        <span className="console-label">CONTROL</span>
        <span className="console-hex">2 actions registered</span>
      </header>
      <div className="console-hair" />
      <div className="grid grid-cols-2 gap-px bg-[var(--console-hair)]">
        <button
          type="button"
          onClick={onBackup}
          disabled={!canBackup || isTransferring}
          className="console-btn is-primary py-4 border-0 rounded-none"
        >
          <span>↑ COMMIT BACKUP</span>
        </button>
        <button
          type="button"
          onClick={onRestore}
          disabled={!canRestore || isTransferring}
          className="console-btn py-4 border-0 rounded-none"
        >
          <span>↓ FETCH RESTORE</span>
        </button>
      </div>
    </section>
  )
}
