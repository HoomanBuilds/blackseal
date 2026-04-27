"use client"

import { useCallback, useEffect, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { CharPicker } from "@/components/device/CharPicker"
import { ScreenLayout } from "@/components/device/ScreenLayout"

type Step = "title" | "body"

export function EditNote() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const editingId = useDeviceStore((s) => s.editingId)
  const showSaveConfirm = useDeviceStore((s) => s.showSaveConfirm)
  const updateNote = useVaultStore((s) => s.updateNote)
  const notes = useVaultStore((s) => s.vault?.notes ?? [])
  const note = notes.find((n) => n.id === editingId)

  const [step, setStep] = useState<Step>("title")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (note && !hydrated) {
      setTitle(note.title)
      setBody(note.body)
      setHydrated(true)
    }
  }, [note, hydrated])

  const onTitleDone = useCallback(() => {
    if (title.trim().length === 0) return
    setStep("body")
  }, [title])

  const onBodyDone = useCallback(() => {
    if (!editingId) return
    const trimmedTitle = title.trim()
    updateNote(editingId, { title: trimmedTitle, body })
    showSaveConfirm(`${trimmedTitle} updated`, "NOTE_VIEW")
  }, [editingId, title, body, updateNote, showSaveConfirm])

  const onCancel = useCallback(() => {
    if (step === "body") setStep("title")
    else setScreen("NOTE_VIEW")
  }, [step, setScreen])

  if (!note) {
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

  const stepNum = step === "title" ? 1 : 2
  const titleSuffix = step === "title" ? "TITLE" : "BODY"

  return (
    <ScreenLayout title={`EDIT · ${titleSuffix}`} showBack>
      <div className="flex flex-col h-full">
        <div className="flex justify-end px-1 oled-text-dim" style={{ fontSize: 10 }}>
          {stepNum}/2
        </div>
        <div className="flex-1 min-h-0">
          {step === "title" ? (
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
          )}
        </div>
      </div>
    </ScreenLayout>
  )
}
