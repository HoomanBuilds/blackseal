"use client"

import { useEffect } from "react"
import { useDeviceStore } from "@/lib/store/device-store"
import { useConnectionStore } from "@/lib/store/connection-store"
import { mnemonicToSeed } from "@/lib/crypto/bip39"
import { deriveKeypairFromSeed } from "@/lib/crypto/solana-keypair"
import { BlackSealClient } from "@/lib/solana/transactions"
import { DEVNET_RPC } from "@/lib/solana/program"

/**
 * Derives the Solana keypair from the unlocked seed, publishes the public key
 * and balance into the connection store, and marks the uplink as live whenever
 * the device is unlocked with backup enabled.
 */
export function useCompanionConnection() {
  const seedPhrase = useDeviceStore((s) => s.seedPhrase)
  const backupEnabled = useDeviceStore((s) => s.backupEnabled)
  const isLocked = useDeviceStore((s) => s.isLocked)

  const setConnected = useConnectionStore((s) => s.setConnected)
  const setPublicKey = useConnectionStore((s) => s.setPublicKey)
  const setSolanaBalance = useConnectionStore((s) => s.setSolanaBalance)

  useEffect(() => {
    let cancelled = false

    async function connect() {
      if (!seedPhrase || !backupEnabled || isLocked) {
        setConnected(false)
        setPublicKey(null)
        return
      }

      try {
        const seed = await mnemonicToSeed(seedPhrase)
        const keypair = deriveKeypairFromSeed(seed)
        const client = BlackSealClient.fromKeypair(keypair, DEVNET_RPC)
        if (cancelled) return

        setPublicKey(keypair.publicKey.toBase58())
        setConnected(true)

        let balance = await client.getBalanceSol()
        if (balance < 0.05) {
          try {
            await client.requestAirdrop(1)
            balance = await client.getBalanceSol()
          } catch {
            // devnet airdrops are rate-limited; fall through with current balance
          }
        }
        if (!cancelled) setSolanaBalance(balance)
      } catch {
        if (!cancelled) setConnected(false)
      }
    }

    void connect()
    return () => {
      cancelled = true
    }
  }, [seedPhrase, backupEnabled, isLocked, setConnected, setPublicKey, setSolanaBalance])
}
