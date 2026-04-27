"use client"

import { useCallback } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { PinPad } from "@/components/device/PinPad"
import { ScreenLayout } from "@/components/device/ScreenLayout"
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
        const seedCt = localStorage.getItem("bs_seed_ct")
        const seedIv = localStorage.getItem("bs_seed_iv")
        if (!seedCt || !seedIv) {
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
          localStorage.clear()
          clearVault()
          wipeDevice()
          setScreen("WIPE_ANIMATION")
          return
        }

        resetFailedAttempts()
        setLocked(false)
        setScreen("DASHBOARD")
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

  const remaining = 3 - failedAttempts

  return (
    <ScreenLayout title="UNLOCK">
      <div className="flex flex-col h-full items-center justify-center gap-3 py-2">
        <div style={{ fontSize: 22 }}>🔒</div>
        <div className="oled-text-secondary" style={{ fontSize: 11 }}>
          Enter your 8-digit PIN
        </div>
        {failedAttempts > 0 && (
          <div className="oled-text-warning text-center" style={{ fontSize: 11 }}>
            Incorrect. {remaining} attempt{remaining !== 1 ? "s" : ""} left.
            {failedAttempts === 2 && (
              <div className="oled-text-danger" style={{ fontSize: 10, marginTop: 2 }}>
                Next fail wipes all data.
              </div>
            )}
          </div>
        )}
        <PinPad key={failedAttempts} onSubmit={handleSubmit} />
      </div>
    </ScreenLayout>
  )
}
