"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"
import { ScreenLayout } from "@/components/device/ScreenLayout"

const LINES_PER_PAGE = 5
const WRAP_WIDTH = 38

export function NoteView() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const selectedId = useDeviceStore((s) => s.selectedNoteId)
  const setSelectedNoteId = useDeviceStore((s) => s.setSelectedNoteId)
  const setEditingId = useDeviceStore((s) => s.setEditingId)
  const setDeleteTarget = useDeviceStore((s) => s.setDeleteTarget)
  const backupEnabled = useDeviceStore((s) => s.backupEnabled)
  const notes = useVaultStore((s) => s.vault?.notes ?? [])

  const note = notes.find((n) => n.id === selectedId)
  const [page, setPage] = useState(0)
  const prevSeq = useRef(buttonSeq)

  const lines = wrapText(note?.body ?? "", WRAP_WIDTH)
  const totalPages = Math.max(1, Math.ceil(lines.length / LINES_PER_PAGE))

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq

    if (buttonAction === "left") {
      setSelectedNoteId(null)
      setScreen("NOTE_LIST")
    } else if (buttonAction === "up") {
      setPage((p) => Math.max(0, p - 1))
    } else if (buttonAction === "confirm") {
      setPage((p) => (p + 1) % totalPages)
    } else if (buttonAction === "right" && note) {
      setEditingId(note.id)
      setScreen("EDIT_NOTE")
    } else if (buttonAction === "down" && note) {
      setDeleteTarget({ kind: "note", id: note.id, label: note.title })
      setScreen("DELETE_CONFIRM")
    }
  }, [
    buttonAction,
    buttonSeq,
    totalPages,
    note,
    setSelectedNoteId,
    setScreen,
    setEditingId,
    setDeleteTarget,
  ])

  if (!note) {
    return (
      <ScreenLayout title="NOTE" showBack>
        <div className="flex flex-col h-full items-center justify-center">
          <div className="oled-text-dim" style={{ fontSize: 11 }}>
            Not found
          </div>
        </div>
      </ScreenLayout>
    )
  }

  const pageLines = lines.slice(page * LINES_PER_PAGE, (page + 1) * LINES_PER_PAGE)

  return (
    <ScreenLayout
      title="NOTE"
      showBack
      hints={[
        { key: "OK", label: `Page ${page + 1}/${totalPages}` },
        { key: "▶", label: "Edit" },
        { key: "▼", label: "Delete" },
        { key: "◄", label: "Back" },
      ]}
    >
      <div className="flex flex-col h-full px-1 py-2 gap-2">
        <div className="flex items-center justify-between">
          <span className="oled-text" style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {note.title}
          </span>
          <BackupBadge backedUp={note.backedUp} backupEnabled={backupEnabled} />
        </div>
        <div className="oled-divider" />
        <div className="flex flex-col" style={{ fontSize: 11, gap: 1, fontFamily: "var(--font-console)" }}>
          {pageLines.map((line, i) => (
            <div key={i} className="oled-text-secondary">
              {line || " "}
            </div>
          ))}
        </div>
      </div>
    </ScreenLayout>
  )
}

function BackupBadge({ backedUp, backupEnabled }: { backedUp: boolean; backupEnabled: boolean }) {
  if (!backupEnabled)
    return (
      <span className="oled-text-dim" style={{ fontSize: 10 }}>
        BACKUP OFF
      </span>
    )
  return backedUp ? (
    <span className="oled-text-success" style={{ fontSize: 10 }}>
      SYNCED ✓
    </span>
  ) : (
    <span className="oled-text-warning" style={{ fontSize: 10 }}>
      NOT BACKED UP
    </span>
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
