"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { ScreenLayout } from "@/components/device/ScreenLayout"

type Option = {
  id: "new" | "restore"
  label: string
  hint: string
}

const OPTIONS: Option[] = [
  { id: "new", label: "Create new vault", hint: "Generate a fresh 24-word seed" },
  { id: "restore", label: "Restore from seed", hint: "Enter an existing 24-word seed" },
]

export function SetupChoice() {
  const setScreen = useDeviceStore((s) => s.setScreen)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)
  const [index, setIndex] = useState(0)
  const prevSeq = useRef(buttonSeq)

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction) return
    prevSeq.current = buttonSeq

    if (buttonAction === "up" || buttonAction === "left") {
      setIndex((i) => (i === 0 ? OPTIONS.length - 1 : i - 1))
    } else if (buttonAction === "down" || buttonAction === "right") {
      setIndex((i) => (i + 1) % OPTIONS.length)
    } else if (buttonAction === "confirm") {
      const choice = OPTIONS[index]
      if (choice.id === "new") {
        setScreen("GENERATE_SEED")
      } else {
        setScreen("RESTORE_SEED")
      }
    }
  }, [buttonAction, buttonSeq, index, setScreen])

  return (
    <ScreenLayout
      hideStatusBar
      hints={[
        { key: "▲▼", label: "Move" },
        { key: "OK", label: "Select" },
      ]}
    >
      <div className="flex flex-col h-full px-2 py-2">
        <div className="flex items-center justify-between">
          <span
            className="oled-text"
            style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}
          >
            SETUP
          </span>
          <span className="oled-text-secondary" style={{ fontSize: 10 }}>
            Welcome
          </span>
        </div>

        <div className="oled-text-secondary" style={{ fontSize: 10, marginTop: 4 }}>
          How would you like to start?
        </div>

        <div className="flex-1 flex flex-col justify-center gap-2.5 mt-2">
          {OPTIONS.map((opt, i) => {
            const active = i === index
            return (
              <div
                key={opt.id}
                style={{
                  border: `1px solid ${active ? "var(--oled-accent)" : "var(--oled-border)"}`,
                  background: active ? "rgba(74, 158, 255, 0.10)" : "transparent",
                  padding: "8px 10px",
                  transition: "background 120ms ease, border-color 120ms ease",
                }}
              >
                <div
                  className={active ? "oled-text-accent" : "oled-text"}
                  style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.3 }}
                >
                  {active ? "▶ " : "  "}
                  {opt.label}
                </div>
                <div
                  className="oled-text-dim"
                  style={{ fontSize: 10, marginTop: 2, marginLeft: 14 }}
                >
                  {opt.hint}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ScreenLayout>
  )
}
