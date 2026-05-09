"use client"

import { ReactNode, useEffect, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"

interface OledScreenProps {
  children: ReactNode
  width?: number
  height?: number
}

export function OledScreen({ children, width, height = 264 }: OledScreenProps) {
  const screen = useDeviceStore((s) => s.screen)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    setAnimKey((k) => k + 1)
  }, [screen])

  return (
    <div
      className="oled-viewport mx-auto"
      style={{
        width: width ?? "100%",
        height,
        padding: "10px 14px",
        fontSize: 13,
        lineHeight: "16px",
        letterSpacing: 0.2,
        boxShadow: "inset 0 0 0 1px rgba(74,158,255,0.04)",
      }}
    >
      <div
        key={animKey}
        className="oled-screen-enter"
        style={{ width: "100%", height: "100%" }}
      >
        {children}
      </div>
    </div>
  )
}
