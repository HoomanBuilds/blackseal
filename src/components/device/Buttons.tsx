"use client"

import { useCallback, useEffect } from "react"

export type ButtonAction = "up" | "down" | "left" | "right" | "confirm"

interface ButtonsProps {
  onPress: (action: ButtonAction) => void
}

export function Buttons({ onPress }: ButtonsProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
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
        onPress(action)
      }
    },
    [onPress]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const buttonClass =
    "w-10 h-10 rounded-full bg-zinc-700 border border-zinc-600 shadow-lg active:shadow-inner active:bg-zinc-800 hover:bg-zinc-600 transition-all duration-100 flex items-center justify-center text-zinc-300 text-sm select-none cursor-pointer"

  return (
    <div className="flex flex-col items-center gap-1 mt-4">
      <div className="grid grid-cols-3 gap-1 w-fit">
        <div />
        <button className={buttonClass} onClick={() => onPress("up")}>
          ▲
        </button>
        <div />
        <button className={buttonClass} onClick={() => onPress("left")}>
          ◄
        </button>
        <div />
        <button className={buttonClass} onClick={() => onPress("right")}>
          ►
        </button>
        <div />
        <button className={buttonClass} onClick={() => onPress("down")}>
          ▼
        </button>
        <div />
      </div>
      <button
        className="mt-2 w-16 h-10 rounded-full bg-zinc-600 border border-zinc-500 shadow-lg active:shadow-inner active:bg-zinc-700 hover:bg-zinc-500 transition-all duration-100 text-zinc-200 text-xs font-medium select-none cursor-pointer"
        onClick={() => onPress("confirm")}
      >
        ● OK
      </button>
    </div>
  )
}
