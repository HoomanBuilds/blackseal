import { describe, it, expect } from "vitest"
import { deriveKeypairFromSeed } from "../solana-keypair"
import { Keypair } from "@solana/web3.js"

describe("solana-keypair", () => {
  it("derives a valid Solana keypair from seed bytes", () => {
    const seed = new Uint8Array(64).fill(42)
    const keypair = deriveKeypairFromSeed(seed)
    expect(keypair).toBeInstanceOf(Keypair)
    expect(keypair.publicKey.toBase58().length).toBeGreaterThan(0)
  })

  it("derives the same keypair from the same seed", () => {
    const seed = new Uint8Array(64).fill(42)
    const kp1 = deriveKeypairFromSeed(seed)
    const kp2 = deriveKeypairFromSeed(seed)
    expect(kp1.publicKey.toBase58()).toBe(kp2.publicKey.toBase58())
  })

  it("derives different keypairs from different seeds", () => {
    const seed1 = new Uint8Array(64).fill(1)
    const seed2 = new Uint8Array(64).fill(2)
    const kp1 = deriveKeypairFromSeed(seed1)
    const kp2 = deriveKeypairFromSeed(seed2)
    expect(kp1.publicKey.toBase58()).not.toBe(kp2.publicKey.toBase58())
  })
})
