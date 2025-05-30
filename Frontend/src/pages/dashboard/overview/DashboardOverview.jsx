import { useEffect, useState } from "react";
import api from "@/services/axios";
import { Loader, Users, BarChart3, Database, Download } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import VisualizationsOverTimeChart from "./VisualizationsOverTimeChart.jsx";

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/api/v1/dashboard/user-das", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data.data);
        //console.log("Dashboard stats from API:", res.data.data);
      } catch (err) {
        toast.error("Failed to load dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader className="animate-spin text-blue-600 w-6 h-6" />
      </div>
    );
  }

  const isAdmin = stats?.user?.role === "admin" || stats?.user?.role === "super-admin";

  const cards = [
    {
      title: "Datasets",
      value: stats.datasetsCount,
      icon: <Database className="text-purple-500" />,
    },
    {
      title: "Visualizations",
      value: stats.visualizationsCount,
      icon: <BarChart3 className="text-blue-500" />,
    },
    {
      title: "Exports",
      value: stats.exportsCount,
      icon: <Download className="text-green-500" />,
    },
    ...(isAdmin
      ? [
          {
            title: "Total Users",
            value: stats.totalUsers,
            icon: <Users className="text-orange-500" />,
          },
        ]
      : []),
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Welcome back, {stats.user.name} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here's a quick overview of your activity and statistics.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-6 border border-gray-100 dark:border-slate-700 hover:shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {card.title}
              </h4>
              {card.icon}
            </div>
            <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Visualizations Over Time Chart */}
      <VisualizationsOverTimeChart data={stats.visualizationsOverTime} />
    </div>
  );
}
