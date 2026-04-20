"use client"

interface OledScreenProps {
  children: React.ReactNode
}

export function OledScreen({ children }: OledScreenProps) {
  return (
    <div className="oled-screen relative w-[336px] h-[128px] bg-black rounded-sm overflow-hidden font-mono">
      <div className="oled-scanlines absolute inset-0 pointer-events-none z-10" />
      <div className="relative z-0 p-2 text-[#00ff41] text-xs leading-4 h-full">
        {children}
      </div>
    </div>
  )
}
