import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { motion } from "framer-motion";
import HeroImage from "@/assets/HeroImage.jpg";

export default function Hero() {
  return (
    <section className="relative w-full bg-gradient-to-br from-[#f5f8ff] to-[#ecf1fd] py-20 md:py-32 px-4 md:px-10">
      {/* Background Wave SVG */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-auto opacity-20 text-blue-200"
          fill="currentColor"
        >
          <path
            d="M0,160L80,170.7C160,181,320,203,480,197.3C640,192,800,160,960,160C1120,160,1280,192,1360,208L1440,224V0H1360C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0H0Z"
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center lg:text-left max-w-xl"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Visualize Your Data <br className="hidden md:block" /> Like Never Before
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Turn your raw numbers into beautiful, shareable dashboards. Secure, collaborative,
            and lightning fast — all in one place.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center lg:justify-start">
            <Button size="lg" className="text-lg px-6 py-3">
              Get Started Free <MoveRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-6 py-3">
              Explore Demo
            </Button>
          </div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-lg lg:max-w-md"
        >
          <img
            src={HeroImage}
            alt="Data Dashboard Screenshot"
            className="rounded-2xl shadow-lg w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
