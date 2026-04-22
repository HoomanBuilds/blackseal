import { describe, it, expect } from "vitest"
import { encrypt, decrypt } from "../encryption"
import { deriveEncryptionKey } from "../key-derivation"

describe("encryption", () => {
  async function makeKey() {
    const seed = new Uint8Array(64).fill(42)
    return deriveEncryptionKey(seed)
  }

  it("encrypts and decrypts a string round-trip", async () => {
    const key = await makeKey()
    const plaintext = JSON.stringify({ passwords: [], notes: [] })
    const { ciphertext, iv } = await encrypt(plaintext, key)
    const decrypted = await decrypt(ciphertext, iv, key)
    expect(decrypted).toBe(plaintext)
  })

  it("produces different ciphertext each time (random IV)", async () => {
    const key = await makeKey()
    const plaintext = "same data"
    const result1 = await encrypt(plaintext, key)
    const result2 = await encrypt(plaintext, key)
    expect(result1.ciphertext).not.toBe(result2.ciphertext)
  })

  it("fails to decrypt with wrong key", async () => {
    const key1 = await deriveEncryptionKey(new Uint8Array(64).fill(1))
    const key2 = await deriveEncryptionKey(new Uint8Array(64).fill(2))
    const { ciphertext, iv } = await encrypt("secret", key1)
    await expect(decrypt(ciphertext, iv, key2)).rejects.toThrow()
  })

  it("handles empty string", async () => {
    const key = await makeKey()
    const { ciphertext, iv } = await encrypt("", key)
    const decrypted = await decrypt(ciphertext, iv, key)
    expect(decrypted).toBe("")
  })

  it("handles large payload", async () => {
    const key = await makeKey()
    const large = "x".repeat(100_000)
    const { ciphertext, iv } = await encrypt(large, key)
    const decrypted = await decrypt(ciphertext, iv, key)
    expect(decrypted).toBe(large)
  })
})
