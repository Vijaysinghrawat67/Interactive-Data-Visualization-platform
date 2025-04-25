import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaCloudDownloadAlt, FaChartBar, FaUsers, FaRobot, FaPaintBrush } from "react-icons/fa";
import HeroImage from "@/assets/HeroImage.jpg";

const features = [
  {
    title: "Smart Data Management",
    description:
      "Upload CSV, JSON, or connect to external APIs with ease. Our auto-schema detection simplifies setup and links your data to visualizations instantly.",
    icon: <FaChartBar className="text-3xl text-indigo-500" />,
    image: HeroImage,
  },
  {
    title: "Intuitive Visualization Builder",
    description:
      "Build beautiful charts with drag-and-drop simplicity. Bar, pie, line, scatter — everything configurable with a few clicks.",
    icon: <FaPaintBrush className="text-3xl text-indigo-500" />,
    image: HeroImage,
  },
  {
    title: "Export & Share Effortlessly",
    description:
      "Export charts to PDF, PNG, CSV, or JSON. Generate secure links to share insights with teams and stakeholders.",
    icon: <FaCloudDownloadAlt className="text-3xl text-indigo-500" />,
    image: HeroImage,
  },
  {
    title: "Real-Time Collaboration",
    description:
      "Invite your team, assign roles, and work on live dashboards together. Changes sync instantly for seamless teamwork.",
    icon: <FaUsers className="text-3xl text-indigo-500" />,
    image: HeroImage,
  },
  {
    title: "Live Dashboards & Monitoring",
    description:
      "Powered by WebSockets for live updates. Monitor KPIs and trends in real time without refreshing the page.",
    icon: <FaChartBar className="text-3xl text-indigo-500" />,
    image: HeroImage,
  },
  {
    title: "AI-Driven Insights",
    description:
      "Leverage built-in AI to suggest chart types, extract insights, and summarize complex data automatically.",
    icon: <FaRobot className="text-3xl text-indigo-500" />,
    image: HeroImage,
  },
  {
    title: "Modern UI with Dark Mode",
    description:
      "Designed with accessibility in mind — light and dark themes, mobile optimization, and a clean interface for focused workflows.",
    icon: <FaPaintBrush className="text-3xl text-indigo-500" />,
    image: HeroImage,
  },
];

const FeaturesPage = () => {
  return (
    <div className="bg-background text-foreground py-16 px-4 sm:px-8 lg:px-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Explore the Core Features
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Built for teams, analysts, and storytellers — turn raw data into interactive, real-time visual stories.
        </p>
        <div className="mt-6 flex justify-center gap-6 text-muted-foreground text-sm">
          <div className="flex items-center gap-2"><FaChartBar /> Interactive Charts</div>
          <div className="flex items-center gap-2"><FaUsers /> Team Collaboration</div>
          <div className="flex items-center gap-2"><FaCloudDownloadAlt /> Export Easily</div>
        </div>
      </motion.div>

      {/* Features List */}
      <div className="space-y-24">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className={`flex flex-col-reverse lg:flex-row items-center gap-10 ${
              idx % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Text Section */}
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="flex items-center gap-3">
                {feature.icon}
                <h2 className="text-2xl font-semibold">{feature.title}</h2>
              </div>
              <p className="text-muted-foreground text-base">{feature.description}</p>
            </div>

            {/* Image Section */}
            <div className="w-full lg:w-1/2">
              <Card className="overflow-hidden transition duration-300 hover:shadow-2xl hover:scale-[1.02] rounded-xl bg-white dark:bg-gray-900">
                <CardContent className="p-0">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-64 object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                  />
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-24 text-center">
        <Button size="lg" className="px-8 py-4 text-lg rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white transition duration-300 transform hover:scale-105">
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default FeaturesPage;
