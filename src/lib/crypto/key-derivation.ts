const PBKDF2_ITERATIONS = 100_000
const SALT = new TextEncoder().encode("blackseal")

export async function deriveEncryptionKey(seed: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    seed as BufferSource,
    "PBKDF2",
    false,
    ["deriveKey"]
  )

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: SALT,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-512",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  )
}

export async function deriveKeyFromPin(pin: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(pin + salt)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}
