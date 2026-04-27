"use client"

import { ReactNode } from "react"
import { StatusBar } from "./StatusBar"
import { HintBar } from "./HintBar"

interface Hint {
  key: string
  label: string
}

interface ScreenLayoutProps {
  title?: string
  showBack?: boolean
  hints?: Hint[]
  children: ReactNode
  hideStatusBar?: boolean
}

export function ScreenLayout({
  title,
  showBack,
  hints,
  children,
  hideStatusBar = false,
}: ScreenLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      {!hideStatusBar && (
        <>
          <StatusBar title={title} showBack={showBack} />
          <div className="oled-divider" />
        </>
      )}
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
      {hints && hints.length > 0 && (
        <>
          <div className="oled-divider" />
          <HintBar hints={hints} />
        </>
      )}
    </div>
  )
}
