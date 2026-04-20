import { create } from "zustand"

export interface PasswordEntry {
  id: string
  label: string
  password: string
  createdAt: number
}

export interface NoteEntry {
  id: string
  title: string
  body: string
  isLegacy: boolean
  createdAt: number
}

export interface Vault {
  passwords: PasswordEntry[]
  notes: NoteEntry[]
  metadata: {
    version: number
    lastModified: number
    backupEnabled: boolean
  }
}

interface VaultState {
  vault: Vault | null
  setVault: (vault: Vault) => void
  addPassword: (entry: PasswordEntry) => void
  addNote: (entry: NoteEntry) => void
  clearVault: () => void
}

export const useVaultStore = create<VaultState>()((set) => ({
  vault: null,

  setVault: (vault) => set({ vault }),

  addPassword: (entry) =>
    set((state) => {
      if (!state.vault) return state
      return {
        vault: {
          ...state.vault,
          passwords: [...state.vault.passwords, entry],
          metadata: {
            ...state.vault.metadata,
            lastModified: Date.now(),
            version: state.vault.metadata.version + 1,
          },
        },
      }
    }),

  addNote: (entry) =>
    set((state) => {
      if (!state.vault) return state
      return {
        vault: {
          ...state.vault,
          notes: [...state.vault.notes, entry],
          metadata: {
            ...state.vault.metadata,
            lastModified: Date.now(),
            version: state.vault.metadata.version + 1,
          },
        },
      }
    }),

  clearVault: () => set({ vault: null }),
}))
