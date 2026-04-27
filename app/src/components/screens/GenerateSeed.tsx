"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { generateSeedPhrase } from "@/lib/crypto/bip39"
import { ScreenLayout } from "@/components/device/ScreenLayout"

export function GenerateSeed() {
  const setSeedPhrase = useDeviceStore((s) => s.setSeedPhrase)
  const setScreen = useDeviceStore((s) => s.setScreen)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)

  const [words, setWords] = useState<string[]>([])
  const [index, setIndex] = useState(0)
  const prevSeq = useRef(buttonSeq)

  useEffect(() => {
    const phrase = generateSeedPhrase()
    setWords(phrase.split(" "))
    setSeedPhrase(phrase)
  }, [setSeedPhrase])

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction || words.length === 0) return
    prevSeq.current = buttonSeq

    if (buttonAction === "right" || buttonAction === "down" || buttonAction === "confirm") {
      if (index < words.length - 1) {
        setIndex((i) => i + 1)
      } else {
        setScreen("VERIFY_SEED")
      }
    }
    if (buttonAction === "left" || buttonAction === "up") {
      if (index > 0) {
        setIndex((i) => i - 1)
      }
    }
  }, [buttonAction, buttonSeq, index, words.length, setScreen])

  if (words.length === 0) return null

  const progressPct = ((index + 1) / words.length) * 100
  const isLast = index === words.length - 1

  return (
    <ScreenLayout
      hideStatusBar
      hints={[
        { key: "◄", label: "Back" },
        { key: "►", label: "Next" },
        { key: "OK", label: isLast ? "Continue" : "Next" },
      ]}
    >
      <div className="flex flex-col h-full px-2 py-2">
        <div className="flex items-center justify-between">
          <span className="oled-text" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>
            SETUP · SEED
          </span>
          <span className="oled-text-secondary" style={{ fontSize: 10 }}>
            Word {index + 1} of {words.length}
          </span>
        </div>
        <div className="oled-text-warning" style={{ fontSize: 10, marginTop: 4 }}>
          Write these down
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="oled-text" style={{ fontSize: 22, fontWeight: 600, fontFamily: "var(--font-console)" }}>
            <span className="oled-text-dim" style={{ marginRight: 8 }}>{index + 1}.</span>
            {words[index]}
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: 3,
            background: "var(--oled-border)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressPct}%`,
              height: "100%",
              background: "var(--oled-accent)",
              transition: "width 120ms ease-out",
            }}
          />
        </div>
      </div>
    </ScreenLayout>
  )
}
