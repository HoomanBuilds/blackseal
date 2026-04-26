import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Simulator — Black Seal",
  description: "Interactive hardware vault simulator with real cryptography.",
  robots: { index: false, follow: false },
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return children
}
