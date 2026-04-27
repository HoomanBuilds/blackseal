"use client"

import { useCallback, useEffect, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { CharPicker } from "@/components/device/CharPicker"
import { ScreenLayout } from "@/components/device/ScreenLayout"

type Step = "label" | "username" | "password"

export function EditPassword() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const editingId = useDeviceStore((s) => s.editingId)
  const showSaveConfirm = useDeviceStore((s) => s.showSaveConfirm)
  const updatePassword = useVaultStore((s) => s.updatePassword)
  const passwords = useVaultStore((s) => s.vault?.passwords ?? [])
  const entry = passwords.find((p) => p.id === editingId)

  const [step, setStep] = useState<Step>("label")
  const [label, setLabel] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (entry && !hydrated) {
      setLabel(entry.label)
      setUsername(entry.username)
      setPassword(entry.password)
      setHydrated(true)
    }
  }, [entry, hydrated])

  const onLabelDone = useCallback(() => {
    if (label.trim().length === 0) return
    setStep("username")
  }, [label])

  const onUsernameDone = useCallback(() => {
    setStep("password")
  }, [])

  const onPasswordDone = useCallback(() => {
    if (password.length === 0 || !editingId) return
    const trimmedLabel = label.trim()
    updatePassword(editingId, {
      label: trimmedLabel,
      username: username.trim(),
      password,
    })
    showSaveConfirm(`${trimmedLabel} updated`, "PASSWORD_ENTRY")
  }, [password, label, username, editingId, updatePassword, showSaveConfirm])

  const onCancel = useCallback(() => {
    if (step === "password") setStep("username")
    else if (step === "username") setStep("label")
    else setScreen("PASSWORD_ENTRY")
  }, [step, setScreen])

  if (!entry) {
    return (
      <ScreenLayout title="EDIT" showBack>
        <div className="flex flex-col h-full items-center justify-center">
          <div className="oled-text-dim" style={{ fontSize: 11 }}>
            Not found
          </div>
        </div>
      </ScreenLayout>
    )
  }

  const stepNum = step === "label" ? 1 : step === "username" ? 2 : 3
  const titleSuffix = step === "label" ? "LABEL" : step === "username" ? "USERNAME" : "PASSWORD"

  return (
    <ScreenLayout title={`EDIT · ${titleSuffix}`} showBack>
      <div className="flex flex-col h-full">
        <div className="flex justify-end px-1 oled-text-dim" style={{ fontSize: 10 }}>
          {stepNum}/3
        </div>
        <div className="flex-1 min-h-0">
          {step === "label" && (
            <CharPicker
              key="label"
              label="LABEL"
              value={label}
              onChange={setLabel}
              onDone={onLabelDone}
              onCancel={onCancel}
            />
          )}
          {step === "username" && (
            <CharPicker
              key="username"
              label="USERNAME / EMAIL"
              value={username}
              onChange={setUsername}
              onDone={onUsernameDone}
              onCancel={onCancel}
            />
          )}
          {step === "password" && (
            <CharPicker
              key="password"
              label="PASSWORD"
              value={password}
              onChange={setPassword}
              onDone={onPasswordDone}
              onCancel={onCancel}
            />
          )}
        </div>
      </div>
    </ScreenLayout>
  )
}
