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
  const prevSeq = useRef(0)

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq

    if (buttonAction === "up") {
      setDigits((d) => {
        const next = [...d]
        next[position] = (next[position] + 1) % 10
        return next
      })
    } else if (buttonAction === "down") {
      setDigits((d) => {
        const next = [...d]
        next[position] = (next[position] + 9) % 10
        return next
      })
    } else if (buttonAction === "right") {
      setPosition((p) => Math.min(length - 1, p + 1))
    } else if (buttonAction === "left") {
      setPosition((p) => Math.max(0, p - 1))
    } else if (buttonAction === "confirm") {
      onSubmit(digits.join(""))
    }
  }, [buttonAction, buttonSeq, position, digits, length, onSubmit])

  return (
    <div className="flex flex-col items-center">
      <div className="flex" style={{ gap: 4, fontSize: 16 }}>
        {digits.map((d, i) => (
          <span
            key={i}
            style={{
              fontWeight: i === position ? "bold" : "normal",
              textDecoration: i === position ? "underline" : "none",
            }}
            className={i === position ? "" : "oled-text-dim"}
          >
            {d}
          </span>
        ))}
      </div>
      <div className="oled-text-dim" style={{ fontSize: 10, marginTop: 8 }}>
        [▲▼] Digit [◄►] Move [OK] Submit
      </div>
    </div>
  )
}
