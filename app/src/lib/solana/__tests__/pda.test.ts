// @vitest-environment node
import { describe, it, expect } from "vitest"
import { Keypair, PublicKey } from "@solana/web3.js"
import { deriveVaultPda, VAULT_SEED } from "../pda"
import { PROGRAM_ID } from "../program"

describe("deriveVaultPda", () => {
  it("derives a deterministic PDA for a given owner", () => {
    const owner = Keypair.generate().publicKey
    const [pda1, bump1] = deriveVaultPda(owner, PROGRAM_ID)
    const [pda2, bump2] = deriveVaultPda(owner, PROGRAM_ID)

    expect(pda1.toBase58()).to.equal(pda2.toBase58())
    expect(bump1).to.equal(bump2)
  })

  it("produces different PDAs for different owners", () => {
    const alice = Keypair.generate().publicKey
    const bob = Keypair.generate().publicKey

    const [aPda] = deriveVaultPda(alice, PROGRAM_ID)
    const [bPda] = deriveVaultPda(bob, PROGRAM_ID)

    expect(aPda.toBase58()).not.to.equal(bPda.toBase58())
  })

  it("uses the expected seed prefix", () => {
    expect(VAULT_SEED.toString()).toBe("black_seal_vault")
  })

  it("PDA is off-curve (as all program-derived addresses must be)", () => {
    const owner = Keypair.generate().publicKey
    const [pda] = deriveVaultPda(owner, PROGRAM_ID)
    expect(PublicKey.isOnCurve(pda.toBytes())).toBe(false)
  })
})
