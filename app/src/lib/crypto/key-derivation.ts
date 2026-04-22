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
    false,
    ["encrypt", "decrypt"]
  )
}

export async function deriveKeyFromPin(pin: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(pin)
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    data as BufferSource,
    "PBKDF2",
    false,
    ["deriveBits"]
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode("blackseal:pin_verify:" + salt),
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-512",
    },
    keyMaterial,
    256
  )
  return Array.from(new Uint8Array(bits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

const PIN_WRAP_SALT = new TextEncoder().encode("blackseal:pin_wrap")

export async function derivePinWrappingKey(pin: string): Promise<CryptoKey> {
  const data = new TextEncoder().encode(pin)
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    data as BufferSource,
    "PBKDF2",
    false,
    ["deriveKey"]
  )
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: PIN_WRAP_SALT,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-512",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  )
}
