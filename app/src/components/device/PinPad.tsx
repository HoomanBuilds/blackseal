"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"

interface PinPadProps {
  onSubmit: (pin: string) => void
  length?: number
}

export function PinPad({ onSubmit, length = 8 }: PinPadProps) {
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)

  const [digits, setDigits] = useState<number[]>(Array(length).fill(0))
  const [position, setPosition] = useState(0)
  const [touched, setTouched] = useState(false)
  const prevSeq = useRef(buttonSeq)

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq

    if (buttonAction === "up") {
      setTouched(true)
      setDigits((d) => {
        const next = [...d]
        next[position] = (next[position] + 1) % 10
        return next
      })
    } else if (buttonAction === "down") {
      setTouched(true)
      setDigits((d) => {
        const next = [...d]
        next[position] = (next[position] + 9) % 10
        return next
      })
    } else if (buttonAction === "right") {
      setTouched(true)
      setPosition((p) => Math.min(length - 1, p + 1))
    } else if (buttonAction === "left") {
      setTouched(true)
      setPosition((p) => Math.max(0, p - 1))
    } else if (buttonAction === "confirm") {
      if (touched) onSubmit(digits.join(""))
    }
  }, [buttonAction, buttonSeq, position, digits, length, onSubmit, touched])

  return (
    <div className="flex flex-col items-center">
      <div className="flex" style={{ gap: 8, fontSize: 20, fontFamily: "var(--font-console)" }}>
        {digits.map((d, i) => {
          const active = i === position
          return (
            <span
              key={i}
              style={{
                fontWeight: active ? 700 : 400,
                color: active ? "var(--oled-accent)" : undefined,
                borderBottom: active ? "2px solid var(--oled-accent)" : "2px solid transparent",
                paddingBottom: 2,
                minWidth: 16,
                textAlign: "center",
              }}
              className={active ? "" : "oled-text-secondary"}
            >
              {d}
            </span>
          )
        })}
      </div>
      <div className="oled-text-dim" style={{ fontSize: 10, marginTop: 10 }}>
        <span className="oled-text-secondary">[▲▼]</span> Digit{" "}
        <span className="oled-text-secondary">[◄►]</span> Move{" "}
        <span className="oled-text-secondary">[OK]</span> Submit
      </div>
    </div>
  )
}
