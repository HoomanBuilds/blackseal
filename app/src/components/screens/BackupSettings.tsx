"use client"

import { useEffect, useRef } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { useConnectionStore } from "@/lib/store/connection-store"
import { ScreenLayout } from "@/components/device/ScreenLayout"

export function BackupSettings() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const backupEnabled = useDeviceStore((s) => s.backupEnabled)
  const setBackupEnabled = useDeviceStore((s) => s.setBackupEnabled)
  const vault = useVaultStore((s) => s.vault)
  const lastBackupTime = useConnectionStore((s) => s.lastBackupTime)
  const prevSeq = useRef(buttonSeq)

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq

    if (buttonAction === "left") {
      setScreen("SETTINGS")
    } else if (
      buttonAction === "confirm" ||
      buttonAction === "up" ||
      buttonAction === "down" ||
      buttonAction === "right"
    ) {
      const next = !backupEnabled
      setBackupEnabled(next)
      try {
        localStorage.setItem("bs_backup", next ? "true" : "false")
      } catch {}
    }
  }, [buttonAction, buttonSeq, backupEnabled, setBackupEnabled, setScreen])

  const pendingCount =
    (vault?.passwords.filter((p) => !p.backedUp).length ?? 0) +
    (vault?.notes.filter((n) => !n.backedUp).length ?? 0)

  return (
    <ScreenLayout
      title="BACKUP"
      showBack
      hints={[
        { key: "OK", label: "Toggle" },
        { key: "◄", label: "Back" },
      ]}
    >
      <div className="flex flex-col gap-3 px-1 py-2">
        <div className="oled-card flex items-center justify-between">
          <span className="oled-text" style={{ fontSize: 12 }}>
            Cloud Backup
          </span>
          <span
            className={backupEnabled ? "oled-text-success" : "oled-text-dim"}
            style={{ fontSize: 12, fontWeight: 600 }}
          >
            {backupEnabled ? "ON" : "OFF"}
          </span>
        </div>

        <div className="flex flex-col gap-1" style={{ fontSize: 11 }}>
          <Row label="Last sync" value={formatRelative(lastBackupTime)} />
          <Row
            label="Pending"
            value={
              backupEnabled
                ? pendingCount > 0
                  ? `${pendingCount} item${pendingCount === 1 ? "" : "s"}`
                  : "None"
                : "—"
            }
            valueClass={
              backupEnabled && pendingCount > 0 ? "oled-text-warning" : "oled-text-secondary"
            }
          />
        </div>

        {!backupEnabled && (
          <div className="oled-text-dim" style={{ fontSize: 10 }}>
            Local-only mode. No data leaves this device.
          </div>
        )}
      </div>
    </ScreenLayout>
  )
}

function Row({
  label,
  value,
  valueClass = "oled-text",
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="oled-text-dim">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  )
}

function formatRelative(ts: number | null): string {
  if (!ts) return "Never"
  const diff = Date.now() - ts
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return `${sec}s ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const d = Math.floor(hr / 24)
  return `${d}d ago`
}
