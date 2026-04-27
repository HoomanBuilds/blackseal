"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { ScreenLayout } from "@/components/device/ScreenLayout"

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
  const [flash, setFlash] = useState(false)
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
        setFlash(true)
        const isLast = challengeIndex >= challenges.length - 1
        setTimeout(() => {
          setFlash(false)
          if (isLast) {
            setScreen("SET_PIN")
          } else {
            setChallengeIndex((i) => i + 1)
            setSelected(0)
          }
        }, 250)
      } else {
        setError(true)
      }
    }
  }, [buttonAction, buttonSeq, selected, current, challengeIndex, challenges.length, setScreen])

  if (!current) return null

  return (
    <ScreenLayout
      title="VERIFY SEED"
      hints={[
        { key: "◄", label: "Back" },
        { key: "▲▼", label: "Select" },
        { key: "OK", label: "Confirm" },
      ]}
    >
      <div className="flex flex-col h-full px-1 py-2">
        <div className="flex items-center justify-between">
          <span className="oled-text-secondary" style={{ fontSize: 10 }}>
            Challenge {challengeIndex + 1} of {challenges.length}
          </span>
          {flash && (
            <span className="oled-text-success" style={{ fontSize: 10, fontWeight: 600 }}>
              ✓ Correct
            </span>
          )}
        </div>
        <div className="oled-text" style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>
          Pick word #{current.wordIndex + 1}
        </div>
        <div className="flex-1 flex flex-col gap-1 mt-2">
          {current.options.map((word, i) => {
            const isSel = i === selected
            return (
              <div key={word} className={`oled-row ${isSel ? "is-selected" : ""}`}>
                <span
                  className={isSel ? "oled-text" : "oled-text-secondary"}
                  style={{ fontSize: 12, fontFamily: "var(--font-console)" }}
                >
                  {word}
                </span>
              </div>
            )
          })}
        </div>
        {error && (
          <div className="oled-text-danger" style={{ fontSize: 10, marginTop: 2 }}>
            Wrong word. Try again.
          </div>
        )}
      </div>
    </ScreenLayout>
  )
}
