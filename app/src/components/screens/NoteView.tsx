"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"

const LINES_PER_PAGE = 4

export function NoteView() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const selectedId = useDeviceStore((s) => s.selectedNoteId)
  const setSelectedNoteId = useDeviceStore((s) => s.setSelectedNoteId)
  const notes = useVaultStore((s) => s.vault?.notes ?? [])
  const deleteNote = useVaultStore((s) => s.deleteNote)

  const note = notes.find((n) => n.id === selectedId)
  const [page, setPage] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const prevSeq = useRef(0)

  const lines = wrapText(note?.body ?? "", 21)
  const totalPages = Math.max(1, Math.ceil(lines.length / LINES_PER_PAGE))

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq

    if (buttonAction === "left") {
      if (confirmDelete) {
        setConfirmDelete(false)
      } else {
        setSelectedNoteId(null)
        setScreen("NOTE_LIST")
      }
    } else if (buttonAction === "up") {
      setPage((p) => Math.max(0, p - 1))
    } else if (buttonAction === "down") {
      setPage((p) => Math.min(totalPages - 1, p + 1))
    } else if (buttonAction === "confirm") {
      if (confirmDelete && note) {
        deleteNote(note.id)
        setSelectedNoteId(null)
        setScreen("NOTE_LIST")
      } else {
        setConfirmDelete(true)
      }
    }
  }, [buttonAction, buttonSeq, page, totalPages, confirmDelete, note, deleteNote, setSelectedNoteId, setScreen])

  if (!note) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="oled-text-dim" style={{ fontSize: 11 }}>
          Not found
        </div>
      </div>
    )
  }

  const pageLines = lines.slice(page * LINES_PER_PAGE, (page + 1) * LINES_PER_PAGE)

  return (
    <div className="flex flex-col h-full">
      <div className="oled-text-dim" style={{ fontSize: 10 }}>
        {note.title}
      </div>
      <div className="flex-1 flex flex-col" style={{ marginTop: 4, fontSize: 11, gap: 1 }}>
        {pageLines.map((line, i) => (
          <div key={i}>{line || " "}</div>
        ))}
      </div>
      {confirmDelete ? (
        <div style={{ fontSize: 10, color: "#ff4444" }}>
          Delete? [OK] Yes [◄] Cancel
        </div>
      ) : (
        <div className="oled-text-dim" style={{ fontSize: 10 }}>
          [▲▼] Page {page + 1}/{totalPages} [OK] Del [◄] Back
        </div>
      )}
    </div>
  )
}

function wrapText(text: string, width: number): string[] {
  const paragraphs = text.split("\n")
  const out: string[] = []
  for (const para of paragraphs) {
    if (para.length === 0) {
      out.push("")
      continue
    }
    const words = para.split(" ")
    let current = ""
    for (const word of words) {
      if (current.length === 0) {
        current = word
      } else if (current.length + 1 + word.length <= width) {
        current += " " + word
      } else {
        out.push(current)
        current = word
      }
    }
    if (current.length > 0) out.push(current)
  }
  return out
}
