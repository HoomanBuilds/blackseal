"use client"

import { useEffect } from "react"
import { useDeviceStore, type ButtonAction } from "@/lib/store/device-store"

const dpadIcons: Record<string, string> = {
  up: "\u25B2",
  down: "\u25BC",
  left: "\u25C0",
  right: "\u25B6",
}

export function Buttons() {
  const pressButton = useDeviceStore((s) => s.pressButton)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const keyMap: Record<string, ButtonAction> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        Enter: "confirm",
      }
      const action = keyMap[e.key]
      if (action) {
        e.preventDefault()
        pressButton(action)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [pressButton])

  return (
    <div className="flex flex-col items-center" style={{ marginTop: 16, gap: 4 }}>
      {/* D-pad cluster */}
      <div
        className="grid w-fit"
        style={{
          gridTemplateColumns: "repeat(3, 44px)",
          gridTemplateRows: "repeat(3, 44px)",
          gap: 5,
        }}
      >
        <div />
        <DpadButton action="up" />
        <div />
        <DpadButton action="left" />
        {/* Center nub */}
        <div className="flex items-center justify-center">
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "radial-gradient(circle at 40% 40%, #2a2a2e, #18181c)",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6), 0 0.5px 0 rgba(255,255,255,0.03)",
            }}
          />
        </div>
        <DpadButton action="right" />
        <div />
        <DpadButton action="down" />
        <div />
      </div>

      {/* Confirm button */}
      <button
        className="hw-btn hw-btn-confirm flex items-center justify-center"
        style={{ marginTop: 8 }}
        onClick={() => pressButton("confirm")}
      >
        <span className="hw-btn-label">OK</span>
      </button>
    </div>
  )
}

function DpadButton({ action }: { action: "up" | "down" | "left" | "right" }) {
  const pressButton = useDeviceStore((s) => s.pressButton)
  return (
    <button
      className="hw-btn hw-btn-dpad flex items-center justify-center"
      onClick={() => pressButton(action)}
    >
      <span className="hw-btn-icon">{dpadIcons[action]}</span>
    </button>
  )
}
