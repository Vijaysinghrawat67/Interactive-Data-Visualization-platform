import Header from "@/components/layout/Header"
import Hero from "@/components/landing/Hero"
import Footer from "@/components/layout/Footer"
import Features from "@/components/landing/Features"
import CallToAction from "@/components/landing/CallToAction"

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <CallToAction/>
      </main>
      <Footer />
    </>
  )
}
