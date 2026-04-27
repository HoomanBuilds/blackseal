"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { ScreenLayout } from "@/components/device/ScreenLayout"

export function DeleteConfirm() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const target = useDeviceStore((s) => s.deleteTarget)
  const setDeleteTarget = useDeviceStore((s) => s.setDeleteTarget)
  const setSelectedPasswordId = useDeviceStore((s) => s.setSelectedPasswordId)
  const setSelectedNoteId = useDeviceStore((s) => s.setSelectedNoteId)
  const deletePassword = useVaultStore((s) => s.deletePassword)
  const deleteNote = useVaultStore((s) => s.deleteNote)

  const [selected, setSelected] = useState(0)
  const prevSeq = useRef(buttonSeq)

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq

    const cancel = () => {
      const back = target?.kind === "note" ? "NOTE_VIEW" : "PASSWORD_ENTRY"
      setDeleteTarget(null)
      setScreen(back)
    }

    if (buttonAction === "up" || buttonAction === "down") {
      setSelected((s) => (s === 0 ? 1 : 0))
    } else if (buttonAction === "left") {
      cancel()
    } else if (buttonAction === "confirm") {
      if (selected === 1 && target) {
        if (target.kind === "password") {
          deletePassword(target.id)
          setSelectedPasswordId(null)
          setDeleteTarget(null)
          setScreen("PASSWORD_LIST")
        } else {
          deleteNote(target.id)
          setSelectedNoteId(null)
          setDeleteTarget(null)
          setScreen("NOTE_LIST")
        }
      } else {
        cancel()
      }
    }
  }, [
    buttonAction,
    buttonSeq,
    selected,
    target,
    deletePassword,
    deleteNote,
    setDeleteTarget,
    setScreen,
    setSelectedPasswordId,
    setSelectedNoteId,
  ])

  const options = [
    { label: "No, cancel", danger: false },
    { label: "Yes, delete", danger: true },
  ]

  return (
    <ScreenLayout
      title="DELETE"
      hints={[
        { key: "▲▼", label: "Move" },
        { key: "OK", label: "Confirm" },
        { key: "◄", label: "Back" },
      ]}
    >
      <div className="flex flex-col h-full px-1 py-2 gap-3">
        <div className="oled-text-danger" style={{ fontSize: 12, fontWeight: 600 }}>
          Delete this {target?.kind ?? "item"}?
        </div>
        {target && (
          <div className="oled-text-secondary" style={{ fontSize: 11, wordBreak: "break-all" }}>
            “{target.label}”
          </div>
        )}
        <div className="oled-text-dim" style={{ fontSize: 10 }}>
          This cannot be undone.
        </div>
        <div className="flex flex-col gap-1 mt-2">
          {options.map((opt, i) => {
            const isSel = selected === i
            return (
              <div key={opt.label} className={`oled-row ${isSel ? "is-selected" : ""}`}>
                <span
                  className={
                    opt.danger
                      ? isSel
                        ? "oled-text-danger"
                        : "oled-text-secondary"
                      : isSel
                        ? "oled-text"
                        : "oled-text-secondary"
                  }
                  style={{ fontSize: 12 }}
                >
                  {opt.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ScreenLayout>
  )
}
