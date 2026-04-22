import { PublicKey } from "@solana/web3.js"

export const VAULT_SEED = Buffer.from("black_seal_vault")

export function deriveVaultPda(owner: PublicKey, programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([VAULT_SEED, owner.toBuffer()], programId)
}
