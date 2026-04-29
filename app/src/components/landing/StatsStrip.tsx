"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "motion/react"

type Stat = {
  numeric: number
  display: string
  prefix?: string
  suffix?: string
  label: string
}

const STATS: Stat[] = [
  { numeric: 256, display: "256", suffix: " bit", label: "AES GCM Encryption" },
  { numeric: 24, display: "24", suffix: " words", label: "BIP 39 Seed Phrase" },
  { numeric: 3, display: "3", suffix: " strike", label: "Auto Wipe on Failure" },
  { numeric: 100, display: "100", suffix: "%", label: "Offline by Default" },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: "easeOut" as const },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

function AnimatedNumber({ target, inView }: { target: number; inView: boolean }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setValue(target)
      return
    }
    const duration = 1400
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, inView])

  return <>{value}</>
}

export function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      className="relative"
      style={{
        background: "var(--bg-1)",
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        zIndex: 3,
      }}
    >
      <div
        ref={ref}
        className="landing-container"
        style={{ paddingTop: 72, paddingBottom: 72 }}
      >
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={fadeUp}
              className="text-center lg:text-left"
            >
              <div className="landing-stat-value">
                {s.prefix}
                <AnimatedNumber target={s.numeric} inView={inView} />
                <span style={{ color: "var(--ink-40)", fontWeight: 400 }}>
                  {s.suffix}
                </span>
              </div>
              <div className="landing-stat-label">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
