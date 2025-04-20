import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { motion } from "framer-motion";
import HeroImage from "@/assets/HeroImage.jpg";

export default function Hero() {
  return (
    <section className="relative w-full bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-14 md:py-24 px-4 md:px-8 transition-colors duration-300">
      {/* Background SVG Wave */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-auto opacity-10 text-blue-300 dark:text-blue-900"
          fill="currentColor"
        >
          <path d="M0,160L80,170.7C160,181,320,203,480,197.3C640,192,800,160,960,160C1120,160,1280,192,1360,208L1440,224V0H1360C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0H0Z" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left max-w-2xl"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-snug">
            Visualize Your Data <br className="hidden md:block" /> Like Never Before
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6">
            Create stunning dashboards from your data. Fast, collaborative, and secure — all under one unified platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" className="text-base px-6 py-2.5">
              Get Started <MoveRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="text-base px-6 py-2.5">
              Explore Demo
            </Button>
          </div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-sm"
        >
          <img
            src={HeroImage}
            alt="Data Dashboard Screenshot"
            className="rounded-xl shadow-md w-full object-cover border border-gray-200 dark:border-gray-700"
          />
        </motion.div>
      </div>
    </section>
  );
}
