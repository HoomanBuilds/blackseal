"use client"

import { useDeviceStore } from "@/lib/store/device-store"
import { BootScreen } from "./BootScreen"
import { GenerateSeed } from "./GenerateSeed"
import { VerifySeed } from "./VerifySeed"
import { SetPin } from "./SetPin"
import { PinUnlock } from "./PinUnlock"
import { BackupChoice } from "./BackupChoice"
import { MainMenu } from "./MainMenu"
import { PasswordList } from "./PasswordList"
import { PasswordEntry } from "./PasswordEntry"
import { AddPassword } from "./AddPassword"
import { NoteList } from "./NoteList"
import { NoteView } from "./NoteView"
import { AddNote } from "./AddNote"

export function ScreenRouter() {
  const screen = useDeviceStore((s) => s.screen)

  switch (screen) {
    case "BOOT_SCREEN":
      return <BootScreen />
    case "GENERATE_SEED":
      return <GenerateSeed />
    case "VERIFY_SEED":
      return <VerifySeed />
    case "SET_PIN":
      return <SetPin />
    case "PIN_UNLOCK":
      return <PinUnlock />
    case "BACKUP_CHOICE":
      return <BackupChoice />
    case "MAIN_MENU":
      return <MainMenu />
    case "PASSWORD_LIST":
      return <PasswordList />
    case "PASSWORD_ENTRY":
      return <PasswordEntry />
    case "ADD_PASSWORD":
      return <AddPassword />
    case "NOTE_LIST":
      return <NoteList />
    case "NOTE_VIEW":
      return <NoteView />
    case "ADD_NOTE":
      return <AddNote />
    default:
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div style={{ fontSize: 11 }}>{screen}</div>
          <div className="oled-text-dim" style={{ fontSize: 10, marginTop: 4 }}>
            Not implemented
          </div>
        </div>
      )
  }
}
