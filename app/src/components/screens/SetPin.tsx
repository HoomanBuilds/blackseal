"use client"

import { useState, useCallback } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { PinPad } from "@/components/device/PinPad"
import { ScreenLayout } from "@/components/device/ScreenLayout"
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
          const pinHash = await deriveKeyFromPin(pin, PIN_SALT)
          localStorage.setItem("bs_pin_hash", pinHash)

          const seed = await mnemonicToSeed(seedPhrase)
          const vaultKey = await deriveEncryptionKey(seed)
          setEncryptionKey(vaultKey)

          const wrappingKey = await derivePinWrappingKey(pin)
          const { ciphertext, iv } = await encrypt(seedPhrase, wrappingKey)
          localStorage.setItem("bs_seed_ct", ciphertext)
          localStorage.setItem("bs_seed_iv", iv)

          if (pendingRestore) {
            setSetupComplete(true)
            localStorage.setItem("bs_setup", "true")
            localStorage.setItem("bs_backup", "true")
            setPendingRestore(false)
            setScreen("DASHBOARD")
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
    <ScreenLayout
      title={step === "enter" ? "SET PIN" : "CONFIRM PIN"}
      hints={[
        { key: "▲▼", label: "Digit" },
        { key: "◄►", label: "Move" },
        { key: "OK", label: "Submit" },
      ]}
    >
      <div className="flex flex-col h-full px-2 py-2">
        <div className="oled-text-secondary" style={{ fontSize: 11, marginTop: 2 }}>
          {step === "enter" ? "Choose an 8-digit PIN" : "Enter the same PIN again"}
        </div>
        {error && (
          <div className="oled-text-danger" style={{ fontSize: 10, marginTop: 4 }}>
            PINs didn&apos;t match. Try again.
          </div>
        )}
        <div className="flex-1 flex items-center justify-center">
          <PinPad key={step} onSubmit={handleSubmit} />
        </div>
      </div>
    </ScreenLayout>
  )
}
