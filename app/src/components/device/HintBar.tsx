"use client"

interface Hint {
  key: string
  label: string
}

interface HintBarProps {
  hints: Hint[]
}

export function HintBar({ hints }: HintBarProps) {
  return (
    <div
      className="flex items-center justify-center gap-3 oled-text-dim"
      style={{ fontSize: 10, lineHeight: "12px" }}
    >
      {hints.map((h, i) => (
        <span key={i}>
          <span className="oled-text-secondary">[{h.key}]</span> {h.label}
        </span>
      ))}
    </div>
  )
}
