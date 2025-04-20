import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getUserVisualization,
  deleteVisualization,
} from "@/services/Visualization.js";
import { formatDistanceToNow } from "date-fns";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

const VisualizationsListPage = () => {
  const [visualizations, setVisualizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisualizations = async () => {
      try {
        const res = await getUserVisualization();
        setVisualizations(res?.data?.data || []);
      } catch (error) {
        console.error("Error fetching visualizations:", error);
        toast.error("Failed to load visualizations.");
      } finally {
        setLoading(false);
      }
    };

    fetchVisualizations();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this visualization?");
    if (!confirm) return;

    try {
      await deleteVisualization(id);
      setVisualizations((prev) => prev.filter((v) => v._id !== id));
      toast.success("Visualization deleted.");
    } catch (error) {
      console.error("Error deleting visualization:", error);
      toast.error("Failed to delete visualization.");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-screen-2xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          My Visualizations
        </h2>
        <Link to="/dashboard/visualization/create">
          <Button className="rounded-xl px-6 py-2">+ New Visualization</Button>
        </Link>

      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      ) : visualizations.length === 0 ? (
        <p className="text-gray-500 text-center mt-12">No visualizations found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visualizations.map((viz) => (
            <Card
              key={viz._id}
              className="rounded-2xl border border-gray-200 hover:shadow-lg transition duration-300"
            >
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">
                    {viz.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {viz.description}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Created {formatDistanceToNow(new Date(viz.createdAt))} ago
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Link to={`/dashboard/visualization/${viz._id}`}>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </Link>

                  <Link to={`/dashboard/visualization/edit/${viz._id}`}>
                    <Button size="sm" variant="secondary" className="flex items-center gap-1">
                      ✏️ Edit
                    </Button>
                  </Link>

                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1"
                    onClick={() => handleDelete(viz._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VisualizationsListPage;
