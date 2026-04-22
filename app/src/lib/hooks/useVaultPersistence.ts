"use client"

import { useEffect, useRef } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { saveVault } from "@/lib/crypto/vault-persistence"

/**
 * Subscribes to vault changes and persists an encrypted snapshot to localStorage
 * whenever the vault changes AND an encryption key is available.
 */
export function useVaultPersistence() {
  const encryptionKey = useDeviceStore((s) => s.encryptionKey)
  const keyRef = useRef<CryptoKey | null>(null)

  useEffect(() => {
    keyRef.current = encryptionKey
  }, [encryptionKey])

  useEffect(() => {
    const unsub = useVaultStore.subscribe((state, prev) => {
      if (state.vault === prev.vault) return
      if (!keyRef.current || !state.vault) return
      void saveVault(state.vault, keyRef.current)
    })
    return unsub
  }, [])
}
