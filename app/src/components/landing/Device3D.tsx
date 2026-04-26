"use client"

import { useRef, useMemo } from "react"
import { Group, CanvasTexture, SRGBColorSpace } from "three"
import { RoundedBox } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

interface Device3DProps {
  rotation?: [number, number, number]
  position?: [number, number, number]
  screenText?: string
}

const SCREEN_GREEN = "#00ff41"
const BODY_COLOR = "#55555e"
const BTN_COLOR = "#6a6a75"
const CONFIRM_COLOR = "#72727e"
const SCREW_COLOR = "#38383f"
const USB_COLOR = "#44444c"
const BEZEL_COLOR = "#1a1a1e"
const CENTER_NUB = "#4a4a52"

const W = 4
const H = 5.8
const D = 0.45

const SCREEN_W = 3.36
const SCREEN_H = 1.68
const BEZEL_PAD = 0.12
const SCREEN_Y = 1.45

function useScreenTexture(text: string, subtitle: string) {
  return useMemo(() => {
    const w = 256
    const h = 128
    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")!

    ctx.fillStyle = "#010201"
    ctx.fillRect(0, 0, w, h)

    const spaced = text.split("").join(" ")
    ctx.fillStyle = SCREEN_GREEN
    ctx.font = `500 24px system-ui, -apple-system, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(spaced, w / 2, h * 0.4)

    const subSpaced = subtitle.split("").join(" ")
    ctx.fillStyle = SCREEN_GREEN
    ctx.globalAlpha = 0.45
    ctx.font = `500 12px system-ui, -apple-system, sans-serif`
    ctx.fillText(subSpaced, w / 2, h * 0.72)
    ctx.globalAlpha = 1

    const tex = new CanvasTexture(canvas)
    tex.colorSpace = SRGBColorSpace
    return tex
  }, [text, subtitle])
}

function useLabelTexture(text: string) {
  return useMemo(() => {
    const w = 256
    const h = 64
    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")!

    ctx.clearRect(0, 0, w, h)

    const spaced = text.split("").join(" ")
    ctx.fillStyle = "#909098"
    ctx.font = `500 24px system-ui, -apple-system, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(spaced, w / 2, h / 2)

    const tex = new CanvasTexture(canvas)
    tex.colorSpace = SRGBColorSpace
    return tex
  }, [text])
}

function useButtonTexture(text: string) {
  return useMemo(() => {
    const w = 128
    const h = 64
    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")!

    ctx.clearRect(0, 0, w, h)

    ctx.fillStyle = "#c0c0c8"
    ctx.font = `600 26px system-ui, -apple-system, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(text, w / 2, h / 2)

    const tex = new CanvasTexture(canvas)
    tex.colorSpace = SRGBColorSpace
    return tex
  }, [text])
}

function OledScreen({ screenText }: { screenText: string }) {
  const screenTex = useScreenTexture(screenText, "HARDWARE VAULT")

  return (
    <group position={[0, SCREEN_Y, D / 2 + 0.01]}>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[SCREEN_W + BEZEL_PAD * 2, SCREEN_H + BEZEL_PAD * 2, 0.06]} />
        <meshStandardMaterial color={BEZEL_COLOR} roughness={0.85} metalness={0.2} />
      </mesh>

      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        <meshBasicMaterial map={screenTex} />
      </mesh>
    </group>
  )
}

function ScreenGlow() {
  return (
    <mesh position={[0, SCREEN_Y, D / 2 - 0.01]}>
      <planeGeometry args={[SCREEN_W + 0.6, SCREEN_H + 0.6]} />
      <meshBasicMaterial
        color={SCREEN_GREEN}
        transparent
        opacity={0.04}
      />
    </mesh>
  )
}

const BTN_SIZE = 0.34
const BTN_GAP = 0.03
const BTN_DEPTH = 0.08
const DPAD_Y = -0.45

function DPadButton({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[BTN_SIZE, BTN_SIZE, BTN_DEPTH]} />
        <meshPhysicalMaterial
          color={BTN_COLOR}
          roughness={0.35}
          metalness={0.4}
          clearcoat={0.4}
          clearcoatRoughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0, -BTN_DEPTH / 2 - 0.015]}>
        <boxGeometry args={[BTN_SIZE, BTN_SIZE, 0.03]} />
        <meshStandardMaterial color="#2a2a30" roughness={0.7} metalness={0.3} />
      </mesh>
    </group>
  )
}

function ConfirmButton({ position }: { position: [number, number, number] }) {
  const okTex = useButtonTexture("OK")

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.56, BTN_SIZE, BTN_DEPTH]} />
        <meshPhysicalMaterial
          color={CONFIRM_COLOR}
          roughness={0.3}
          metalness={0.45}
          clearcoat={0.5}
          clearcoatRoughness={0.25}
        />
      </mesh>
      <mesh position={[0, 0, -BTN_DEPTH / 2 - 0.015]}>
        <boxGeometry args={[0.56, BTN_SIZE, 0.03]} />
        <meshStandardMaterial color="#2a2a30" roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0, BTN_DEPTH / 2 + 0.001]}>
        <planeGeometry args={[0.4, 0.2]} />
        <meshBasicMaterial map={okTex} transparent />
      </mesh>
    </group>
  )
}

function CenterNub() {
  return (
    <mesh position={[0, DPAD_Y, D / 2 + 0.01]}>
      <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
      <meshStandardMaterial color={CENTER_NUB} roughness={0.5} metalness={0.4} />
    </mesh>
  )
}

function ButtonCluster() {
  const step = BTN_SIZE + BTN_GAP
  const z = D / 2 + BTN_DEPTH / 2

  return (
    <group>
      <DPadButton position={[0, DPAD_Y + step, z]} />
      <DPadButton position={[0, DPAD_Y - step, z]} />
      <DPadButton position={[-step, DPAD_Y, z]} />
      <DPadButton position={[step, DPAD_Y, z]} />
      <CenterNub />
      <ConfirmButton position={[0, DPAD_Y - step * 2 - 0.08, z]} />
    </group>
  )
}

const SCREW_R = 0.04
const SCREW_INSET = 0.3

function ScrewHole({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[SCREW_R, SCREW_R, 0.02, 16]} />
        <meshStandardMaterial color={SCREW_COLOR} roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 7]} position={[0, 0, 0.01]}>
        <cylinderGeometry args={[SCREW_R * 0.4, SCREW_R * 0.4, 0.02, 8]} />
        <meshStandardMaterial color="#151518" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  )
}

function ScrewHoles() {
  const hx = W / 2 - SCREW_INSET
  const hy = H / 2 - SCREW_INSET
  const z = D / 2 + 0.01

  return (
    <group>
      <ScrewHole position={[-hx, hy, z]} />
      <ScrewHole position={[hx, hy, z]} />
      <ScrewHole position={[-hx, -hy, z]} />
      <ScrewHole position={[hx, -hy, z]} />
    </group>
  )
}

function StatusLED() {
  const ledRef = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (!ledRef.current) return
    const t = clock.getElapsedTime()
    const pulse = 0.5 + 0.5 * Math.sin(t * 2)
    const mat = (ledRef.current.children[0] as any)?.material
    if (mat) mat.emissiveIntensity = pulse
  })

  return (
    <group ref={ledRef} position={[0, H / 2 - 0.3, D / 2 + 0.01]}>
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color={SCREEN_GREEN}
          emissive={SCREEN_GREEN}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={SCREEN_GREEN} transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

function UsbCPort() {
  return (
    <group position={[0, -H / 2 + 0.05, 0]}>
      <mesh>
        <boxGeometry args={[0.28, 0.12, D * 0.6]} />
        <meshStandardMaterial color={USB_COLOR} roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, D * 0.15]}>
        <boxGeometry args={[0.2, 0.06, D * 0.3]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  )
}

function DeviceLabel() {
  const labelTex = useLabelTexture("BLACK SEAL")

  return (
    <mesh position={[0, DPAD_Y - (BTN_SIZE + BTN_GAP) * 2 - 0.5, D / 2 + 0.01]}>
      <planeGeometry args={[1.2, 0.25]} />
      <meshBasicMaterial map={labelTex} transparent />
    </mesh>
  )
}

function TopEdgeHighlight() {
  return (
    <mesh position={[0, H / 2, D / 2]}>
      <boxGeometry args={[W - 0.6, 0.015, 0.03]} />
      <meshBasicMaterial color="white" transparent opacity={0.08} />
    </mesh>
  )
}

export function Device3D({
  rotation,
  position,
  screenText = "BLACK SEAL",
}: Device3DProps) {
  const groupRef = useRef<Group>(null)

  return (
    <group ref={groupRef} rotation={rotation} position={position}>
      <RoundedBox args={[W, H, D]} radius={0.16} smoothness={4}>
        <meshPhysicalMaterial
          color={BODY_COLOR}
          roughness={0.4}
          metalness={0.5}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
          reflectivity={0.4}
        />
      </RoundedBox>

      <RoundedBox
        args={[W - 0.15, H - 0.15, 0.04]}
        radius={0.12}
        smoothness={2}
        position={[0, 0, -D / 2 - 0.01]}
      >
        <meshStandardMaterial color="#303035" roughness={0.6} metalness={0.4} />
      </RoundedBox>

      <OledScreen screenText={screenText} />
      <ScreenGlow />
      <ButtonCluster />
      <ScrewHoles />
      <StatusLED />
      <UsbCPort />
      <DeviceLabel />
      <TopEdgeHighlight />
    </group>
  )
}
