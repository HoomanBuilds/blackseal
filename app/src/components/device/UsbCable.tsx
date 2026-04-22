"use client"

import { useConnectionStore } from "@/lib/store/connection-store"
import { useDeviceStore } from "@/lib/store/device-store"

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
        {/* Cable shadow */}
        <path
          d="M 40 0 C 40 60, 40 140, 40 200"
          fill="none"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth={6}
          strokeLinecap="round"
        />

        {/* Cable body */}
        <path
          d="M 40 0 C 40 60, 40 140, 40 200"
          fill="none"
          stroke={active ? "#1a1a1a" : "#111"}
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Cable sheath highlight */}
        <path
          d="M 40 0 C 40 60, 40 140, 40 200"
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Data flow glow — only when transferring */}
        {isTransferring && (
          <>
            <path
              d="M 40 0 C 40 60, 40 140, 40 200"
              fill="none"
              stroke="var(--console-accent, #ff9a3c)"
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.6}
              className="animate-[cable-pulse_1.5s_ease-in-out_infinite]"
            />
            <circle r={3} fill="var(--console-accent, #ff9a3c)" opacity={0.9}>
              <animateMotion
                dur="1.2s"
                repeatCount="indefinite"
                path="M 40 0 C 40 60, 40 140, 40 200"
              />
            </circle>
            <circle r={3} fill="var(--console-phosphor, #b6ff6a)" opacity={0.7}>
              <animateMotion
                dur="1.2s"
                repeatCount="indefinite"
                begin="0.6s"
                path="M 40 0 C 40 60, 40 140, 40 200"
              />
            </circle>
          </>
        )}

        {/* Connected idle glow */}
        {active && !isTransferring && (
          <path
            d="M 40 0 C 40 60, 40 140, 40 200"
            fill="none"
            stroke="var(--console-phosphor, #b6ff6a)"
            strokeWidth={1}
            strokeLinecap="round"
            opacity={0.15}
          />
        )}

        {/* USB-C connector top (device side) */}
        <rect x={33} y={0} width={14} height={6} rx={2} fill="#2a2a2a" stroke="#333" strokeWidth={0.5} />

        {/* USB-C connector bottom (companion side) */}
        <rect x={33} y={194} width={14} height={6} rx={2} fill="#2a2a2a" stroke="#333" strokeWidth={0.5} />
      </svg>
    </div>
  )
}
