"use client"

const NAV_LINKS = [
  { label: "Why Offline", href: "#features" },
  { label: "Security", href: "#specs" },
  { label: "How it works", href: "#how" },
  { label: "FAQ", href: "#faq" },
]

export function Navbar() {
  return (
    <header
      className="relative w-full"
      style={{
        zIndex: 10,
        background: "transparent",
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
              color: "#0f0f0f",
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
                color: "var(--ink-40)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-40)")}
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
          Get your vault
        </a>
      </div>
    </header>
  )
}
