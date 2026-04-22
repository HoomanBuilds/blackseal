import { SystemProgram, Keypair, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js"
import { AnchorProvider } from "@coral-xyz/anchor"
import { createConnection, createProgram, createProvider, PROGRAM_ID } from "./program"
import { deriveVaultPda } from "./pda"

export interface BackupSnapshot {
  encryptedData: Uint8Array
  version: number
  lastUpdated: number
  dataSize: number
  owner: string
}

export class BlackSealClient {
  constructor(
    private readonly provider: AnchorProvider,
    private readonly program = createProgram(provider)
  ) {}

  static fromKeypair(keypair: Keypair, endpoint?: string): BlackSealClient {
    const connection = createConnection(endpoint)
    return new BlackSealClient(createProvider(connection, keypair))
  }

  get connection(): Connection {
    return this.provider.connection
  }

  get owner() {
    return this.provider.wallet.publicKey
  }

  get vaultAddress() {
    return deriveVaultPda(this.owner, PROGRAM_ID)[0]
  }

  async vaultExists(): Promise<boolean> {
    const info = await this.connection.getAccountInfo(this.vaultAddress)
    return info !== null
  }

  async getBalanceSol(): Promise<number> {
    const lamports = await this.connection.getBalance(this.owner)
    return lamports / LAMPORTS_PER_SOL
  }

  /** Devnet-only airdrop helper. Resolves once confirmed. */
  async requestAirdrop(sol: number = 1): Promise<string> {
    const sig = await this.connection.requestAirdrop(this.owner, sol * LAMPORTS_PER_SOL)
    await this.connection.confirmTransaction(sig, "confirmed")
    return sig
  }

  async initializeVault(): Promise<string> {
    return this.program.methods
      .initializeVault()
      .accountsPartial({
        vault: this.vaultAddress,
        owner: this.owner,
        systemProgram: SystemProgram.programId,
      })
      .rpc()
  }

  async uploadBackup(encryptedData: Uint8Array): Promise<string> {
    return this.program.methods
      .uploadBackup(Buffer.from(encryptedData))
      .accountsPartial({
        vault: this.vaultAddress,
        owner: this.owner,
        systemProgram: SystemProgram.programId,
      })
      .rpc()
  }

  async fetchBackup(): Promise<BackupSnapshot | null> {
    try {
      const account = await this.program.account.vault.fetch(this.vaultAddress)
      return {
        encryptedData: new Uint8Array(account.encryptedData),
        version: account.version,
        lastUpdated: account.lastUpdated.toNumber(),
        dataSize: account.dataSize,
        owner: account.owner.toBase58(),
      }
    } catch {
      return null
    }
  }

  async deleteVault(): Promise<string> {
    return this.program.methods
      .deleteVault()
      .accountsPartial({ vault: this.vaultAddress, owner: this.owner })
      .rpc()
  }
}

/** Build an Explorer URL for a transaction on the given cluster. */
export function explorerTxUrl(signature: string, cluster: "devnet" | "mainnet-beta" = "devnet"): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`
}

/** Build an Explorer URL for an account on the given cluster. */
export function explorerAccountUrl(address: string, cluster: "devnet" | "mainnet-beta" = "devnet"): string {
  return `https://explorer.solana.com/address/${address}?cluster=${cluster}`
}
