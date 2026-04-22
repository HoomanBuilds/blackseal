import { encrypt, decrypt } from "./encryption"
import type { Vault } from "@/lib/store/vault-store"

const VAULT_KEY = "bs_vault"
const IV_KEY = "bs_vault_iv"

export async function saveVault(vault: Vault, key: CryptoKey): Promise<void> {
  const json = JSON.stringify(vault)
  const { ciphertext, iv } = await encrypt(json, key)
  localStorage.setItem(VAULT_KEY, ciphertext)
  localStorage.setItem(IV_KEY, iv)
}

export async function loadVault(key: CryptoKey): Promise<Vault | null> {
  const ciphertext = localStorage.getItem(VAULT_KEY)
  const iv = localStorage.getItem(IV_KEY)
  if (!ciphertext || !iv) return null
  try {
    const json = await decrypt(ciphertext, iv, key)
    return JSON.parse(json) as Vault
  } catch {
    return null
  }
}

export function clearPersistedVault(): void {
  localStorage.removeItem(VAULT_KEY)
  localStorage.removeItem(IV_KEY)
}
