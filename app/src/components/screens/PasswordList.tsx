"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useVaultStore } from "@/lib/store/vault-store"

const VISIBLE_COUNT = 5

export function PasswordList() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const passwords = useVaultStore((s) => s.vault?.passwords ?? [])
  const setSelectedPasswordId = useDeviceStore((s) => s.setSelectedPasswordId)

  const items = ["[+] Add New", ...passwords.map((p) => p.label)]
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
      setScreen("DASHBOARD")
    } else if (buttonAction === "confirm") {
      if (selected === 0) {
        setScreen("ADD_PASSWORD")
      } else {
        const entry = passwords[selected - 1]
        if (entry) {
          setSelectedPasswordId(entry.id)
          setScreen("PASSWORD_ENTRY")
        }
      }
    }
  }, [buttonAction, buttonSeq, selected, items.length, passwords, setScreen, setSelectedPasswordId])

  const start = Math.max(0, Math.min(selected - Math.floor(VISIBLE_COUNT / 2), items.length - VISIBLE_COUNT))
  const visible = items.slice(start, start + VISIBLE_COUNT)

  return (
    <div className="flex flex-col h-full">
      <div className="oled-text-dim" style={{ fontSize: 10 }}>
        PASSWORDS ({passwords.length})
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
