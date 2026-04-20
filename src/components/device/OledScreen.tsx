"use client"

interface OledScreenProps {
  children: React.ReactNode
}

export function OledScreen({ children }: OledScreenProps) {
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
          boxShadow: "inset 0 0 20px rgba(0, 255, 65, 0.03)",
        }}
      />

      {/* Content area */}
      <div
        className="oled-text relative z-10 h-full"
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
