"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion } from "motion/react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)


const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: "easeOut" as const },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const SPECS = [
  { label: "Encryption", value: "AES 256 GCM" },
  { label: "Key Derivation", value: "PBKDF2 HMAC SHA512" },
  { label: "Iterations", value: "100,000" },
  { label: "Seed Standard", value: "BIP 39, 24 words" },
  { label: "Entropy", value: "256 bits" },
  { label: "PIN Protection", value: "8 digit, 3 strike wipe" },
  { label: "Auto Lock", value: "2 min inactivity" },
  { label: "Key Storage", value: "Never stored \u2014 derived on unlock" },
  { label: "Backup", value: "Solana PDA (optional)" },
  { label: "Keypair", value: "Ed25519" },
]

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

function scramble(target: string, progress: number): string {
  const len = target.length
  const revealed = Math.floor(progress * len)
  let result = ""
  for (let i = 0; i < len; i++) {
    if (i < revealed) {
      result += target[i]
    } else {
      result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
    }
  }
  return result
}

function SpecRow({ label, value, index }: { label: string; value: string; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [displayValue, setDisplayValue] = useState("\u2588".repeat(value.length))
  const [decrypted, setDecrypted] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const decrypt = useCallback(() => {
    if (decrypted) return
    const duration = 600
    const start = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setDisplayValue(scramble(value, progress))
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
        setDecrypted(true)
      }
    }
    requestAnimationFrame(animate)
  }, [value, decrypted])

  useEffect(() => {
    if (!mounted || decrypted) return
    const id = setInterval(() => {
      setDisplayValue(scramble(value, 0))
    }, 80)
    return () => clearInterval(id)
  }, [value, decrypted, mounted])

  useGSAP(() => {
    if (!rowRef.current) return
    ScrollTrigger.create({
      trigger: rowRef.current,
      start: "top 85%",
      onEnter: () => setTimeout(decrypt, index * 80),
      once: true,
    })
  }, { scope: rowRef })

  return (
    <div ref={rowRef} className="group flex items-baseline py-3.5 px-5 hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-300">
      <div
        className="w-32 sm:w-44 lg:w-48 shrink-0 text-sm"
        style={{ fontFamily: "var(--l-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-40)" }}
      >
        {label}
      </div>
      <div
        className="text-[13px]"
        style={{
          fontFamily: "var(--l-mono)",
          color: decrypted ? "var(--ink)" : "var(--ink-24)",
          letterSpacing: "0.02em",
          transition: "color 0.3s",
        }}
      >
        {displayValue}
      </div>
    </div>
  )
}

export function SpecSheet() {
  return (
    <section
      id="specs"
      className="landing-section relative overflow-hidden landing-bg-numeral"
      style={{ background: "var(--bg-3)", zIndex: 2 }}
    >
      <div className="landing-container relative" style={{ zIndex: 2 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} custom={0} className="landing-eyebrow">
            Specifications
          </motion.div>

          <motion.h2
            variants={fadeUp}
            custom={1}
            style={{
              fontFamily: "var(--l-display)",
              fontSize: "clamp(36px, 5.5vw, 64px)",
              fontWeight: 500,
              fontStyle: "italic",
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              color: "var(--ink)",
              maxWidth: 760,
            }}
          >
            Under the <span style={{ color: "var(--accent)" }}>hood</span>.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-5 mb-14"
            style={{
              fontFamily: "var(--l-body)",
              fontSize: "clamp(16px, 1.3vw, 19px)",
              lineHeight: 1.6,
              color: "var(--ink-60)",
              maxWidth: 580,
            }}
          >
            Every cryptographic detail, verified and transparent.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* Spec table — left */}
          <div
            className="overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 16,
              boxShadow: "0 1px 2px rgba(0,0,0,0.20)",
            }}
          >
            {SPECS.map((spec, i) => (
              <div key={i}>
                <SpecRow label={spec.label} value={spec.value} index={i} />
                {i < SPECS.length - 1 && <div className="spec-row-divider mx-5" />}
              </div>
            ))}
          </div>

          {/* Exploded device — right */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="relative w-full flex items-center justify-center min-h-[360px] lg:min-h-0"
          >
            <Image
              src="/exploded_blackseal.png"
              alt="Black Seal exploded view"
              width={800}
              height={800}
              className="w-full h-auto max-w-[380px]"
              style={{ objectFit: "contain", filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.5))" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
