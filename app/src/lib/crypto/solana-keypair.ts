import { Keypair } from "@solana/web3.js"

export function deriveKeypairFromSeed(seed: Uint8Array): Keypair {
  return Keypair.fromSeed(seed.slice(0, 32))
}
