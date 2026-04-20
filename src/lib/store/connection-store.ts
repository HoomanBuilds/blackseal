import { create } from "zustand"

interface TransactionRecord {
  signature: string
  type: "backup" | "restore" | "init" | "delete"
  timestamp: number
}

interface ConnectionState {
  isConnected: boolean
  isTransferring: boolean
  lastBackupTime: number | null
  backupVersion: number
  solanaBalance: number | null
  publicKeyBase58: string | null
  transactions: TransactionRecord[]

  setConnected: (connected: boolean) => void
  setTransferring: (transferring: boolean) => void
  setLastBackup: (time: number, version: number) => void
  setSolanaBalance: (balance: number) => void
  setPublicKey: (key: string | null) => void
  addTransaction: (tx: TransactionRecord) => void
  reset: () => void
}

export const useConnectionStore = create<ConnectionState>()((set) => ({
  isConnected: false,
  isTransferring: false,
  lastBackupTime: null,
  backupVersion: 0,
  solanaBalance: null,
  publicKeyBase58: null,
  transactions: [],

  setConnected: (isConnected) => set({ isConnected }),
  setTransferring: (isTransferring) => set({ isTransferring }),
  setLastBackup: (lastBackupTime, backupVersion) =>
    set({ lastBackupTime, backupVersion }),
  setSolanaBalance: (solanaBalance) => set({ solanaBalance }),
  setPublicKey: (publicKeyBase58) => set({ publicKeyBase58 }),
  addTransaction: (tx) =>
    set((state) => ({ transactions: [tx, ...state.transactions] })),
  reset: () =>
    set({
      isConnected: false,
      isTransferring: false,
      lastBackupTime: null,
      backupVersion: 0,
      solanaBalance: null,
      publicKeyBase58: null,
      transactions: [],
    }),
}))
