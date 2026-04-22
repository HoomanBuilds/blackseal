"use client"

import { useCallback } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { PinPad } from "@/components/device/PinPad"
import { deriveKeyFromPin, deriveEncryptionKey, derivePinWrappingKey } from "@/lib/crypto/key-derivation"
import { mnemonicToSeed } from "@/lib/crypto/bip39"
import { decrypt } from "@/lib/crypto/encryption"
import { loadVault, clearPersistedVault } from "@/lib/crypto/vault-persistence"

const PIN_SALT = "bs_pin_salt_v1"

export function PinUnlock() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const setLocked = useDeviceStore((s) => s.setLocked)
  const setSeedPhrase = useDeviceStore((s) => s.setSeedPhrase)
  const setEncryptionKey = useDeviceStore((s) => s.setEncryptionKey)
  const failedAttempts = useDeviceStore((s) => s.failedAttempts)
  const incrementFailedAttempts = useDeviceStore((s) => s.incrementFailedAttempts)
  const resetFailedAttempts = useDeviceStore((s) => s.resetFailedAttempts)
  const wipeDevice = useDeviceStore((s) => s.wipeDevice)
  const setVault = useVaultStore((s) => s.setVault)
  const clearVault = useVaultStore((s) => s.clearVault)

  const handleSubmit = useCallback(
    async (pin: string) => {
      const storedHash = localStorage.getItem("bs_pin_hash")
      const attemptHash = await deriveKeyFromPin(pin, PIN_SALT)

      if (storedHash && attemptHash === storedHash) {
        // Unwrap the seed using PIN-derived key
        const seedCt = localStorage.getItem("bs_seed_ct")
        const seedIv = localStorage.getItem("bs_seed_iv")
        if (!seedCt || !seedIv) {
          // Partial corruption — seed wrapping data incomplete
          localStorage.clear()
          clearVault()
          wipeDevice()
          setScreen("WIPE_ANIMATION")
          return
        }

        try {
          const wrappingKey = await derivePinWrappingKey(pin)
          const seedPhrase = await decrypt(seedCt, seedIv, wrappingKey)
          setSeedPhrase(seedPhrase)

          const seed = await mnemonicToSeed(seedPhrase)
          const vaultKey = await deriveEncryptionKey(seed)
          setEncryptionKey(vaultKey)

          const vault = await loadVault(vaultKey)
          if (vault) setVault(vault)
        } catch {
          // Corrupt seed — wipe device
          localStorage.clear()
          clearVault()
          wipeDevice()
          setScreen("WIPE_ANIMATION")
          return
        }

        resetFailedAttempts()
        setLocked(false)
        setScreen("MAIN_MENU")
      } else {
        const newAttempts = failedAttempts + 1
        if (newAttempts >= 3) {
          localStorage.clear()
          clearPersistedVault()
          clearVault()
          wipeDevice()
          setScreen("WIPE_ANIMATION")
        } else {
          incrementFailedAttempts()
        }
      }
    },
    [
      failedAttempts,
      resetFailedAttempts,
      incrementFailedAttempts,
      setLocked,
      setScreen,
      setSeedPhrase,
      setEncryptionKey,
      setVault,
      clearVault,
      wipeDevice,
    ]
  )

  return (
    <div className="flex flex-col h-full">
      <div className="oled-text-dim" style={{ fontSize: 10 }}>
        ENTER PIN
      </div>
      {failedAttempts > 0 && (
        <div style={{ fontSize: 10, color: "#ff4444", marginTop: 2 }}>
          Incorrect. {3 - failedAttempts} attempt{3 - failedAttempts !== 1 ? "s" : ""} left.
          {failedAttempts === 2 && " Next fail wipes all data."}
        </div>
      )}
      <div className="flex-1 flex items-center justify-center">
        <PinPad key={failedAttempts} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
