"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
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

export function HeroSection() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 150)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      className="relative overflow-hidden landing-bg-hero"
      style={{
        background: "var(--bg-0)",
        paddingTop: 96,
        paddingBottom: 144,
      }}
    >
      <div className="landing-container relative" style={{ zIndex: 2 }}>
        <motion.div
          initial="hidden"
          animate={ready ? "visible" : "hidden"}
          variants={stagger}
          className="text-center"
        >
          {/* Eyebrow pill */}
          <motion.div
            custom={0}
            variants={fadeUp}
            className="inline-flex items-center gap-2"
            style={{
              padding: "6px 14px",
              borderRadius: 100,
              background: "#FFFFFF",
              border: "1px solid #DDDDDD",
              fontFamily: "var(--l-body)",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--ink-60)",
              marginBottom: 32,
              boxShadow: "0 1px 2px rgba(23,23,23,0.04)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent)",
              }}
            />
            Colosseum Frontier Hackathon · Devnet live
          </motion.div>

          {/* Title — Syne italic, mixed case */}
          <h1
            className="mx-auto"
            style={{
              fontFamily: "var(--l-display)",
              fontWeight: 500,
              fontStyle: "italic",
              fontSize: "clamp(44px, 8vw, 96px)",
              lineHeight: 1.0,
              letterSpacing: "-0.035em",
              maxWidth: 1000,
              color: "var(--ink)",
            }}
          >
            <motion.span custom={1} variants={fadeUp} style={{ display: "block" }}>
              Your keys.
            </motion.span>
            <motion.span custom={2} variants={fadeUp} style={{ display: "block" }}>
              Your vault.
            </motion.span>
            <motion.span
              custom={3}
              variants={fadeUp}
              style={{ display: "block", color: "var(--accent)" }}
            >
              Offline.
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            custom={4}
            variants={fadeUp}
            className="mx-auto"
            style={{
              fontFamily: "var(--l-body)",
              fontSize: "clamp(17px, 1.4vw, 20px)",
              lineHeight: 1.55,
              color: "var(--ink-60)",
              maxWidth: 640,
              marginTop: 28,
            }}
          >
            A pocket-sized hardware vault for every password, secret note, and
            piece of your digital legacy. Air-gapped by design. Your data never
            touches the internet.
          </motion.p>

          {/* CTA pair */}
          <motion.div
            custom={5}
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-3"
            style={{ marginTop: 40 }}
          >
            <a href="/app" className="landing-btn-primary">
              Launch Simulator
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a href="#features" className="landing-btn-secondary">
              Learn more
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
