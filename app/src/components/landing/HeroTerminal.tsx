"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import Image from "next/image"

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

const ICON_PROPS = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

const BADGES = [
  {
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    label: "Air-gapped\nby design",
  },
  {
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    label: "No cloud.\nNo sync.",
  },
  {
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="8" cy="15" r="4" />
        <path d="M10.85 12.15L20 3" />
        <path d="M17 6l3 3" />
        <path d="M14 9l3 3" />
      </svg>
    ),
    label: "Encrypted\nlocally",
  },
  {
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="6" y="6" width="12" height="12" rx="1.5" />
        <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" />
        <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
      </svg>
    ),
    label: "Physical\nconfirmation",
  },
]

export function HeroSection() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 150)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      className="relative w-full"
      style={{
        background: "transparent",
        paddingTop: 100,
        paddingBottom: 0,
        minHeight: "100vh",
        zIndex: 2,
        overflow: "visible",
      }}
    >
      <motion.div
        initial="hidden"
        animate={ready ? "visible" : "hidden"}
        variants={stagger}
        className="relative flex flex-col lg:flex-row items-center lg:items-center"
        style={{ zIndex: 2 }}
      >
        {/* Left — Text (contained) */}
        <div
          className="w-full lg:w-1/2 shrink-0"
          style={{ paddingLeft: "max(24px, calc((100vw - 1440px) / 2 + 48px))", paddingRight: 24 }}
        >
          {/* Eyebrow pill */}
          <motion.div
            custom={0}
            variants={fadeUp}
            className="inline-flex items-center gap-2"
            style={{
              padding: "6px 14px",
              borderRadius: 100,
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              fontFamily: "var(--l-body)",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--ink-60)",
              marginBottom: 32,
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

          {/* Title */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            style={{
              fontFamily: "var(--l-display)",
              fontWeight: 700,
              fontSize: "clamp(40px, 6vw, 72px)",
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              color: "var(--ink)",
            }}
          >
            Own your
            <br />
            digital life.
            <br />
            <span style={{ color: "var(--accent)" }}>Not the cloud.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={2}
            variants={fadeUp}
            style={{
              fontFamily: "var(--l-body)",
              fontSize: "clamp(16px, 1.4vw, 19px)",
              lineHeight: 1.55,
              color: "var(--ink-60)",
              maxWidth: 500,
              marginTop: 24,
            }}
          >
            A hardware vault for your passwords, documents, private notes, and
            final instructions — air-gapped and fully in your control.
          </motion.p>

          {/* Badges */}
          <motion.div
            custom={3}
            variants={fadeUp}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            style={{ marginTop: 36, maxWidth: 500 }}
          >
            {BADGES.map((b) => (
              <div key={b.label} className="flex flex-col items-start text-left gap-2">
                <div style={{ color: "var(--ink-60)" }}>{b.icon}</div>
                <div
                  style={{
                    fontFamily: "var(--l-body)",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--ink-60)",
                    lineHeight: 1.35,
                    whiteSpace: "pre-line",
                  }}
                >
                  {b.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA pair */}
          <motion.div
            custom={4}
            variants={fadeUp}
            className="flex flex-wrap items-center gap-3"
            style={{ marginTop: 40 }}
          >
            <a href="/app" className="landing-btn-primary">
              Get your vault
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a href="#how" className="landing-btn-secondary">
              See how it works
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </motion.div>

          {/* Bottom tagline */}
          <motion.div
            custom={5}
            variants={fadeUp}
            className="flex items-center gap-2"
            style={{
              marginTop: 32,
              fontFamily: "var(--l-body)",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--ink-40)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            No accounts. No servers. No compromises.
          </motion.div>
        </div>

        {/* Right — Device on rock, extends to right viewport edge */}
        <motion.div
          custom={2}
          variants={fadeUp}
          className="w-full lg:w-1/2 relative"
          style={{ marginBottom: -420, overflow: "visible" }}
        >
          <div className="landing-rock-stage">
            <div className="landing-rock-stage__device">
              <Image
                src="/device.png"
                alt="Black Seal hardware vault"
                width={1536}
                height={1024}
                priority
              />
            </div>
            <div className="landing-rock-stage__rock">
              <Image
                src="/rock.png"
                alt=""
                width={1536}
                height={1024}
                aria-hidden
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
