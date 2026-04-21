"use client"

import { useCallback, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { PinPad } from "@/components/device/PinPad"

type Step = "current" | "new" | "confirm"

export function ChangePin() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const [step, setStep] = useState<Step>("current")
  const [newPin, setNewPin] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(
    (pin: string) => {
      if (step === "current") {
        const storedPin = localStorage.getItem("bs_pin")
        if (pin === storedPin) {
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
          localStorage.setItem("bs_pin", pin)
          setScreen("SETTINGS")
        } else {
          setError("PINs didn't match.")
          setStep("new")
          setNewPin("")
        }
      }
    },
    [step, newPin, setScreen]
  )

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
    </div>
  )
}
