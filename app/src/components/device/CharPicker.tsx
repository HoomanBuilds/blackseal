"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"

const CHAR_GRID: string[][] = [
  ["A", "B", "C", "D", "E", "F", "G"],
  ["H", "I", "J", "K", "L", "M", "N"],
  ["O", "P", "Q", "R", "S", "T", "U"],
  ["V", "W", "X", "Y", "Z", " ", ""],
  ["a", "b", "c", "d", "e", "f", "g"],
  ["h", "i", "j", "k", "l", "m", "n"],
  ["o", "p", "q", "r", "s", "t", "u"],
  ["v", "w", "x", "y", "z", "", ""],
  ["0", "1", "2", "3", "4", "5", "6"],
  ["7", "8", "9", "!", "@", "#", "$"],
  ["%", "&", "*", "-", "_", ".", "/"],
  ["DEL", "", "DONE", "", "ESC", "", ""],
]

interface CharPickerProps {
  value: string
  onChange: (value: string) => void
  onDone: () => void
  onCancel?: () => void
  label: string
}

export function CharPicker({ value, onChange, onDone, onCancel, label }: CharPickerProps) {
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)

  const [row, setRow] = useState(0)
  const [col, setCol] = useState(0)
  const prevSeq = useRef(0)

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq

    if (buttonAction === "up") {
      setRow((r) => Math.max(0, r - 1))
    } else if (buttonAction === "down") {
      setRow((r) => Math.min(CHAR_GRID.length - 1, r + 1))
    } else if (buttonAction === "left") {
      setCol((c) => Math.max(0, c - 1))
    } else if (buttonAction === "right") {
      setCol((c) => Math.min(CHAR_GRID[0].length - 1, c + 1))
    } else if (buttonAction === "confirm") {
      const char = CHAR_GRID[row][col]
      if (char === "DEL") {
        onChange(value.slice(0, -1))
      } else if (char === "DONE") {
        onDone()
      } else if (char === "ESC") {
        onCancel?.()
      } else if (char !== "") {
        onChange(value + char)
      }
    }
  }, [buttonAction, buttonSeq, row, col, value, onChange, onDone])

  const visibleStart = Math.max(0, Math.min(row - 1, CHAR_GRID.length - 4))
  const visibleRows = CHAR_GRID.slice(visibleStart, visibleStart + 4)

  return (
    <div className="flex flex-col h-full" style={{ fontSize: 10 }}>
      <div className="oled-text-dim">{label}</div>
      <div style={{ fontSize: 12, minHeight: 16, marginTop: 2 }}>
        {value}
        <span className="animate-pulse">_</span>
      </div>
      <div className="flex-1 flex flex-col justify-center" style={{ gap: 2, fontFamily: "var(--font-oled)" }}>
        {visibleRows.map((gridRow, ri) => {
          const actualRow = visibleStart + ri
          return (
            <div key={actualRow} className="flex" style={{ gap: 4 }}>
              {gridRow.map((char, ci) => {
                const isSelected = actualRow === row && ci === col
                const display = char === "" ? " " : char
                return (
                  <span
                    key={ci}
                    style={{
                      width: char.length > 1 ? 24 : 12,
                      textAlign: "center",
                      fontWeight: isSelected ? "bold" : "normal",
                      background: isSelected ? "#00ff41" : "transparent",
                      color: isSelected ? "#000" : undefined,
                      visibility: char === "" ? "hidden" : "visible",
                    }}
                    className={!isSelected && char !== "" ? "oled-text-dim" : ""}
                  >
                    {display}
                  </span>
                )
              })}
            </div>
          )
        })}
      </div>
      <div className="oled-text-dim">[Arrows] Move [OK] Select{onCancel ? " [ESC] Back" : ""}</div>
    </div>
  )
}
