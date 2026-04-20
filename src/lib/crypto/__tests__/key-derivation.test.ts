import { describe, it, expect } from "vitest"
import { deriveEncryptionKey, deriveKeyFromPin } from "../key-derivation"

describe("key-derivation", () => {
  it("derives a 32-byte key from seed bytes", async () => {
    const fakeSeed = new Uint8Array(64).fill(1)
    const key = await deriveEncryptionKey(fakeSeed)
    expect(key.type).toBe("secret")
    expect(key.algorithm.name).toBe("AES-GCM")
  })

  it("derives the same key from the same seed", async () => {
    const seed = new Uint8Array(64).fill(42)
    const key1 = await deriveEncryptionKey(seed)
    const key2 = await deriveEncryptionKey(seed)
    const raw1 = await crypto.subtle.exportKey("raw", key1)
    const raw2 = await crypto.subtle.exportKey("raw", key2)
    expect(new Uint8Array(raw1)).toEqual(new Uint8Array(raw2))
  })

  it("derives different keys from different seeds", async () => {
    const seed1 = new Uint8Array(64).fill(1)
    const seed2 = new Uint8Array(64).fill(2)
    const key1 = await deriveEncryptionKey(seed1)
    const key2 = await deriveEncryptionKey(seed2)
    const raw1 = await crypto.subtle.exportKey("raw", key1)
    const raw2 = await crypto.subtle.exportKey("raw", key2)
    expect(new Uint8Array(raw1)).not.toEqual(new Uint8Array(raw2))
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
