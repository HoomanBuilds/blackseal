import { create } from "zustand"

export interface PasswordEntry {
  id: string
  label: string
  username: string
  password: string
  createdAt: number
  backedUp: boolean
}

export interface NoteEntry {
  id: string
  title: string
  body: string
  isLegacy: boolean
  createdAt: number
  backedUp: boolean
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
  initVault: (backupEnabled: boolean) => void
  addPassword: (entry: PasswordEntry) => void
  updatePassword: (id: string, patch: Partial<Omit<PasswordEntry, "id" | "createdAt">>) => void
  deletePassword: (id: string) => void
  addNote: (entry: NoteEntry) => void
  updateNote: (id: string, patch: Partial<Omit<NoteEntry, "id" | "createdAt">>) => void
  deleteNote: (id: string) => void
  markAllBackedUp: () => void
  clearVault: () => void
}

export const useVaultStore = create<VaultState>()((set) => ({
  vault: null,

  setVault: (vault) => set({ vault }),

  initVault: (backupEnabled) =>
    set({
      vault: {
        passwords: [],
        notes: [],
        metadata: {
          version: 1,
          lastModified: Date.now(),
          backupEnabled,
        },
      },
    }),

  addPassword: (entry) =>
    set((state) => {
      if (!state.vault) return state
      return {
        vault: {
          ...state.vault,
          passwords: [...state.vault.passwords, { ...entry, backedUp: false }],
          metadata: {
            ...state.vault.metadata,
            lastModified: Date.now(),
            version: state.vault.metadata.version + 1,
          },
        },
      }
    }),

  updatePassword: (id, patch) =>
    set((state) => {
      if (!state.vault) return state
      const passwords = state.vault.passwords.map((p) =>
        p.id === id ? { ...p, ...patch, backedUp: false } : p
      )
      return {
        vault: {
          ...state.vault,
          passwords,
          metadata: {
            ...state.vault.metadata,
            version: state.vault.metadata.version + 1,
            lastModified: Date.now(),
          },
        },
      }
    }),

  deletePassword: (id) =>
    set((state) => {
      if (!state.vault) return state
      return {
        vault: {
          ...state.vault,
          passwords: state.vault.passwords.filter((p) => p.id !== id),
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
          notes: [...state.vault.notes, { ...entry, backedUp: false }],
          metadata: {
            ...state.vault.metadata,
            lastModified: Date.now(),
            version: state.vault.metadata.version + 1,
          },
        },
      }
    }),

  updateNote: (id, patch) =>
    set((state) => {
      if (!state.vault) return state
      const notes = state.vault.notes.map((n) =>
        n.id === id ? { ...n, ...patch, backedUp: false } : n
      )
      return {
        vault: {
          ...state.vault,
          notes,
          metadata: {
            ...state.vault.metadata,
            version: state.vault.metadata.version + 1,
            lastModified: Date.now(),
          },
        },
      }
    }),

  deleteNote: (id) =>
    set((state) => {
      if (!state.vault) return state
      return {
        vault: {
          ...state.vault,
          notes: state.vault.notes.filter((n) => n.id !== id),
          metadata: {
            ...state.vault.metadata,
            lastModified: Date.now(),
            version: state.vault.metadata.version + 1,
          },
        },
      }
    }),

  markAllBackedUp: () =>
    set((state) => {
      if (!state.vault) return state
      return {
        vault: {
          ...state.vault,
          passwords: state.vault.passwords.map((p) => ({ ...p, backedUp: true })),
          notes: state.vault.notes.map((n) => ({ ...n, backedUp: true })),
        },
      }
    }),

  clearVault: () => set({ vault: null }),
}))
