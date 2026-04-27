"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { PinPad } from "@/components/device/PinPad"
import { ScreenLayout } from "@/components/device/ScreenLayout"
import { deriveKeyFromPin, derivePinWrappingKey } from "@/lib/crypto/key-derivation"
import { decrypt, encrypt } from "@/lib/crypto/encryption"

const PIN_SALT = "bs_pin_salt_v1"

type Step = "current" | "new" | "confirm"

export function ChangePin() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const showSaveConfirm = useDeviceStore((s) => s.showSaveConfirm)
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

            localStorage.setItem("bs_seed_ct", ciphertext)
            localStorage.setItem("bs_seed_iv", iv)
            localStorage.setItem("bs_pin_hash", newHash)
            showSaveConfirm("PIN updated", "SETTINGS")
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
    [step, currentPin, newPin, showSaveConfirm]
  )

  const prevSeq = useRef(buttonSeq)
  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq
    if (buttonAction === "left") {
      setScreen("SETTINGS")
    }
  }, [buttonAction, buttonSeq, setScreen])

  const title =
    step === "current" ? "VERIFY PIN" : step === "new" ? "NEW PIN" : "CONFIRM PIN"
  const subtitle =
    step === "current"
      ? "Enter your current PIN"
      : step === "new"
        ? "Choose a new 8-digit PIN"
        : "Re-enter the new PIN"

  return (
    <ScreenLayout title={title} showBack hints={[{ key: "◄", label: "Cancel" }]}>
      <div className="flex flex-col h-full px-1 py-2 gap-2">
        <div className="oled-text-secondary text-center" style={{ fontSize: 11 }}>
          {subtitle}
        </div>
        {error && (
          <div className="oled-text-danger text-center" style={{ fontSize: 11 }}>
            {error}
          </div>
        )}
        <div className="flex-1 flex items-center justify-center">
          <PinPad key={step + (error ?? "")} onSubmit={handleSubmit} />
        </div>
      </div>
    </ScreenLayout>
  )
}
