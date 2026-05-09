"use client"

import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { OledIcon } from "./OledIcon"

interface StatusBarProps {
  title?: string
  showBack?: boolean
}

export function StatusBar({ title, showBack = false }: StatusBarProps) {
  const isLocked = useDeviceStore((s) => s.isLocked)
  const backupEnabled = useDeviceStore((s) => s.backupEnabled)
  const vault = useVaultStore((s) => s.vault)

  const passwordCount = vault?.passwords.length ?? 0
  const noteCount = vault?.notes.length ?? 0
  const pendingCount =
    (vault?.passwords.filter((p) => !p.backedUp).length ?? 0) +
    (vault?.notes.filter((n) => !n.backedUp).length ?? 0)

  let backupLabel: string
  let backupClass: string
  if (!backupEnabled) {
    backupLabel = "LOCAL"
    backupClass = "oled-text-dim"
  } else if (pendingCount > 0) {
    backupLabel = `${pendingCount}↑`
    backupClass = "oled-text-warning"
  } else {
    backupLabel = "SYNC"
    backupClass = "oled-text-success"
  }

  return (
    <div className="flex items-center justify-between" style={{ fontSize: 10, lineHeight: "12px" }}>
      <div className="flex items-center gap-1">
        {showBack && <span className="oled-text-secondary">◄</span>}
        <span className="oled-text" style={{ fontWeight: 600, letterSpacing: 0.5 }}>
          {title ?? (isLocked ? "LOCKED" : "BLACK SEAL")}
        </span>
      </div>
      <div className="flex items-center gap-3 oled-text-secondary">
        <span className="flex items-center gap-1">
          <OledIcon name="key" size={10} strokeWidth={1.8} />
          {passwordCount}
        </span>
        <span className="flex items-center gap-1">
          <OledIcon name="note" size={10} strokeWidth={1.8} />
          {noteCount}
        </span>
        <span className={backupClass}>{backupLabel}</span>
      </div>
    </div>
  )
}
