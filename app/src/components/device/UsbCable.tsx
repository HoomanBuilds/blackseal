"use client"

import { useConnectionStore } from "@/lib/store/connection-store"
import { useDeviceStore } from "@/lib/store/device-store"

const CABLE_PATH = "M 40 0 C 46 50, 34 150, 40 200"

export function UsbCable() {
  const isConnected = useConnectionStore((s) => s.isConnected)
  const isTransferring = useConnectionStore((s) => s.isTransferring)
  const backupEnabled = useDeviceStore((s) => s.backupEnabled)

  const active = backupEnabled && isConnected

  return (
    <div className="flex flex-col items-center justify-center self-center" style={{ width: 80 }}>
      <svg
        viewBox="0 0 80 200"
        width={80}
        height={200}
        className="overflow-visible"
      >
        <defs>
          {/* Braided sheath pattern */}
          <pattern id="braid" x={0} y={0} width={4} height={6} patternUnits="userSpaceOnUse">
            <line x1={0} y1={0} x2={4} y2={6} stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
            <line x1={4} y1={0} x2={0} y2={6} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
          </pattern>

          {/* Connector metal gradient */}
          <linearGradient id="connector" x1={0} y1={0} x2={0} y2={1}>
            <stop offset="0%" stopColor="#3a3a3e" />
            <stop offset="50%" stopColor="#2a2a2e" />
            <stop offset="100%" stopColor="#1a1a1e" />
          </linearGradient>
        </defs>

        {/* Cable shadow on surface */}
        <path d={CABLE_PATH} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth={7} strokeLinecap="round" />

        {/* Cable body */}
        <path d={CABLE_PATH} fill="none" stroke={active ? "#1e1e22" : "#151518"} strokeWidth={4.5} strokeLinecap="round" />

        {/* Braided texture overlay */}
        <path d={CABLE_PATH} fill="none" stroke="url(#braid)" strokeWidth={4} strokeLinecap="round" />

        {/* Cable edge highlight (top light catch) */}
        <path d={CABLE_PATH} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeLinecap="round" strokeDasharray="6 4" />

        {/* Data flow glow — only when transferring */}
        {isTransferring && (
          <>
            <path
              d={CABLE_PATH}
              fill="none"
              stroke="var(--console-accent, #ff9a3c)"
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.5}
              className="animate-[cable-pulse_1.5s_ease-in-out_infinite]"
            />
            <circle r={3} fill="var(--console-accent, #ff9a3c)" opacity={0.9}>
              <animateMotion dur="1.2s" repeatCount="indefinite" path={CABLE_PATH} />
            </circle>
            <circle r={2.5} fill="var(--console-accent, #ff9a3c)" opacity={0.5}>
              <animateMotion dur="1.2s" repeatCount="indefinite" begin="0.3s" path={CABLE_PATH} />
            </circle>
            <circle r={3} fill="var(--console-accent, #ff9a3c)" opacity={0.9}>
              <animateMotion dur="1.2s" repeatCount="indefinite" begin="0.6s" path={CABLE_PATH} />
            </circle>
          </>
        )}

        {/* Connected idle glow */}
        {active && !isTransferring && (
          <path
            d={CABLE_PATH}
            fill="none"
            stroke="var(--console-phosphor, #b6ff6a)"
            strokeWidth={1.5}
            strokeLinecap="round"
            opacity={0.12}
            className="animate-[cable-pulse_3s_ease-in-out_infinite]"
          />
        )}

        {/* USB-C connector — device side (top) */}
        <g>
          <rect x={32} y={0} width={16} height={7} rx={2} fill="url(#connector)" />
          <rect x={32} y={0} width={16} height={1} rx={0.5} fill="rgba(255,255,255,0.06)" />
          <rect x={36} y={2.5} width={8} height={2} rx={0.5} fill="#0a0a0c" />
        </g>

        {/* USB-C connector — companion side (bottom) */}
        <g>
          <rect x={32} y={193} width={16} height={7} rx={2} fill="url(#connector)" />
          <rect x={32} y={199} width={16} height={1} rx={0.5} fill="rgba(0,0,0,0.3)" />
          <rect x={36} y={195.5} width={8} height={2} rx={0.5} fill="#0a0a0c" />
        </g>

        {/* Strain relief molding — device side */}
        <rect x={36} y={7} width={8} height={4} rx={1} fill="#111113" />
        {/* Strain relief molding — companion side */}
        <rect x={36} y={189} width={8} height={4} rx={1} fill="#111113" />
      </svg>
    </div>
  )
}
