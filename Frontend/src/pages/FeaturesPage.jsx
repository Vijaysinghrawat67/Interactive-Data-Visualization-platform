import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import Image from "next/image";

const features = [
  {
    title: "Smart Data Management",
    description:
      "Upload CSV, JSON, or connect to external APIs with ease. Our auto-schema detection simplifies setup and links your data to visualizations instantly.",
    image: "/images/data-management.png",
  },
  {
    title: "Intuitive Visualization Builder",
    description:
      "Build beautiful charts with drag-and-drop simplicity. Bar, pie, line, scatter — everything configurable with a few clicks.",
    image: "/images/visualization-builder.png",
  },
  {
    title: "Export & Share Effortlessly",
    description:
      "Export charts to PDF, PNG, CSV, or JSON. Generate secure links to share insights with teams and stakeholders.",
    image: "/images/export-sharing.png",
  },
  {
    title: "Real-Time Collaboration",
    description:
      "Invite your team, assign roles, and work on live dashboards together. Changes sync instantly for seamless teamwork.",
    image: "/images/collaboration.png",
  },
  {
    title: "Live Dashboards & Monitoring",
    description:
      "Powered by WebSockets for live updates. Monitor KPIs and trends in real time without refreshing the page.",
    image: "/images/realtime-updates.png",
  },
  {
    title: "AI-Driven Insights",
    description:
      "Leverage built-in AI to suggest chart types, extract insights, and summarize complex data automatically.",
    image: "/images/ai-insights.png",
  },
  {
    title: "Modern UI with Dark Mode",
    description:
      "Designed with accessibility in mind — light and dark themes, mobile optimization, and a clean interface for focused workflows.",
    image: "/images/responsive-ui.png",
  },
];

const FeaturesPage = () => {
  return (
    <div className="bg-background text-foreground py-16 px-4 sm:px-8 lg:px-20">
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
      </motion.div>

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
              <h2 className="text-2xl font-semibold">{feature.title}</h2>
              <p className="text-muted-foreground text-base">{feature.description}</p>
            </div>

            {/* Image Section */}
            <div className="w-full lg:w-1/2">
              <Card className="overflow-hidden shadow-md dark:shadow-lg rounded-2xl">
                <CardContent className="p-0">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={700}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="mt-20 text-center">
        <Button size="lg" className="px-8 py-4 text-lg rounded-full">
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default FeaturesPage;
