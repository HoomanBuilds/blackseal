import { describe, it, expect, beforeEach } from "vitest"
import { saveVault, loadVault, clearPersistedVault } from "../vault-persistence"
import { deriveEncryptionKey } from "../key-derivation"
import type { Vault } from "@/lib/store/vault-store"

function makeVault(): Vault {
  return {
    passwords: [
      { id: "p1", label: "gmail", password: "hunter2", createdAt: 1 },
    ],
    notes: [
      { id: "n1", title: "seed", body: "top secret", isLegacy: false, createdAt: 2 },
    ],
    metadata: { version: 1, lastModified: 3, backupEnabled: true },
  }
}

describe("vault-persistence", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("round-trips a vault through encrypt/decrypt and localStorage", async () => {
    const seed = new Uint8Array(64).fill(7)
    const key = await deriveEncryptionKey(seed)
    const vault = makeVault()

    await saveVault(vault, key)
    const loaded = await loadVault(key)
    expect(loaded).toEqual(vault)
  })

  it("returns null when no vault is persisted", async () => {
    const seed = new Uint8Array(64).fill(7)
    const key = await deriveEncryptionKey(seed)
    expect(await loadVault(key)).toBeNull()
  })

  it("returns null when decryption fails (wrong key)", async () => {
    const seedA = new Uint8Array(64).fill(7)
    const seedB = new Uint8Array(64).fill(8)
    const keyA = await deriveEncryptionKey(seedA)
    const keyB = await deriveEncryptionKey(seedB)

    await saveVault(makeVault(), keyA)
    expect(await loadVault(keyB)).toBeNull()
  })

  it("clears persisted vault from localStorage", async () => {
    const seed = new Uint8Array(64).fill(7)
    const key = await deriveEncryptionKey(seed)
    await saveVault(makeVault(), key)
    clearPersistedVault()
    expect(await loadVault(key)).toBeNull()
  })

  it("persists encrypted - ciphertext is not plaintext JSON", async () => {
    const seed = new Uint8Array(64).fill(7)
    const key = await deriveEncryptionKey(seed)
    await saveVault(makeVault(), key)
    const stored = localStorage.getItem("bs_vault")
    expect(stored).toBeTruthy()
    expect(stored).not.toContain("hunter2")
    expect(stored).not.toContain("top secret")
    expect(stored).not.toContain("gmail")
  })
})
