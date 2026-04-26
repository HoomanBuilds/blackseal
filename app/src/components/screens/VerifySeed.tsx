"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"

function cryptoRandom(): number {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] / 0x100000000
}

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => cryptoRandom() - 0.5)
  return shuffled.slice(0, count)
}

export function VerifySeed() {
  const seedPhrase = useDeviceStore((s) => s.seedPhrase)
  const setScreen = useDeviceStore((s) => s.setScreen)
  const buttonAction = useDeviceStore((s) => s.buttonAction)
  const buttonSeq = useDeviceStore((s) => s.buttonSeq)

  const [challengeIndex, setChallengeIndex] = useState(0)
  const [selected, setSelected] = useState(0)
  const [error, setError] = useState(false)
  const prevSeq = useRef(0)

  const words = useMemo(() => seedPhrase?.split(" ") ?? [], [seedPhrase])

  const challenges = useMemo(() => {
    if (words.length === 0) return []
    const indices = pickRandom(
      Array.from({ length: words.length }, (_, i) => i),
      3
    ).sort((a, b) => a - b)

    return indices.map((wordIndex) => {
      const correct = words[wordIndex]
      const decoys = pickRandom(
        words.filter((w) => w !== correct),
        3
      )
      const options = [...decoys, correct].sort(() => cryptoRandom() - 0.5)
      return { wordIndex, correct, options }
    })
  }, [words])

  const current = challenges[challengeIndex]

  useEffect(() => {
    if (buttonSeq === prevSeq.current || !buttonAction || !current) return
    prevSeq.current = buttonSeq
    setError(false)

    if (buttonAction === "left") {
      setScreen("GENERATE_SEED")
      return
    } else if (buttonAction === "up") {
      setSelected((s) => Math.max(0, s - 1))
    } else if (buttonAction === "down") {
      setSelected((s) => Math.min(current.options.length - 1, s + 1))
    } else if (buttonAction === "confirm") {
      if (current.options[selected] === current.correct) {
        if (challengeIndex < challenges.length - 1) {
          setChallengeIndex((i) => i + 1)
          setSelected(0)
        } else {
          setScreen("SET_PIN")
        }
      } else {
        setError(true)
      }
    }
  }, [buttonAction, buttonSeq, selected, current, challengeIndex, challenges.length, setScreen])

  if (!current) return null

  return (
    <div className="flex flex-col h-full">
      <div className="oled-text-dim" style={{ fontSize: 10 }}>
        VERIFY ({challengeIndex + 1}/3)
      </div>
      <div style={{ fontSize: 11, marginTop: 2 }}>
        Word #{current.wordIndex + 1}?
      </div>
      <div className="flex-1 flex flex-col gap-1 justify-center" style={{ marginTop: 4 }}>
        {current.options.map((word, i) => (
          <div
            key={word}
            style={{ fontSize: 12 }}
            className={i === selected ? "" : "oled-text-dim"}
          >
            {i === selected ? ">" : " "} {word}
          </div>
        ))}
      </div>
      {error && (
        <div style={{ fontSize: 10, color: "#ff4444" }}>Wrong! Try again.</div>
      )}
      <div className="oled-text-dim" style={{ fontSize: 10 }}>
        [◄] Back [▲▼] Select [OK] Confirm
      </div>
    </div>
  )
}
