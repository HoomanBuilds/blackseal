"use client"

import { useEffect, useState } from "react"

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how" },
  { label: "Specs", href: "#specs" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className="sticky top-0 z-30 w-full transition-all"
      style={{
        backdropFilter: scrolled ? "blur(14px)" : "blur(0px)",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "blur(0px)",
        background: scrolled ? "rgba(252, 252, 252, 0.85)" : "rgba(252, 252, 252, 0)",
        borderBottom: scrolled
          ? "1px solid #DDDDDD"
          : "1px solid transparent",
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "14px 24px",
        }}
      >
        <a
          href="/"
          className="flex items-center gap-2.5"
          style={{
            fontFamily: "var(--l-display)",
            fontSize: 18,
            fontWeight: 600,
            color: "var(--ink)",
            letterSpacing: "-0.02em",
            textDecoration: "none",
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 26,
              height: 26,
              borderRadius: 6,
              background: "var(--ink)",
              color: "#FCFCFC",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "var(--l-display)",
              letterSpacing: "-0.04em",
            }}
          >
            B
          </span>
          Black Seal
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: "var(--l-body)",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--ink-60)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-60)")}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="/app"
          className="landing-btn-primary"
          style={{ padding: "0.55rem 1.2rem", fontSize: 14 }}
        >
          Launch Simulator
        </a>
      </div>
    </header>
  )
}
