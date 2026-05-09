"use client"

import { useEffect, useRef } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { useConnectionStore } from "@/lib/store/connection-store"
import { ScreenLayout } from "@/components/device/ScreenLayout"
import { OledIcon } from "@/components/device/OledIcon"

export function Dashboard() {
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const setScreen = useDeviceStore((s) => s.setScreen)
  const backupEnabled = useDeviceStore((s) => s.backupEnabled)
  const vault = useVaultStore((s) => s.vault)
  const lastBackup = useConnectionStore((s) => s.lastBackupTime)
  const lastSeq = useRef(buttonSeq)

  useEffect(() => {
    if (buttonSeq === lastSeq.current) return
    lastSeq.current = buttonSeq
    if (buttonAction === "confirm") setScreen("VAULT_MENU")
  }, [buttonAction, buttonSeq, setScreen])

  const passwordCount = vault?.passwords.length ?? 0
  const noteCount = vault?.notes.length ?? 0
  const pendingCount =
    (vault?.passwords.filter((p) => !p.backedUp).length ?? 0) +
    (vault?.notes.filter((n) => !n.backedUp).length ?? 0)

  return (
    <ScreenLayout hints={[{ key: "OK", label: "Open Vault" }]}>
      <div className="flex flex-col h-full px-2 py-3">
        <div className="flex justify-around items-end mt-3">
          <Counter icon="key" count={passwordCount} label="passwords" />
          <Counter icon="note" count={noteCount} label="notes" />
        </div>
        <div className="oled-divider mt-4" />
        <div className="text-center mt-3" style={{ fontSize: 11 }}>
          {!backupEnabled ? (
            <span className="oled-text-dim">Backup disabled</span>
          ) : pendingCount > 0 ? (
            <span className="oled-text-warning">
              {pendingCount} item{pendingCount === 1 ? "" : "s"} pending backup
            </span>
          ) : lastBackup ? (
            <span className="oled-text-success">All items synced</span>
          ) : (
            <span className="oled-text-secondary">No backup yet</span>
          )}
        </div>
      </div>
    </ScreenLayout>
  )
}

function Counter({
  icon,
  count,
  label,
}: {
  icon: "key" | "note"
  count: number
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        <OledIcon name={icon} size={16} className="oled-text-secondary" />
        <span className="oled-text" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1 }}>
          {count}
        </span>
      </div>
      <span className="oled-text-secondary" style={{ fontSize: 10 }}>
        {label}
      </span>
    </div>
  )
}
