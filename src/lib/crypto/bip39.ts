import { generateMnemonic, validateMnemonic, mnemonicToSeedSync } from "@scure/bip39"
import { wordlist } from "@scure/bip39/wordlists/english.js"

export function generateSeedPhrase(): string {
  return generateMnemonic(wordlist, 256)
}

export function validateSeedPhrase(phrase: string): boolean {
  return validateMnemonic(phrase, wordlist)
}

export async function mnemonicToSeed(phrase: string): Promise<Uint8Array> {
  return mnemonicToSeedSync(phrase)
}
