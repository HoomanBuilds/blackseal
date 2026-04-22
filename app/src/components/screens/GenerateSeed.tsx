"use client"

import { useEffect, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { generateSeedPhrase } from "@/lib/crypto/bip39"

export function GenerateSeed() {
  const setSeedPhrase = useDeviceStore((s) => s.setSeedPhrase)
  const setScreen = useDeviceStore((s) => s.setScreen)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)

  const [words, setWords] = useState<string[]>([])
  const [index, setIndex] = useState(0)
  const prevSeq = useRef(0)

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

  return (
    <div className="flex flex-col h-full">
      <div className="oled-text-dim" style={{ fontSize: 10 }}>
        WRITE THESE DOWN
      </div>
      <div className="oled-text-dim" style={{ fontSize: 10, marginTop: 2 }}>
        Word {index + 1} of {words.length}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div style={{ fontSize: 16, fontWeight: "bold" }}>
          {index + 1}. {words[index]}
        </div>
      </div>
      <div className="oled-text-dim" style={{ fontSize: 10, textAlign: "center" }}>
        {index < words.length - 1 ? "[►] Next word" : "[OK] Continue"}
      </div>
    </div>
  )
}
