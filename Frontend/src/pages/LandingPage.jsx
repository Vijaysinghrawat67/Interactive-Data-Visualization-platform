
import Hero from "@/components/layout/landing/Hero"

import Features from "@/components/layout/landing/Features"
import CallToAction from "@/components/layout/landing/CallToAction"

export default function LandingPage() {
  return (
    <>
      
      <main className="flex-1">
        <Hero />
        <Features />
        <CallToAction/>
      </main>
      
    </>
  )
}
