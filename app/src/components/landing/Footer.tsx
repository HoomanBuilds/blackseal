"use client"

const PRODUCT_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how" },
  { label: "Specs", href: "#specs" },
  { label: "Simulator", href: "/app" },
]

const RESOURCES_LINKS = [
  { label: "GitHub", href: "https://github.com", external: true },
  { label: "Documentation", href: "#", external: false },
  { label: "Whitepaper", href: "#", external: false },
  { label: "Hackathon", href: "https://www.colosseum.org", external: true },
]

const COMPANY_LINKS = [
  { label: "About", href: "#", external: false },
  { label: "Privacy", href: "#", external: false },
  { label: "Security", href: "#", external: false },
  { label: "Contact", href: "mailto:hello@blackseal.dev", external: false },
]

function LinkColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string; external?: boolean }[]
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--l-body)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--ink-40)",
          marginBottom: 18,
        }}
      >
        {title}
      </div>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              style={{
                fontFamily: "var(--l-body)",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--ink-80)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-80)")}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-1)",
        borderTop: "1px solid #DDDDDD",
      }}
    >
      <div
        className="landing-container"
        style={{ paddingTop: 80, paddingBottom: 40 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand block */}
          <div className="col-span-2 md:col-span-4">
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
              <span
                aria-hidden
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: "var(--ink)",
                  color: "#FCFCFC",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "var(--l-display)",
                  letterSpacing: "-0.04em",
                }}
              >
                B
              </span>
              Black Seal
            </div>
            <p
              style={{
                fontFamily: "var(--l-body)",
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--ink-60)",
                marginTop: 18,
                maxWidth: 320,
              }}
            >
              An offline hardware vault for every password, secret note, and
              piece of your digital life.
            </p>
            <div className="flex items-center gap-3" style={{ marginTop: 22 }}>
              {[
                {
                  name: "GitHub",
                  href: "https://github.com",
                  path: (
                    <path
                      d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.05c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.38s1.95.13 2.86.38c2.18-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.05.78 2.12v3.14c0 .31.21.67.8.55C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z"
                      fill="currentColor"
                    />
                  ),
                },
                {
                  name: "X",
                  href: "https://x.com",
                  path: (
                    <path
                      d="M18.244 2H21.5l-7.5 8.57L22.5 22h-6.84l-5.36-7-6.13 7H1L9 12.83 1.5 2h7l4.84 6.4L18.244 2zm-1.2 18h1.85L7.05 4H5.1l11.94 16z"
                      fill="currentColor"
                    />
                  ),
                },
                {
                  name: "Discord",
                  href: "https://discord.com",
                  path: (
                    <path
                      d="M19.27 5.33A18.6 18.6 0 0014.79 4l-.2.4a16.8 16.8 0 014.55 1.43c-2.08-1.13-4.36-1.7-6.64-1.7s-4.56.57-6.64 1.7A16.8 16.8 0 0110.41 4.4L10.21 4a18.6 18.6 0 00-4.48 1.33C2.97 9.49 2.27 13.55 2.65 17.55a16.8 16.8 0 005.13 2.6l.41-.57a11 11 0 01-1.78-.86l.18-.14c4.36 2.04 9.06 2.04 13.42 0l.18.14a11 11 0 01-1.78.86l.41.57a16.8 16.8 0 005.13-2.6c.5-4.65-.85-8.66-3.68-12.22zM8.84 15.36c-1.06 0-1.93-.96-1.93-2.14s.86-2.14 1.93-2.14c1.06 0 1.93.96 1.93 2.14 0 1.18-.86 2.14-1.93 2.14zm6.32 0c-1.06 0-1.93-.96-1.93-2.14s.86-2.14 1.93-2.14c1.06 0 1.93.96 1.93 2.14 0 1.18-.86 2.14-1.93 2.14z"
                      fill="currentColor"
                    />
                  ),
                },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: "1px solid #DDDDDD",
                    background: "#FFFFFF",
                    color: "var(--ink-60)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--accent)"
                    e.currentTarget.style.borderColor = "var(--accent)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--ink-60)"
                    e.currentTarget.style.borderColor = "#DDDDDD"
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    {s.path}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-6">
            <LinkColumn title="Product" links={PRODUCT_LINKS} />
          </div>
          <div className="md:col-span-2">
            <LinkColumn title="Resources" links={RESOURCES_LINKS} />
          </div>
          <div className="md:col-span-2">
            <LinkColumn title="Company" links={COMPANY_LINKS} />
          </div>
        </div>

        <div
          style={{
            height: 1,
            background: "#DDDDDD",
            marginTop: 60,
            marginBottom: 28,
          }}
        />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
