"use client"

import React, { Suspense, useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Device3D } from "./Device3D"
import * as THREE from "three"

function RotatingDevice({ screenText, active }: { screenText?: string; active: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const speedRef = useRef(0)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const target = active ? 0.12 : 0
    speedRef.current += (target - speedRef.current) * Math.min(delta * 2.5, 1)
    groupRef.current.rotation.y += delta * speedRef.current
  })

  return (
    <group ref={groupRef}>
      <Device3D rotation={[0.15, 0, 0]} screenText={screenText} />
    </group>
  )
}

function DeviceFallback() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        width: 140,
        height: 210,
        borderRadius: 8,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }} />
    </div>
  )
}

class Canvas3DErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return <DeviceFallback />
    return this.props.children
  }
}

export function DeviceScene({ screenText, className }: { screenText?: string; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setActive(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.35 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={wrapRef}
      className={`device-canvas-container ${className || ""}`}
      style={{ width: "100%", height: "100%" }}
    >
      <Canvas3DErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 5, 8]} intensity={2.5} color="#ffffff" />
          <directionalLight position={[-4, 3, 6]} intensity={1.0} color="#aaffbb" />
          <directionalLight position={[0, -2, 6]} intensity={0.8} color="#ffffff" />
          <pointLight position={[0, 2, 8]} intensity={1.5} color="#00ff41" distance={20} />
          <pointLight position={[-5, 0, 4]} intensity={0.6} color="#ffffff" distance={15} />
          <pointLight position={[5, 0, 4]} intensity={0.6} color="#ffffff" distance={15} />

          <Suspense fallback={null}>
            <RotatingDevice screenText={screenText} active={active} />
          </Suspense>
        </Canvas>
      </Canvas3DErrorBoundary>
    </div>
  )
}
