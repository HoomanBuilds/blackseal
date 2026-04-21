"use client"

import { useState, useCallback } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { PinPad } from "@/components/device/PinPad"

export function SetPin() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const [step, setStep] = useState<"enter" | "confirm">("enter")
  const [firstPin, setFirstPin] = useState("")
  const [error, setError] = useState(false)

  const handleSubmit = useCallback(
    (pin: string) => {
      if (step === "enter") {
        setFirstPin(pin)
        setStep("confirm")
        setError(false)
      } else {
        if (pin === firstPin) {
          localStorage.setItem("bs_pin", pin)
          setScreen("BACKUP_CHOICE")
        } else {
          setError(true)
          setStep("enter")
          setFirstPin("")
        }
      }
    },
    [step, firstPin, setScreen]
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
