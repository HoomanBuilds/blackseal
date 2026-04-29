"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

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

interface Feature {
  icon: ReactNode
  title: string
  desc: string
}

const ICON_PROPS = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

const FEATURES: Feature[] = [
  {
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    title: "Passwords",
    desc: "Store credentials for banking, social, crypto, and work. All locked behind one 8 digit PIN, encrypted with AES 256 GCM on the device itself.",
  },
  {
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="13" y2="17" />
      </svg>
    ),
    title: "Documents",
    desc: "Keep sensitive documents, account numbers, and important records in an encrypted vault that never connects to the internet.",
  },
  {
    icon: (
      <svg {...ICON_PROPS}>
        <line x1="17" y1="10" x2="3" y2="10" />
        <line x1="21" y1="6" x2="3" y2="6" />
        <line x1="21" y1="14" x2="3" y2="14" />
        <line x1="17" y1="18" x2="3" y2="18" />
      </svg>
    ),
    title: "Private Notes",
    desc: "Free form encrypted notes for recovery instructions, personal messages, and anything meant for your eyes only.",
  },
  {
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    title: "IDs & Records",
    desc: "Store passport numbers, insurance details, and identification records offline where they cannot be breached remotely.",
  },
  {
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Wills & Legacy",
    desc: "Digital legacy instructions for your family. Recovery phrases, account access, and final messages sealed until needed.",
  },
]

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="landing-section relative overflow-hidden landing-bg-dots"
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
            Secure What Matters
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
            A vault for{" "}
            <span style={{ color: "var(--accent)" }}>everything</span> that
            matters.
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
            Passwords, secret notes, recovery instructions for your family —
            all kept offline, encrypted, and entirely under your control.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-16">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i + 3}
                variants={fadeUp}
                className="landing-card"
                style={{ padding: "2.25rem" }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: "rgba(255, 65, 76, 0.08)",
                    border: "1px solid rgba(255, 65, 76, 0.18)",
                    color: "var(--accent)",
                    marginBottom: 22,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--l-display)",
                    fontSize: 22,
                    fontWeight: 600,
                    color: "var(--ink)",
                    letterSpacing: "-0.015em",
                    lineHeight: 1.25,
                    marginBottom: 10,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--l-body)",
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: "var(--ink-60)",
                  }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
