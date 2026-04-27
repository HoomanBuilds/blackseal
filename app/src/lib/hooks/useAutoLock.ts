"use client"

import { useEffect } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"

const LOCK_AFTER_MS = 2 * 60 * 1000

const LOCKABLE_SCREENS: Set<string> = new Set([
  "DASHBOARD",
  "VAULT_MENU",
  "PASSWORD_LIST",
  "PASSWORD_ENTRY",
  "ADD_PASSWORD",
  "NOTE_LIST",
  "NOTE_VIEW",
  "ADD_NOTE",
  "SETTINGS",
  "CHANGE_PIN",
  "WIPE_DEVICE",
])

export function useAutoLock() {
  const lastActivity = useDeviceStore((s) => s.lastActivity)
  const screen = useDeviceStore((s) => s.screen)
  const setupComplete = useDeviceStore((s) => s.setupComplete)
  const setScreen = useDeviceStore((s) => s.setScreen)
  const setLocked = useDeviceStore((s) => s.setLocked)
  const setSeedPhrase = useDeviceStore((s) => s.setSeedPhrase)
  const setEncryptionKey = useDeviceStore((s) => s.setEncryptionKey)
  const clearVault = useVaultStore((s) => s.clearVault)

  useEffect(() => {
    if (!setupComplete || !LOCKABLE_SCREENS.has(screen)) return

    const remaining = LOCK_AFTER_MS - (Date.now() - lastActivity)
    const timer = setTimeout(() => {
      setSeedPhrase(null)
      setEncryptionKey(null)
      clearVault()
      setLocked(true)
      setScreen("PIN_UNLOCK")
    }, Math.max(0, remaining))

    return () => clearTimeout(timer)
  }, [lastActivity, screen, setupComplete, setScreen, setLocked, setSeedPhrase, setEncryptionKey, clearVault])
}
