import { Code2, Share2, BarChart3, Users } from "lucide-react";

const features = [
  {
    icon: <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    title: "Data Visualization",
    description: "Create stunning charts, graphs, and dashboards without any code.",
  },
  {
    icon: <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    title: "Real-time Collaboration",
    description: "Work with teammates and share insights instantly in real-time.",
  },
  {
    icon: <Share2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    title: "Secure Sharing",
    description: "Share visualizations securely with custom access controls.",
  },
  {
    icon: <Code2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    title: "Developer Friendly",
    description: "Export JSON or integrate visualizations into your own apps.",
  },
];

export default function Features() {
  return (
    <section className="bg-white dark:bg-gray-900 py-16 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Powerful Features
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
          Everything you need to analyze, collaborate, and present data beautifully.
        </p>

        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
