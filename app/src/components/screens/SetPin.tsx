"use client"

import { useState, useCallback } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { PinPad } from "@/components/device/PinPad"
import { deriveKeyFromPin, deriveEncryptionKey, derivePinWrappingKey } from "@/lib/crypto/key-derivation"
import { mnemonicToSeed } from "@/lib/crypto/bip39"
import { encrypt } from "@/lib/crypto/encryption"

const PIN_SALT = "bs_pin_salt_v1"

export function SetPin() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const seedPhrase = useDeviceStore((s) => s.seedPhrase)
  const setEncryptionKey = useDeviceStore((s) => s.setEncryptionKey)
  const pendingRestore = useDeviceStore((s) => s.pendingRestore)
  const setPendingRestore = useDeviceStore((s) => s.setPendingRestore)
  const setSetupComplete = useDeviceStore((s) => s.setSetupComplete)

  const [step, setStep] = useState<"enter" | "confirm">("enter")
  const [firstPin, setFirstPin] = useState("")
  const [error, setError] = useState(false)

  const handleSubmit = useCallback(
    async (pin: string) => {
      if (step === "enter") {
        setFirstPin(pin)
        setStep("confirm")
        setError(false)
      } else {
        if (pin === firstPin && seedPhrase) {
          // Hash PIN for verification
          const pinHash = await deriveKeyFromPin(pin, PIN_SALT)
          localStorage.setItem("bs_pin_hash", pinHash)

          // Derive vault encryption key from the seed, keep in memory
          const seed = await mnemonicToSeed(seedPhrase)
          const vaultKey = await deriveEncryptionKey(seed)
          setEncryptionKey(vaultKey)

          // Wrap the seed with a PIN-derived key so we can recover it on unlock
          const wrappingKey = await derivePinWrappingKey(pin)
          const { ciphertext, iv } = await encrypt(seedPhrase, wrappingKey)
          localStorage.setItem("bs_seed_ct", ciphertext)
          localStorage.setItem("bs_seed_iv", iv)

          if (pendingRestore) {
            // Restored from Solana — vault, key, and seed are already in memory.
            setSetupComplete(true)
            localStorage.setItem("bs_setup", "true")
            localStorage.setItem("bs_backup", "true")
            setPendingRestore(false)
            setScreen("MAIN_MENU")
          } else {
            setScreen("BACKUP_CHOICE")
          }
        } else {
          setError(true)
          setStep("enter")
          setFirstPin("")
        }
      }
    },
    [step, firstPin, seedPhrase, setEncryptionKey, setScreen, pendingRestore, setPendingRestore, setSetupComplete]
  )

  return (
    <div className="flex flex-col h-full">
      <div className="oled-text-dim" style={{ fontSize: 10 }}>
        {step === "enter" ? "SET YOUR PIN" : "CONFIRM PIN"}
      </div>
      <div className="oled-text-dim" style={{ fontSize: 10, marginTop: 2 }}>
        {step === "enter" ? "Choose an 8-digit PIN" : "Enter the same PIN again"}
      </div>
      {error && (
        <div style={{ fontSize: 10, color: "#ff4444", marginTop: 2 }}>
          PINs didn't match. Try again.
        </div>
      )}
      <div className="flex-1 flex items-center justify-center">
        <PinPad key={step} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
