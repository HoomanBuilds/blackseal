"use client"

import { useCallback, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { CharPicker } from "@/components/device/CharPicker"

export function AddNote() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const addNote = useVaultStore((s) => s.addNote)

  const [step, setStep] = useState<"title" | "body">("title")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  const onTitleDone = useCallback(() => {
    if (title.trim().length === 0) return
    setStep("body")
  }, [title])

  const onBodyDone = useCallback(() => {
    addNote({
      id: crypto.randomUUID(),
      title: title.trim(),
      body,
      isLegacy: false,
      createdAt: Date.now(),
      backedUp: false,
    })
    setScreen("NOTE_LIST")
  }, [title, body, addNote, setScreen])

  const onCancel = useCallback(() => {
    if (step === "body") {
      setStep("title")
      setBody("")
    } else {
      setScreen("NOTE_LIST")
    }
  }, [step, setScreen])

  return step === "title" ? (
    <CharPicker
      key="title"
      label="TITLE"
      value={title}
      onChange={setTitle}
      onDone={onTitleDone}
      onCancel={onCancel}
    />
  ) : (
    <CharPicker
      key="body"
      label="NOTE BODY"
      value={body}
      onChange={setBody}
      onDone={onBodyDone}
      onCancel={onCancel}
    />
  )
}
