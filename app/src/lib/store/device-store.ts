import { create } from "zustand"

export type ButtonAction = "up" | "down" | "left" | "right" | "confirm"

export type DeviceScreen =
  | "BOOT_SCREEN"
  | "GENERATE_SEED"
  | "VERIFY_SEED"
  | "SET_PIN"
  | "BACKUP_CHOICE"
  | "SETUP_COMPLETE"
  | "MAIN_MENU"
  | "PASSWORD_LIST"
  | "PASSWORD_ENTRY"
  | "ADD_PASSWORD"
  | "NOTE_LIST"
  | "NOTE_VIEW"
  | "ADD_NOTE"
  | "SETTINGS"
  | "CHANGE_PIN"
  | "WIPE_DEVICE"
  | "WIPE_ANIMATION"
  | "PIN_UNLOCK"

interface DeviceState {
  screen: DeviceScreen
  setupComplete: boolean
  isLocked: boolean
  failedAttempts: number
  backupEnabled: boolean
  seedPhrase: string | null
  encryptionKey: CryptoKey | null
  lastActivity: number
  buttonAction: ButtonAction | null
  buttonSeq: number
  selectedPasswordId: string | null
  selectedNoteId: string | null
  pendingRestore: boolean

  setScreen: (screen: DeviceScreen) => void
  setSetupComplete: (complete: boolean) => void
  setLocked: (locked: boolean) => void
  incrementFailedAttempts: () => void
  resetFailedAttempts: () => void
  setBackupEnabled: (enabled: boolean) => void
  setSeedPhrase: (phrase: string | null) => void
  setEncryptionKey: (key: CryptoKey | null) => void
  setSelectedPasswordId: (id: string | null) => void
  setSelectedNoteId: (id: string | null) => void
  setPendingRestore: (pending: boolean) => void
  touchActivity: () => void
  pressButton: (action: ButtonAction) => void
  wipeDevice: () => void
}

const initialState = {
  screen: "BOOT_SCREEN" as DeviceScreen,
  setupComplete: false,
  isLocked: false,
  failedAttempts: 0,
  backupEnabled: false,
  seedPhrase: null as string | null,
  encryptionKey: null as CryptoKey | null,
  lastActivity: Date.now(),
  buttonAction: null as ButtonAction | null,
  buttonSeq: 0,
  selectedPasswordId: null as string | null,
  selectedNoteId: null as string | null,
  pendingRestore: false,
}

export const useDeviceStore = create<DeviceState>()((set) => ({
  ...initialState,

  setScreen: (screen) => set({ screen }),
  setSetupComplete: (setupComplete) => set({ setupComplete }),
  setLocked: (isLocked) => set({ isLocked }),
  incrementFailedAttempts: () =>
    set((state) => {
      const next = state.failedAttempts + 1
      try { localStorage.setItem("bs_failed", String(next)) } catch {}
      return { failedAttempts: next }
    }),
  resetFailedAttempts: () => {
    try { localStorage.removeItem("bs_failed") } catch {}
    set({ failedAttempts: 0 })
  },
  setBackupEnabled: (backupEnabled) => set({ backupEnabled }),
  setSeedPhrase: (seedPhrase) => set({ seedPhrase }),
  setEncryptionKey: (encryptionKey) => set({ encryptionKey }),
  setSelectedPasswordId: (selectedPasswordId) => set({ selectedPasswordId }),
  setSelectedNoteId: (selectedNoteId) => set({ selectedNoteId }),
  setPendingRestore: (pendingRestore) => set({ pendingRestore }),
  touchActivity: () => set({ lastActivity: Date.now() }),
  pressButton: (action) =>
    set((state) => ({
      buttonAction: action,
      buttonSeq: state.buttonSeq + 1,
      lastActivity: Date.now(),
    })),
  wipeDevice: () => {
    try { localStorage.removeItem("bs_failed") } catch {}
    set({ ...initialState, lastActivity: Date.now() })
  },
}))
