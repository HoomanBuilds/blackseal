import { describe, it, expect, beforeEach } from "vitest"
import { useDeviceStore } from "../device-store"

describe("device-store", () => {
  beforeEach(() => {
    useDeviceStore.setState({
      screen: "BOOT_SCREEN",
      setupComplete: false,
      isLocked: false,
      failedAttempts: 0,
      backupEnabled: false,
      seedPhrase: null,
      encryptionKey: null,
      lastActivity: Date.now(),
      buttonAction: null,
      buttonSeq: 0,
      selectedPasswordId: null,
      selectedNoteId: null,
    })
  })

  it("starts at BOOT_SCREEN", () => {
    expect(useDeviceStore.getState().screen).toBe("BOOT_SCREEN")
  })

  it("transitions to GENERATE_SEED", () => {
    useDeviceStore.getState().setScreen("GENERATE_SEED")
    expect(useDeviceStore.getState().screen).toBe("GENERATE_SEED")
  })

  it("tracks PIN attempts", () => {
    useDeviceStore.getState().incrementFailedAttempts()
    expect(useDeviceStore.getState().failedAttempts).toBe(1)
    useDeviceStore.getState().incrementFailedAttempts()
    expect(useDeviceStore.getState().failedAttempts).toBe(2)
  })

  it("resets failed attempts", () => {
    useDeviceStore.getState().incrementFailedAttempts()
    useDeviceStore.getState().resetFailedAttempts()
    expect(useDeviceStore.getState().failedAttempts).toBe(0)
  })

  it("sets locked state", () => {
    useDeviceStore.getState().setLocked(true)
    expect(useDeviceStore.getState().isLocked).toBe(true)
  })

  it("wipes device state", () => {
    useDeviceStore.getState().setScreen("MAIN_MENU")
    useDeviceStore.getState().setSetupComplete(true)
    useDeviceStore.getState().wipeDevice()
    expect(useDeviceStore.getState().screen).toBe("BOOT_SCREEN")
    expect(useDeviceStore.getState().setupComplete).toBe(false)
    expect(useDeviceStore.getState().failedAttempts).toBe(0)
  })

  it("dispatches button presses with incrementing sequence", () => {
    const s = useDeviceStore.getState()
    expect(s.buttonAction).toBeNull()
    expect(s.buttonSeq).toBe(0)

    useDeviceStore.getState().pressButton("up")
    const s2 = useDeviceStore.getState()
    expect(s2.buttonAction).toBe("up")
    expect(s2.buttonSeq).toBe(1)

    useDeviceStore.getState().pressButton("confirm")
    const s3 = useDeviceStore.getState()
    expect(s3.buttonAction).toBe("confirm")
    expect(s3.buttonSeq).toBe(2)
  })

  it("resets button state on wipe", () => {
    useDeviceStore.getState().pressButton("down")
    useDeviceStore.getState().wipeDevice()
    const s = useDeviceStore.getState()
    expect(s.buttonAction).toBeNull()
    expect(s.buttonSeq).toBe(0)
  })
})
