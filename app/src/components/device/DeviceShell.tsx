"use client"

import { useDeviceStore } from "@/lib/store/device-store"
import { useConnectionStore } from "@/lib/store/connection-store"
import { OledScreen } from "./OledScreen"
import { Buttons } from "./Buttons"

interface DeviceShellProps {
  children: React.ReactNode
}

export function DeviceShell({ children }: DeviceShellProps) {
  const isLocked = useDeviceStore((s) => s.isLocked)
  const screen = useDeviceStore((s) => s.screen)
  const isTransferring = useConnectionStore((s) => s.isTransferring)

  const ledClass = isTransferring
    ? "status-led is-transfer"
    : isLocked || screen === "PIN_UNLOCK"
    ? "status-led is-locked"
    : screen === "WIPE_ANIMATION"
    ? "status-led is-danger"
    : "status-led"
  return (
    <div className="device-shell-outer" style={{ perspective: 1200 }}>
      <div
        className="device-body relative"
        style={{
          width: 400,
          maxWidth: "100%",
          borderRadius: 16,
          padding: "28px 28px 20px",
          transform: "rotateX(1.5deg)",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {/* Top edge highlight */}
        <div
          className="absolute top-0 left-4 right-4 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }}
        />

        {/* Screw holes */}
        <div className="screw-hole absolute" style={{ top: 10, left: 10 }} />
        <div className="screw-hole absolute" style={{ top: 10, right: 10 }} />
        <div className="screw-hole absolute" style={{ bottom: 10, left: 10 }} />
        <div className="screw-hole absolute" style={{ bottom: 10, right: 10 }} />

        {/* Status LED */}
        <div className="absolute" style={{ top: 14, left: "50%", transform: "translateX(-50%)" }}>
          <div className={ledClass} />
        </div>

        {/* Screen bezel + OLED */}
        <div
          className="screen-bezel"
          style={{
            borderRadius: 6,
            padding: "10px 12px",
            marginTop: 8,
          }}
        >
          <OledScreen>{children}</OledScreen>
        </div>

        {/* Buttons */}
        <Buttons />

        {/* Device label */}
        <div className="text-center" style={{ marginTop: 12 }}>
          <span className="device-label">Black Seal</span>
        </div>

        {/* USB-C port */}
        <div className="flex justify-center" style={{ marginTop: 10 }}>
          <div className="usb-port" />
        </div>

        {/* Bottom edge shadow */}
        <div
          className="absolute bottom-0 left-6 right-6 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(0,0,0,0.3), transparent)" }}
        />
      </div>
    </div>
  )
}
