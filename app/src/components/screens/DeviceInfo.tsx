"use client"

import { useEffect, useRef } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { useConnectionStore } from "@/lib/store/connection-store"
import { ScreenLayout } from "@/components/device/ScreenLayout"

export function DeviceInfo() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const backupEnabled = useDeviceStore((s) => s.backupEnabled)
  const vault = useVaultStore((s) => s.vault)
  const lastBackupTime = useConnectionStore((s) => s.lastBackupTime)
  const publicKey = useConnectionStore((s) => s.publicKeyBase58)
  const prevSeq = useRef(0)

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq
    if (buttonAction === "left" || buttonAction === "confirm") {
      setScreen("VAULT_MENU")
    }
  }, [buttonAction, buttonSeq, setScreen])

  const entryCount = (vault?.passwords.length ?? 0) + (vault?.notes.length ?? 0)
  const sizeKb = vault
    ? Math.round((JSON.stringify(vault).length / 1024) * 10) / 10
    : 0
  const truncatedKey = publicKey
    ? `${publicKey.slice(0, 5)}…${publicKey.slice(-4)}`
    : "—"

  return (
    <ScreenLayout
      title="DEVICE INFO"
      showBack
      hints={[{ key: "◄", label: "Back" }]}
    >
      <div className="flex flex-col gap-1 px-1 py-2" style={{ fontSize: 11 }}>
        <Row label="VERSION" value="v0.1.0-devnet" />
        <Row label="VAULT SIZE" value={`${entryCount} entries`} />
        <Row label="STORAGE" value={`${sizeKb} KB used`} />
        <Row label="PUBLIC KEY" value={truncatedKey} />
        <Row
          label="BACKUP"
          value={backupEnabled ? "Enabled" : "Disabled"}
          valueClass={backupEnabled ? "oled-text-success" : "oled-text-dim"}
        />
        <Row label="LAST SYNC" value={formatRelative(lastBackupTime)} />
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
    <div className="flex items-center justify-between gap-3">
      <span className="oled-text-dim" style={{ letterSpacing: 0.5 }}>
        {label}
      </span>
      <span className={valueClass} style={{ fontFamily: "var(--font-console)" }}>
        {value}
      </span>
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
