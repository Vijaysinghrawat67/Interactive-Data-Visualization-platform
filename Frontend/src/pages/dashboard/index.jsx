// src/pages/dashboard/DashboardLayout.jsx
import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { Menu, LogOut, X, BarChart3, User, Database, FileText, Settings, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/axios";
import { toast } from "sonner";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Manage sidebar state
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/api/v1/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        toast.error("Please login again.");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    { label: "Overview", path: "/dashboard/overview", icon: <BarChart3 /> },
    { label: "Profile", path: "/dashboard/profile", icon: <User /> },
    { label: "Data Sources", path: "/dashboard/datasource", icon: <Database /> },
    { label: "Visualizations", path: "/dashboard/visualization", icon: <BarChart3 /> },
    { label: "Activity Logs", path: "/dashboard/logs", icon: <FileText /> },
    { label: "Settings", path: "/dashboard/settings", icon: <Settings /> },
    { label: "Export", path: "/dashboard/export", icon: <Share2 /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Sidebar - Always hidden by default, shown only if sidebarOpen */}
      <aside
        className={`w-64 bg-white dark:bg-slate-800 shadow-md transform transition-transform duration-300 z-40 fixed top-0 left-0 h-full ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600 dark:text-white">
            DataViz
          </Link>
          <button onClick={() => setSidebarOpen(false)} >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 trasition" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 dark:hover:bg-slate-700 transition ${
                  isActive ? "bg-blue-500 text-white dark:bg-blue-600" : "text-gray-700 dark:text-gray-300"
                }`
              }
              onClick={() => setSidebarOpen(false)} // Close sidebar on nav item click
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar with hamburger icon and greeting */}
        <div className="p-4 flex items-center justify-between bg-white dark:bg-slate-800 shadow">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 dark:text-gray-300">
            <Menu className="w-6 h-6" />
          </button>
          {user && (
            <span className="text-sm text-gray-800 dark:text-gray-100">Hello, {user.name}</span>
          )}
        </div>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
