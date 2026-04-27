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

const BADGES = ["AES-256-GCM", "BIP-39", "Solana Devnet"]

export function TryItSection() {
  return (
    <section
      className="relative overflow-hidden landing-bg-dots-dark landing-bg-orbs"
      style={{ background: "var(--bg-dark)" }}
    >
      <div
        className="landing-container relative text-center"
        style={{ zIndex: 2, paddingTop: 120, paddingBottom: 120 }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center justify-center gap-2.5"
            style={{
              fontFamily: "var(--l-body)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.6)",
              marginBottom: 24,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 24,
                height: 1,
                background: "var(--accent)",
              }}
            />
            Get Started
          </motion.div>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mx-auto"
            style={{
              fontFamily: "var(--l-display)",
              fontSize: "clamp(44px, 7.5vw, 88px)",
              fontWeight: 500,
              fontStyle: "italic",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              maxWidth: 960,
            }}
          >
            Try it{" "}
            <span style={{ color: "var(--accent)" }}>yourself</span>.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto"
            style={{
              fontFamily: "var(--l-body)",
              fontSize: "clamp(16px, 1.4vw, 19px)",
              lineHeight: 1.55,
              color: "rgba(255, 255, 255, 0.65)",
              maxWidth: 620,
              marginTop: 24,
            }}
          >
            A full hardware-vault simulation in your browser. Real BIP-39
            seeds, real AES-256-GCM encryption, real Solana devnet backups,
            no install, no signup, no tracking.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex flex-wrap justify-center gap-3"
            style={{ marginTop: 40 }}
          >
            <a href="/app" className="landing-btn-primary">
              Launch Simulator
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-btn-secondary-dark"
            >
              View on GitHub
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={4}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
            style={{ marginTop: 56 }}
          >
            {BADGES.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-2"
                style={{
                  fontFamily: "var(--l-body)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "rgba(255, 255, 255, 0.55)",
                  letterSpacing: "0.02em",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "var(--accent)",
                  }}
                />
                {badge}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
