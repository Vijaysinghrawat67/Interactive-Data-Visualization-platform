import { useEffect, useState } from "react";
import api from "@/services/axios";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export default function DashboardOverview() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem("token");
        const resUser = await api.get("/api/v1/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const resStats = await api.get("/api/v1/dashboard/user-das", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(resUser.data.user);
        setStats(resStats.data);
      } catch (err) {
        toast.error("Failed to load dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader className="animate-spin text-blue-500 w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
        Welcome back, {user?.name}! 🎉
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        <OverviewCard title="Visualizations" value={stats?.visualizationsCount || 0} />
        <OverviewCard title="Data Sources" value={stats?.dataSourcesCount || 0} />
        <OverviewCard title="Collaborators" value={stats?.collaboratorsCount || 0} />
      </div>
    </div>
  );
}

function OverviewCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
    </div>
  );
}
