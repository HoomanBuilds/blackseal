import { AnchorProvider, Program, Wallet, Idl } from "@coral-xyz/anchor"
import { Connection, Keypair, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js"
import idl from "./idl/black_seal.json"
import type { BlackSeal } from "./idl/black_seal"

export const PROGRAM_ID = new PublicKey(idl.address)

export const DEVNET_RPC =
  process.env.NEXT_PUBLIC_SOLANA_RPC ?? "https://api.devnet.solana.com"

export function createConnection(endpoint: string = DEVNET_RPC): Connection {
  return new Connection(endpoint, "confirmed")
}

// Lightweight Wallet implementation around a raw Keypair, compatible with AnchorProvider.
export class KeypairWallet implements Wallet {
  constructor(readonly payer: Keypair) {}

  get publicKey(): PublicKey {
    return this.payer.publicKey
  }

  async signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
    if (tx instanceof VersionedTransaction) {
      tx.sign([this.payer])
    } else {
      tx.partialSign(this.payer)
    }
    return tx
  }

  async signAllTransactions<T extends Transaction | VersionedTransaction>(
    txs: T[]
  ): Promise<T[]> {
    return Promise.all(txs.map((tx) => this.signTransaction(tx)))
  }
}

export function createProvider(
  connection: Connection,
  keypair: Keypair
): AnchorProvider {
  return new AnchorProvider(connection, new KeypairWallet(keypair), {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  })
}

export function createProgram(provider: AnchorProvider): Program<BlackSeal> {
  return new Program(idl as Idl, provider) as unknown as Program<BlackSeal>
}
