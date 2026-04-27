"use client"

import { motion } from "motion/react"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: "easeOut" as const },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const STEPS = [
  {
    n: "01",
    label: "First boot, one time",
    primary: "Power on, write down a 24-word BIP-39 phrase, set an 8-digit PIN.",
    secondary: "The seed never leaves the screen. Once recorded, it's only ever stored as a derived key inside the device.",
    visual: "seed",
  },
  {
    n: "02",
    label: "Save what matters",
    primary: "Add passwords, secret notes, and instructions for your family directly on the device.",
    secondary: "Everything is sealed with AES-256-GCM the moment you hit confirm. No keyboard, no clipboard, no leaks.",
    visual: "lock",
  },
  {
    n: "03",
    label: "Unlock to read",
    primary: "Eight-digit PIN unlocks the vault for daily access.",
    secondary: "Three wrong tries wipes the device clean. Two minutes idle and it locks itself again.",
    visual: "device",
  },
  {
    n: "04",
    label: "Backup, only if you want",
    primary: "Optional encrypted backup to a Solana PDA you control.",
    secondary: "Lose the device? Enter your seed on a new one and restore — only you can decrypt it.",
    visual: "chain",
  },
]

function StepVisual({ kind }: { kind: string }) {
  const stroke = "var(--accent)"
  const dim = "rgba(23,23,23,0.35)"
  if (kind === "seed") {
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        {Array.from({ length: 6 }).map((_, i) => (
          <rect
            key={i}
            x={10 + (i % 3) * 35}
            y={20 + Math.floor(i / 3) * 30}
            width={28}
            height={20}
            rx={3}
            stroke={i === 1 || i === 4 ? stroke : dim}
            strokeWidth={1.4}
            fill="none"
          />
        ))}
        <text x="14" y="34" fontFamily="var(--l-mono)" fontSize="9" fill={dim}>01</text>
        <text x="49" y="34" fontFamily="var(--l-mono)" fontSize="9" fill={stroke}>02</text>
        <text x="84" y="34" fontFamily="var(--l-mono)" fontSize="9" fill={dim}>03</text>
        <text x="14" y="64" fontFamily="var(--l-mono)" fontSize="9" fill={dim}>04</text>
        <text x="49" y="64" fontFamily="var(--l-mono)" fontSize="9" fill={stroke}>05</text>
        <text x="84" y="64" fontFamily="var(--l-mono)" fontSize="9" fill={dim}>06</text>
        <line x1="10" y1="86" x2="110" y2="86" stroke={dim} strokeWidth="1" strokeDasharray="2 4" />
        <text x="60" y="104" fontFamily="var(--l-mono)" fontSize="9" fill={dim} textAnchor="middle">+18 more</text>
      </svg>
    )
  }
  if (kind === "lock") {
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <rect x="32" y="50" width="56" height="44" rx="6" stroke={stroke} strokeWidth={1.6} />
        <path d="M44 50V38a16 16 0 0132 0v12" stroke={stroke} strokeWidth={1.6} fill="none" />
        <circle cx="60" cy="68" r="4" fill={stroke} />
        <line x1="60" y1="72" x2="60" y2="82" stroke={stroke} strokeWidth={1.6} />
        <text x="14" y="20" fontFamily="var(--l-mono)" fontSize="8" fill={dim}>AES-256-GCM</text>
        <text x="14" y="112" fontFamily="var(--l-mono)" fontSize="8" fill={dim}>PBKDF2 ×100k</text>
      </svg>
    )
  }
  if (kind === "device") {
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <rect x="38" y="14" width="44" height="92" rx="6" stroke={dim} strokeWidth={1.4} />
        <rect x="44" y="22" width="32" height="40" rx="2" fill="rgba(23,23,23,0.92)" />
        <text x="60" y="38" fontFamily="var(--l-mono)" fontSize="6" fill={stroke} textAnchor="middle">VAULT</text>
        <text x="60" y="50" fontFamily="var(--l-mono)" fontSize="5" fill={stroke} textAnchor="middle">●●●●●●●●</text>
        <circle cx="48" cy="78" r="3" stroke={dim} strokeWidth={1.2} />
        <circle cx="60" cy="78" r="3" stroke={dim} strokeWidth={1.2} />
        <circle cx="72" cy="78" r="3" stroke={dim} strokeWidth={1.2} />
        <circle cx="60" cy="92" r="4" stroke={stroke} strokeWidth={1.4} />
      </svg>
    )
  }
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="30" cy="60" r="14" stroke={stroke} strokeWidth={1.6} />
      <circle cx="60" cy="60" r="14" stroke={dim} strokeWidth={1.4} />
      <circle cx="90" cy="60" r="14" stroke={stroke} strokeWidth={1.6} />
      <line x1="44" y1="60" x2="46" y2="60" stroke={dim} strokeWidth={1.4} />
      <line x1="74" y1="60" x2="76" y2="60" stroke={dim} strokeWidth={1.4} />
      <text x="30" y="92" fontFamily="var(--l-mono)" fontSize="8" fill={dim} textAnchor="middle">device</text>
      <text x="60" y="92" fontFamily="var(--l-mono)" fontSize="8" fill={dim} textAnchor="middle">PDA</text>
      <text x="90" y="92" fontFamily="var(--l-mono)" fontSize="8" fill={dim} textAnchor="middle">restore</text>
    </svg>
  )
}

export function HowItWorksSection() {
  return (
    <section
      id="how"
      className="landing-section relative overflow-hidden landing-bg-ticks"
      style={{ background: "var(--bg-2)" }}
    >
      <div className="landing-container relative" style={{ zIndex: 2 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} custom={0} className="landing-eyebrow">
            How It Works
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
            Set up once. Use it{" "}
            <span style={{ color: "var(--accent)" }}>for life</span>.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-5"
            style={{
              fontFamily: "var(--l-body)",
              fontSize: "clamp(16px, 1.3vw, 19px)",
              lineHeight: 1.6,
              color: "var(--ink-60)",
              maxWidth: 580,
            }}
          >
            Onboarding takes under five minutes. After that, daily use is just
            a PIN and a scroll.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-16">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                custom={i + 3}
                variants={fadeUp}
                className="relative overflow-hidden"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #DDDDDD",
                  borderRadius: 20,
                  padding: "32px 32px 28px",
                  minHeight: 280,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div style={{ flex: 1 }}>
                    <div className="step-number">{step.n}</div>
                    <h4
                      style={{
                        fontFamily: "var(--l-display)",
                        fontSize: 24,
                        fontWeight: 600,
                        color: "var(--ink)",
                        letterSpacing: "-0.015em",
                        lineHeight: 1.2,
                        marginTop: 16,
                      }}
                    >
                      {step.label}
                    </h4>
                  </div>
                  <div style={{ flexShrink: 0, opacity: 0.85 }}>
                    <StepVisual kind={step.visual} />
                  </div>
                </div>

                <p
                  style={{
                    fontFamily: "var(--l-body)",
                    fontSize: 15,
                    lineHeight: 1.55,
                    marginTop: 24,
                  }}
                >
                  <span style={{ color: "var(--ink)" }}>{step.primary}</span>{" "}
                  <span style={{ color: "var(--ink-60)" }}>{step.secondary}</span>
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
