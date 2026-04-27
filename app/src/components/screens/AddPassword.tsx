"use client"

import { useCallback, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { CharPicker } from "@/components/device/CharPicker"

export function AddPassword() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const addPassword = useVaultStore((s) => s.addPassword)

  const [step, setStep] = useState<"label" | "password">("label")
  const [label, setLabel] = useState("")
  const [password, setPassword] = useState("")

  const onLabelDone = useCallback(() => {
    if (label.trim().length === 0) return
    setStep("password")
  }, [label])

  const onPasswordDone = useCallback(() => {
    if (password.length === 0) return
    addPassword({
      id: crypto.randomUUID(),
      label: label.trim(),
      username: "",
      password,
      createdAt: Date.now(),
      backedUp: false,
    })
    setScreen("PASSWORD_LIST")
  }, [password, label, addPassword, setScreen])

  const onCancel = useCallback(() => {
    if (step === "password") {
      setStep("label")
      setPassword("")
    } else {
      setScreen("PASSWORD_LIST")
    }
  }, [step, setScreen])

  return step === "label" ? (
    <CharPicker
      key="label"
      label="LABEL (e.g. gmail)"
      value={label}
      onChange={setLabel}
      onDone={onLabelDone}
      onCancel={onCancel}
    />
  ) : (
    <CharPicker
      key="password"
      label="PASSWORD"
      value={password}
      onChange={setPassword}
      onDone={onPasswordDone}
      onCancel={onCancel}
    />
  )
}
