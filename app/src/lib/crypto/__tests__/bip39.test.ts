import { describe, it, expect } from "vitest"
import { generateSeedPhrase, validateSeedPhrase, mnemonicToSeed } from "../bip39"

describe("bip39", () => {
  it("generates a 24-word seed phrase", () => {
    const phrase = generateSeedPhrase()
    const words = phrase.split(" ")
    expect(words).toHaveLength(24)
  })

  it("generates different phrases each time", () => {
    const phrase1 = generateSeedPhrase()
    const phrase2 = generateSeedPhrase()
    expect(phrase1).not.toBe(phrase2)
  })

  it("validates a correct seed phrase", () => {
    const phrase = generateSeedPhrase()
    expect(validateSeedPhrase(phrase)).toBe(true)
  })

  it("rejects an invalid seed phrase", () => {
    expect(validateSeedPhrase("invalid words here that are not real")).toBe(false)
  })

  it("converts mnemonic to seed bytes", async () => {
    const phrase = generateSeedPhrase()
    const seed = await mnemonicToSeed(phrase)
    expect(seed).toBeInstanceOf(Uint8Array)
    expect(seed.length).toBe(64)
  })
})
