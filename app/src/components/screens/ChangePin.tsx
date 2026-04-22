"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { PinPad } from "@/components/device/PinPad"
import { deriveKeyFromPin, derivePinWrappingKey } from "@/lib/crypto/key-derivation"
import { decrypt, encrypt } from "@/lib/crypto/encryption"

const PIN_SALT = "bs_pin_salt_v1"

type Step = "current" | "new" | "confirm"

export function ChangePin() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const [step, setStep] = useState<Step>("current")
  const [currentPin, setCurrentPin] = useState("")
  const [newPin, setNewPin] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(
    async (pin: string) => {
      if (step === "current") {
        const storedHash = localStorage.getItem("bs_pin_hash")
        const attemptHash = await deriveKeyFromPin(pin, PIN_SALT)
        if (storedHash && attemptHash === storedHash) {
          setCurrentPin(pin)
          setStep("new")
          setError(null)
        } else {
          setError("Wrong PIN. Try again.")
        }
      } else if (step === "new") {
        setNewPin(pin)
        setStep("confirm")
        setError(null)
      } else {
        if (pin === newPin) {
          const seedCt = localStorage.getItem("bs_seed_ct")
          const seedIv = localStorage.getItem("bs_seed_iv")
          if (!seedCt || !seedIv) {
            setError("Vault corrupted.")
            return
          }
          try {
            const oldWrap = await derivePinWrappingKey(currentPin)
            const seedPhrase = await decrypt(seedCt, seedIv, oldWrap)

            const newHash = await deriveKeyFromPin(pin, PIN_SALT)
            const newWrap = await derivePinWrappingKey(pin)
            const { ciphertext, iv } = await encrypt(seedPhrase, newWrap)

            localStorage.setItem("bs_pin_hash", newHash)
            localStorage.setItem("bs_seed_ct", ciphertext)
            localStorage.setItem("bs_seed_iv", iv)
            setScreen("SETTINGS")
          } catch {
            setError("Failed to re-wrap seed.")
            setStep("current")
            setCurrentPin("")
            setNewPin("")
          }
        } else {
          setError("PINs didn't match.")
          setStep("new")
          setNewPin("")
        }
      }
    },
    [step, currentPin, newPin, setScreen]
  )

  const prevSeq = useRef(0)
  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq
    if (buttonAction === "left") {
      setScreen("SETTINGS")
    }
  }, [buttonAction, buttonSeq, setScreen])

  const label =
    step === "current" ? "CURRENT PIN" : step === "new" ? "NEW PIN" : "CONFIRM NEW PIN"

  return (
    <div className="flex flex-col h-full">
      <div className="oled-text-dim" style={{ fontSize: 10 }}>
        {label}
      </div>
      {error && (
        <div style={{ fontSize: 10, color: "#ff4444", marginTop: 2 }}>{error}</div>
      )}
      <div className="flex-1 flex items-center justify-center">
        <PinPad key={step + error} onSubmit={handleSubmit} />
      </div>
      <div className="oled-text-dim" style={{ fontSize: 10, textAlign: "center" }}>
        [◄] Back to Settings
      </div>
    </div>
  )
}
