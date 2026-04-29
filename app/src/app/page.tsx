"use client"

import { Navbar } from "@/components/landing/Navbar"
import { HeroSection } from "@/components/landing/HeroTerminal"
import { StatsStrip } from "@/components/landing/StatsStrip"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { HowItWorksSection } from "@/components/landing/HowItWorksSection"
import { SpecSheet } from "@/components/landing/SpecSheet"
import { TryItSection } from "@/components/landing/TryItSection"
import { Footer } from "@/components/landing/Footer"
import { SmoothScroll } from "@/components/landing/SmoothScroll"

export default function LandingPage() {
  return (
    <div className="landing-base">
      <SmoothScroll />
      <div className="landing-studio-bg" aria-hidden />
      <Navbar />
      <HeroSection />
      <StatsStrip />
      <FeaturesSection />
      <HowItWorksSection />
      <SpecSheet />
      <TryItSection />
      <Footer />
    </div>
  )
}
