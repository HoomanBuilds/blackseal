import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { BlackSeal } from "../target/types/black_seal"
import { PublicKey, SystemProgram, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { expect } from "chai"

const VAULT_SEED = Buffer.from("black_seal_vault")

describe("black_seal", () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.BlackSeal as Program<BlackSeal>
  const owner = provider.wallet.publicKey

  const vaultPda = (userKey: PublicKey): [PublicKey, number] =>
    PublicKey.findProgramAddressSync([VAULT_SEED, userKey.toBuffer()], program.programId)

  it("initializes a vault PDA owned by the signer", async () => {
    const [vault] = vaultPda(owner)

    await program.methods
      .initializeVault()
      .accounts({
        vault,
        owner,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    const account = await program.account.vault.fetch(vault)
    expect(account.owner.toBase58()).to.equal(owner.toBase58())
    expect(account.version).to.equal(0)
    expect(account.dataSize).to.equal(0)
    expect(account.encryptedData.length).to.equal(0)
  })

  it("uploads an encrypted blob and bumps version", async () => {
    const [vault] = vaultPda(owner)
    const blob = Buffer.from("vault-ciphertext-v1")

    await program.methods
      .uploadBackup(blob)
      .accounts({
        vault,
        owner,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    const account = await program.account.vault.fetch(vault)
    expect(Buffer.from(account.encryptedData).toString()).to.equal("vault-ciphertext-v1")
    expect(account.version).to.equal(1)
    expect(account.dataSize).to.equal(blob.length)
    expect(account.lastUpdated.toNumber()).to.be.greaterThan(0)
  })

  it("fetches the stored encrypted blob", async () => {
    const [vault] = vaultPda(owner)
    const data = await program.methods
      .fetchBackup()
      .accounts({ vault, owner })
      .view()

    expect(Buffer.from(data).toString()).to.equal("vault-ciphertext-v1")
  })

  it("rejects an oversized blob", async () => {
    const [vault] = vaultPda(owner)
    const oversized = Buffer.alloc(8 * 1024 + 1, 1)

    let threw = false
    try {
      await program.methods
        .uploadBackup(oversized)
        .accounts({ vault, owner, systemProgram: SystemProgram.programId })
        .rpc()
    } catch (err: any) {
      threw = true
      // Either client-side serialization rejects it (realloc cap),
      // or the program's BlobTooLarge guard fires on-chain.
      expect(err.toString()).to.match(/BlobTooLarge|exceeds|overruns|RangeError/i)
    }
    expect(threw, "expected oversized blob to be rejected").to.equal(true)
  })

  it("rejects a stranger trying to upload to someone else's vault", async () => {
    const stranger = Keypair.generate()
    const sig = await provider.connection.requestAirdrop(stranger.publicKey, LAMPORTS_PER_SOL)
    await provider.connection.confirmTransaction(sig, "confirmed")

    const [vault] = vaultPda(owner)

    let threw = false
    try {
      await program.methods
        .uploadBackup(Buffer.from("evil"))
        .accounts({ vault, owner: stranger.publicKey, systemProgram: SystemProgram.programId })
        .signers([stranger])
        .rpc()
    } catch (err: any) {
      threw = true
    }
    expect(threw, "expected unauthorized upload to fail").to.equal(true)
  })

  it("closes the vault and refunds rent on delete", async () => {
    const [vault] = vaultPda(owner)

    await program.methods
      .deleteVault()
      .accounts({ vault, owner })
      .rpc()

    const info = await provider.connection.getAccountInfo(vault)
    expect(info).to.equal(null)
  })

  it("allows a fresh vault after deletion with version reset to 0", async () => {
    const [vault] = vaultPda(owner)

    await program.methods
      .initializeVault()
      .accounts({ vault, owner, systemProgram: SystemProgram.programId })
      .rpc()

    const account = await program.account.vault.fetch(vault)
    expect(account.version).to.equal(0)
    expect(account.dataSize).to.equal(0)
  })
})
