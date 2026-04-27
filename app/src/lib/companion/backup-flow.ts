import { encrypt, decrypt } from "@/lib/crypto/encryption"
import { mnemonicToSeed } from "@/lib/crypto/bip39"
import { deriveKeypairFromSeed } from "@/lib/crypto/solana-keypair"
import { deriveEncryptionKey } from "@/lib/crypto/key-derivation"
import { BlackSealClient } from "@/lib/solana/transactions"
import { DEVNET_RPC } from "@/lib/solana/program"
import type { Vault } from "@/lib/store/vault-store"

export interface BackupResult {
  signature: string
  version: number
  initSignature?: string
}

export interface RestoreResult {
  vault: Vault
  version: number
  lastUpdated: number
}

async function clientFromSeed(seedPhrase: string): Promise<BlackSealClient> {
  const seed = await mnemonicToSeed(seedPhrase)
  const keypair = deriveKeypairFromSeed(seed)
  return BlackSealClient.fromKeypair(keypair, DEVNET_RPC)
}

/** Encrypt the vault with the device key and upload to the Solana PDA.  */
export async function runBackup(
  vault: Vault,
  encryptionKey: CryptoKey,
  seedPhrase: string
): Promise<BackupResult> {
  const client = await clientFromSeed(seedPhrase)

  // AES-GCM ciphertext + IV are packed as JSON so restore can recover both.
  const { ciphertext, iv } = await encrypt(JSON.stringify(vault), encryptionKey)
  const blob = new TextEncoder().encode(JSON.stringify({ ciphertext, iv }))

  let initSignature: string | undefined
  if (!(await client.vaultExists())) {
    initSignature = await client.initializeVault()
  }

  const signature = await client.uploadBackup(blob)
  const snapshot = await client.fetchBackup()

  return {
    signature,
    version: snapshot?.version ?? 0,
    initSignature,
  }
}

/** Fetch the PDA blob and decrypt it back into a vault using the device key. */
export async function runRestore(
  encryptionKey: CryptoKey,
  seedPhrase: string
): Promise<RestoreResult | null> {
  const client = await clientFromSeed(seedPhrase)
  const snapshot = await client.fetchBackup()
  if (!snapshot) return null

  const json = new TextDecoder().decode(snapshot.encryptedData)
  const { ciphertext, iv } = JSON.parse(json) as {
    ciphertext: string
    iv: string
  }
  const plaintext = await decrypt(ciphertext, iv, encryptionKey)
  const vault = JSON.parse(plaintext) as Vault

  const normalized: Vault = {
    ...vault,
    passwords: vault.passwords.map((p) => ({
      ...p,
      username: p.username ?? "",
      backedUp: true,
    })),
    notes: vault.notes.map((n) => ({
      ...n,
      backedUp: true,
    })),
  }

  return {
    vault: normalized,
    version: snapshot.version,
    lastUpdated: snapshot.lastUpdated,
  }
}

export interface SeedRestoreResult {
  vault: Vault
  encryptionKey: CryptoKey
  publicKey: string
  version: number
  lastUpdated: number
}

/**
 * Given a raw seed phrase, derive the encryption key and keypair, fetch the
 * on-chain backup, and decrypt it. Used during first-time setup when the user
 * is recovering a device from their seed.
 */
export async function restoreFromSeed(
  seedPhrase: string
): Promise<SeedRestoreResult | null> {
  const seed = await mnemonicToSeed(seedPhrase)
  const keypair = deriveKeypairFromSeed(seed)
  const encryptionKey = await deriveEncryptionKey(seed)

  const client = BlackSealClient.fromKeypair(keypair, DEVNET_RPC)
  const snapshot = await client.fetchBackup()
  if (!snapshot) return null

  const json = new TextDecoder().decode(snapshot.encryptedData)
  const { ciphertext, iv } = JSON.parse(json) as {
    ciphertext: string
    iv: string
  }
  const plaintext = await decrypt(ciphertext, iv, encryptionKey)
  const vault = JSON.parse(plaintext) as Vault

  const normalized: Vault = {
    ...vault,
    passwords: vault.passwords.map((p) => ({
      ...p,
      username: p.username ?? "",
      backedUp: true,
    })),
    notes: vault.notes.map((n) => ({
      ...n,
      backedUp: true,
    })),
  }

  return {
    vault: normalized,
    encryptionKey,
    publicKey: keypair.publicKey.toBase58(),
    version: snapshot.version,
    lastUpdated: snapshot.lastUpdated,
  }
}
