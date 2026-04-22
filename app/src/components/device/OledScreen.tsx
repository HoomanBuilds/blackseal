"use client"

import { useDeviceStore } from "@/lib/store/device-store"

interface OledScreenProps {
  children: React.ReactNode
}

export function OledScreen({ children }: OledScreenProps) {
  const screen = useDeviceStore((s) => s.screen)

  return (
    <div className="oled-viewport relative overflow-hidden" style={{
      width: 336,
      height: 168,
      borderRadius: 2,
    }}>
      {/* Phosphor glow ambient light on the bezel edge */}
      <div
        className="absolute pointer-events-none z-30"
        style={{
          inset: -1,
          borderRadius: 2,
          boxShadow: "inset 0 0 25px rgba(0, 255, 65, 0.06)",
        }}
      />

      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 oled-scanlines" />

      {/* Rolling interference band */}
      <div className="absolute inset-0 pointer-events-none z-21 oled-interference" />

      {/* CRT vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Glass reflection */}
      <div
        className="absolute inset-0 pointer-events-none z-25"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.01) 100%)",
        }}
      />

      {/* Content area with screen transition */}
      <div
        key={screen}
        className="oled-text relative z-10 h-full oled-screen-enter"
        style={{
          padding: "8px 10px",
          fontSize: 14,
          lineHeight: "18px",
          letterSpacing: "0.5px",
        }}
      >
        {children}
      </div>
    </div>
  )
}
