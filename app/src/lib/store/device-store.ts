import { create } from "zustand"

export type ButtonAction = "up" | "down" | "left" | "right" | "confirm"

export type DeviceScreen =
  | "BOOT_SCREEN"
  | "GENERATE_SEED"
  | "VERIFY_SEED"
  | "SET_PIN"
  | "BACKUP_CHOICE"
  | "SETUP_COMPLETE"
  | "PIN_UNLOCK"
  | "MAIN_MENU"
  | "DASHBOARD"
  | "VAULT_MENU"
  | "PASSWORD_LIST"
  | "PASSWORD_ENTRY"
  | "ADD_PASSWORD"
  | "EDIT_PASSWORD"
  | "NOTE_LIST"
  | "NOTE_VIEW"
  | "ADD_NOTE"
  | "EDIT_NOTE"
  | "SAVE_CONFIRM"
  | "DELETE_CONFIRM"
  | "SETTINGS"
  | "CHANGE_PIN"
  | "BACKUP_SETTINGS"
  | "DEVICE_INFO"
  | "WIPE_DEVICE"
  | "WIPE_ANIMATION"

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
  saveConfirmMessage: string | null
  saveConfirmReturnScreen: DeviceScreen | null
  deleteTarget: { kind: "password" | "note"; id: string; label: string } | null
  editingId: string | null

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
  showSaveConfirm: (message: string, returnScreen: DeviceScreen) => void
  clearSaveConfirm: () => void
  setDeleteTarget: (target: { kind: "password" | "note"; id: string; label: string } | null) => void
  setEditingId: (id: string | null) => void
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
  saveConfirmMessage: null as string | null,
  saveConfirmReturnScreen: null as DeviceScreen | null,
  deleteTarget: null as { kind: "password" | "note"; id: string; label: string } | null,
  editingId: null as string | null,
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
  showSaveConfirm: (message, returnScreen) =>
    set({ screen: "SAVE_CONFIRM", saveConfirmMessage: message, saveConfirmReturnScreen: returnScreen }),
  clearSaveConfirm: () => set({ saveConfirmMessage: null, saveConfirmReturnScreen: null }),
  setDeleteTarget: (deleteTarget) => set({ deleteTarget }),
  setEditingId: (editingId) => set({ editingId }),
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
