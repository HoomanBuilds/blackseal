"use client"

import Image from "next/image"

const GITHUB_URL = "https://github.com/HoomanBuilds/blackseal"

const NAV_LINKS = [
  { label: "Why Offline", href: "#features" },
  { label: "How It Works", href: "#how" },
  { label: "Security", href: "#specs" },
  { label: "Simulator", href: "/app" },
  { label: "GitHub", href: GITHUB_URL, external: true },
]

export function Footer() {
  return (
    <footer
      className="relative"
      style={{
        background: "var(--bg-1)",
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        zIndex: 2,
      }}
    >
      <div
        className="landing-container"
        style={{ paddingTop: "clamp(48px, 6vw, 64px)", paddingBottom: 32 }}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* Brand block */}
          <div style={{ maxWidth: 360 }}>
            <div
              className="flex items-center gap-2.5"
              style={{
                fontFamily: "var(--l-display)",
                fontSize: 18,
                fontWeight: 600,
                color: "var(--ink)",
                letterSpacing: "-0.02em",
              }}
            >
              <Image
                src="/blackseal-logo.png"
                alt="Black Seal"
                width={30}
                height={30}
                style={{ display: "block", width: 30, height: 30, objectFit: "contain" }}
              />
              Black Seal
            </div>
            <p
              style={{
                fontFamily: "var(--l-body)",
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--ink-60)",
                marginTop: 16,
              }}
            >
              An offline hardware vault for every password, secret note, and
              piece of your digital life.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-3 md:justify-end md:items-center">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                style={{
                  fontFamily: "var(--l-body)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--ink-60)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-60)")}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div
          style={{
            height: 1,
            background: "rgba(255, 255, 255, 0.06)",
            marginTop: 40,
            marginBottom: 22,
          }}
        />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div
            style={{
              fontFamily: "var(--l-body)",
              fontSize: 13,
              color: "var(--ink-40)",
            }}
          >
            © 2026 Black Seal. Built for the Colosseum Frontier Hackathon.
          </div>
          <div
            className="inline-flex items-center gap-2"
            style={{
              fontFamily: "var(--l-mono)",
              fontSize: 12,
              color: "var(--ink-40)",
              letterSpacing: "0.05em",
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
            Devnet · v0.1.0
          </div>
        </div>
      </div>
    </footer>
  )
}
