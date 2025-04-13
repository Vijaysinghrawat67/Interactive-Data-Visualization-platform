import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Rocket } from "lucide-react"
import CTAimage from "@/assets/CTAimage.jpg";

export default function CallToAction() {
  return (
    <section className="relative bg-slate-900 text-white py-24 px-6">
      {/* Top wave transition */}
      <div className="absolute -top-1 left-0 right-0">
        <svg viewBox="0 0 1440 100" className="w-full rotate-180">
          <path fill="#f1f5f9" d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10"
      >
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            🚀 Start your data journey today
          </h2>
          <p className="mb-6 text-slate-300">
            Create, share, and collaborate on stunning visualizations in seconds. No setup. No complexity.
          </p>
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            <Rocket className="mr-2 h-5 w-5" /> Launch Now
          </Button>
        </div>

        {/* Image Placeholder */}
        <div className="w-full md:w-1/2">
          <img
            src={CTAimage}
            alt="Dashboard Preview"
            className="rounded-xl shadow-lg border border-slate-700"
          />
        </div>
      </motion.div>
    </section>
  )
}
