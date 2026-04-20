import { create } from "zustand"

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

  setScreen: (screen: DeviceScreen) => void
  setSetupComplete: (complete: boolean) => void
  setLocked: (locked: boolean) => void
  incrementFailedAttempts: () => void
  resetFailedAttempts: () => void
  setBackupEnabled: (enabled: boolean) => void
  setSeedPhrase: (phrase: string | null) => void
  setEncryptionKey: (key: CryptoKey | null) => void
  touchActivity: () => void
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
}

export const useDeviceStore = create<DeviceState>()((set) => ({
  ...initialState,

  setScreen: (screen) => set({ screen }),
  setSetupComplete: (setupComplete) => set({ setupComplete }),
  setLocked: (isLocked) => set({ isLocked }),
  incrementFailedAttempts: () =>
    set((state) => ({ failedAttempts: state.failedAttempts + 1 })),
  resetFailedAttempts: () => set({ failedAttempts: 0 }),
  setBackupEnabled: (backupEnabled) => set({ backupEnabled }),
  setSeedPhrase: (seedPhrase) => set({ seedPhrase }),
  setEncryptionKey: (encryptionKey) => set({ encryptionKey }),
  touchActivity: () => set({ lastActivity: Date.now() }),
  wipeDevice: () => set({ ...initialState, lastActivity: Date.now() }),
}))
