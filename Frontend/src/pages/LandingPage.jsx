
import Hero from "@/components/landing/Hero"

import Features from "@/components/landing/Features"
import CallToAction from "@/components/landing/CallToAction"

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
