import { describe, it, expect } from "vitest"
import { deriveEncryptionKey, deriveKeyFromPin } from "../key-derivation"
import { encrypt, decrypt } from "../encryption"

describe("key-derivation", () => {
  it("derives a 32-byte key from seed bytes", async () => {
    const fakeSeed = new Uint8Array(64).fill(1)
    const key = await deriveEncryptionKey(fakeSeed)
    expect(key.type).toBe("secret")
    expect(key.algorithm.name).toBe("AES-GCM")
    expect(key.extractable).toBe(false)
  })

  it("derives the same key from the same seed", async () => {
    const seed = new Uint8Array(64).fill(42)
    const key1 = await deriveEncryptionKey(seed)
    const key2 = await deriveEncryptionKey(seed)
    const { ciphertext, iv } = await encrypt("determinism-check", key1)
    const plain = await decrypt(ciphertext, iv, key2)
    expect(plain).toBe("determinism-check")
  })

  it("derives different keys from different seeds", async () => {
    const seed1 = new Uint8Array(64).fill(1)
    const seed2 = new Uint8Array(64).fill(2)
    const key1 = await deriveEncryptionKey(seed1)
    const key2 = await deriveEncryptionKey(seed2)
    const { ciphertext, iv } = await encrypt("cross-key-test", key1)
    await expect(decrypt(ciphertext, iv, key2)).rejects.toThrow()
  })

  it("hashes a PIN with salt for verification", async () => {
    const hash = await deriveKeyFromPin("12345678", "somesalt")
    expect(typeof hash).toBe("string")
    expect(hash.length).toBeGreaterThan(0)
  })

  it("produces same hash for same PIN and salt", async () => {
    const hash1 = await deriveKeyFromPin("12345678", "somesalt")
    const hash2 = await deriveKeyFromPin("12345678", "somesalt")
    expect(hash1).toBe(hash2)
  })

  it("produces different hash for different PINs", async () => {
    const hash1 = await deriveKeyFromPin("12345678", "somesalt")
    const hash2 = await deriveKeyFromPin("87654321", "somesalt")
    expect(hash1).not.toBe(hash2)
  })
})
