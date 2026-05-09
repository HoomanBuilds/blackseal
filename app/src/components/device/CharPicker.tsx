"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"

type Mode = "abc" | "ABC" | "num"

interface ActionCell {
  type: "action"
  id: "MODE" | "SPACE" | "DEL" | "DONE" | "ESC"
  label: string
  width?: number
}

interface CharCell {
  type: "char"
  char: string
}

type Cell = ActionCell | CharCell

const LOWER_LETTERS = "abcdefghijklmnopqrstuvwxyz".split("")
const UPPER_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
const DIGITS_AND_SYMBOLS = [
  ..."0123456789".split(""),
  ..."!@#$%&*-_.".split(""),
  ..."/+=?:;".split(""),
  ..."'\"()[]{},".split(""),
]

const COLS = 10

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function buildGrid(mode: Mode, hasCancel: boolean): Cell[][] {
  const charSource =
    mode === "abc" ? LOWER_LETTERS : mode === "ABC" ? UPPER_LETTERS : DIGITS_AND_SYMBOLS

  const charRows: Cell[][] = chunk(charSource, COLS).map((row) =>
    row.map<CharCell>((c) => ({ type: "char", char: c }))
  )

  // pad last char row
  const last = charRows[charRows.length - 1]
  while (last.length < COLS) last.push({ type: "char", char: "" })

  // action row — fills exactly COLS columns
  const actions: ActionCell[] = [
    { type: "action", id: "MODE", label: nextModeLabel(mode), width: 2 },
    { type: "action", id: "SPACE", label: "␣", width: 2 },
    { type: "action", id: "DEL", label: "⌫", width: 2 },
    { type: "action", id: "DONE", label: "DONE", width: hasCancel ? 2 : 4 },
  ]
  if (hasCancel) actions.push({ type: "action", id: "ESC", label: "ESC", width: 2 })

  // Expand action row across COLS slots (each width-N action occupies N cells but renders as one)
  const actionRow: Cell[] = []
  for (const a of actions) {
    actionRow.push(a)
    for (let i = 1; i < (a.width ?? 1); i++) {
      actionRow.push({ type: "action", id: a.id, label: "", width: 0 } as ActionCell)
    }
  }
  while (actionRow.length < COLS) actionRow.push({ type: "char", char: "" })

  return [...charRows, actionRow]
}

function nextModeLabel(mode: Mode): string {
  if (mode === "abc") return "ABC"
  if (mode === "ABC") return "123"
  return "abc"
}

function nextMode(mode: Mode): Mode {
  if (mode === "abc") return "ABC"
  if (mode === "ABC") return "num"
  return "abc"
}

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

  const [mode, setMode] = useState<Mode>("abc")
  const [row, setRow] = useState(0)
  const [col, setCol] = useState(0)
  const prevSeq = useRef(buttonSeq)

  const grid = useMemo(() => buildGrid(mode, !!onCancel), [mode, onCancel])

  // If grid shrinks (e.g. switch from 123 -> abc), clamp position
  useEffect(() => {
    if (row >= grid.length) setRow(grid.length - 1)
    if (col >= COLS) setCol(COLS - 1)
  }, [grid, row, col])

  // Find the leftmost coordinate of a multi-cell action so the cursor "snaps" to its head
  const findLeadingCol = (r: number, c: number): number => {
    const cell = grid[r]?.[c]
    if (cell?.type !== "action") return c
    let lead = c
    while (lead > 0) {
      const prev = grid[r][lead - 1]
      if (prev.type === "action" && prev.id === cell.id) lead--
      else break
    }
    return lead
  }

  const moveHorizontal = (dir: 1 | -1) => {
    let r = row
    let c = col
    let safety = 0
    do {
      c += dir
      if (c < 0) {
        c = COLS - 1
        r = (r - 1 + grid.length) % grid.length
      } else if (c >= COLS) {
        c = 0
        r = (r + 1) % grid.length
      }
      const cell = grid[r][c]
      // skip blank chars and continuation slots of multi-cell actions
      if (cell.type === "char" && cell.char === "") {
        safety++
        continue
      }
      if (cell.type === "action" && cell.label === "") {
        safety++
        continue
      }
      break
    } while (safety < COLS * grid.length)
    setRow(r)
    setCol(findLeadingCol(r, c))
  }

  const moveVertical = (dir: 1 | -1) => {
    let r = row
    let c = col
    let safety = 0
    do {
      r = (r + dir + grid.length) % grid.length
      const cell = grid[r][c]
      if (cell.type === "char" && cell.char === "") {
        safety++
        continue
      }
      if (cell.type === "action" && cell.label === "") {
        // shift to lead of this action
        c = findLeadingCol(r, c)
      }
      break
    } while (safety < grid.length)
    setRow(r)
    setCol(c)
  }

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq

    if (buttonAction === "up") {
      moveVertical(-1)
    } else if (buttonAction === "down") {
      moveVertical(1)
    } else if (buttonAction === "left") {
      moveHorizontal(-1)
    } else if (buttonAction === "right") {
      moveHorizontal(1)
    } else if (buttonAction === "confirm") {
      const cell = grid[row][col]
      if (!cell) return
      if (cell.type === "char") {
        if (cell.char) onChange(value + cell.char)
      } else {
        switch (cell.id) {
          case "MODE":
            setMode(nextMode(mode))
            setRow(0)
            setCol(0)
            break
          case "SPACE":
            onChange(value + " ")
            break
          case "DEL":
            onChange(value.slice(0, -1))
            break
          case "DONE":
            onDone()
            break
          case "ESC":
            onCancel?.()
            break
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonAction, buttonSeq])

  return (
    <div className="flex flex-col h-full">
      {/* Field label + value preview */}
      <div className="flex items-baseline justify-between">
        <span className="oled-text-dim" style={{ fontSize: 9, letterSpacing: 0.4 }}>
          {label.toUpperCase()}
        </span>
        <span className="oled-text-dim" style={{ fontSize: 9, letterSpacing: 0.5 }}>
          {mode.toUpperCase()} · {value.length}
        </span>
      </div>
      <div
        className="oled-text"
        style={{
          fontSize: 13,
          minHeight: 18,
          marginTop: 2,
          fontFamily: "var(--font-console)",
          background: "rgba(0,255,65,0.04)",
          padding: "2px 6px",
          borderRadius: 2,
          letterSpacing: 0.5,
          wordBreak: "break-all",
        }}
      >
        {value || <span className="oled-text-dim">·····</span>}
        <span className="char-cursor oled-text-accent">▍</span>
      </div>

      {/* Grid — fills remaining space, centered */}
      <div
        className="flex-1 min-h-0 flex flex-col justify-center"
        style={{ marginTop: 4, fontFamily: "var(--font-console)" }}
      >
        <div className="char-grid">
          {grid.map((gridRow, ri) =>
            gridRow.map((cell, ci) => {
              if (cell.type === "char") {
                if (cell.char === "") {
                  return <span key={`${ri}-${ci}`} className="char-cell is-empty" />
                }
                const isSelected = ri === row && ci === col
                return (
                  <span
                    key={`${ri}-${ci}`}
                    className={`char-cell ${isSelected ? "is-selected" : ""}`}
                  >
                    {cell.char}
                  </span>
                )
              }
              // action cell
              if (cell.label === "") {
                // continuation slot — render nothing, but the head cell spans
                return null
              }
              const isSelected =
                ri === row &&
                (ci === col ||
                  (grid[ri][col]?.type === "action" &&
                    (grid[ri][col] as ActionCell).id === cell.id))
              const span = cell.width ?? 1
              return (
                <span
                  key={`${ri}-${ci}`}
                  className={`char-cell is-action ${
                    cell.id === "DONE" ? "is-confirm" : ""
                  } ${cell.id === "ESC" ? "is-cancel" : ""} ${
                    isSelected ? "is-selected" : ""
                  }`}
                  style={{ gridColumn: `span ${span}` }}
                >
                  {cell.label}
                </span>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
