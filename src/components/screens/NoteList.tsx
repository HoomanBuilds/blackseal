"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"

const VISIBLE_COUNT = 5

export function NoteList() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const setSelectedNoteId = useDeviceStore((s) => s.setSelectedNoteId)
  const notes = useVaultStore((s) => s.vault?.notes ?? [])

  const items = ["[+] Add New", ...notes.map((n) => n.title)]
  const [selected, setSelected] = useState(0)
  const prevSeq = useRef(0)

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq

    if (buttonAction === "up") {
      setSelected((s) => Math.max(0, s - 1))
    } else if (buttonAction === "down") {
      setSelected((s) => Math.min(items.length - 1, s + 1))
    } else if (buttonAction === "left") {
      setScreen("MAIN_MENU")
    } else if (buttonAction === "confirm") {
      if (selected === 0) {
        setScreen("ADD_NOTE")
      } else {
        const note = notes[selected - 1]
        if (note) {
          setSelectedNoteId(note.id)
          setScreen("NOTE_VIEW")
        }
      }
    }
  }, [buttonAction, buttonSeq, selected, items.length, notes, setScreen, setSelectedNoteId])

  const start = Math.max(0, Math.min(selected - Math.floor(VISIBLE_COUNT / 2), items.length - VISIBLE_COUNT))
  const visible = items.slice(start, start + VISIBLE_COUNT)

  return (
    <div className="flex flex-col h-full">
      <div className="oled-text-dim" style={{ fontSize: 10 }}>
        NOTES ({notes.length})
      </div>
      <div className="flex-1 flex flex-col" style={{ marginTop: 4, gap: 2 }}>
        {visible.map((label, i) => {
          const idx = start + i
          return (
            <div
              key={idx}
              style={{ fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              className={idx === selected ? "" : "oled-text-dim"}
            >
              {idx === selected ? ">" : " "} {label}
            </div>
          )
        })}
      </div>
      <div className="oled-text-dim" style={{ fontSize: 10 }}>
        [◄] Back [OK] Open
      </div>
    </div>
  )
}
