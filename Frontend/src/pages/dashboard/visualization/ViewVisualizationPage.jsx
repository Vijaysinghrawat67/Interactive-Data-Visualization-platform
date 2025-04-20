import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getVisualizationById } from "@/services/Visualization";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";

const ViewVisualizationPage = () => {
  const { id } = useParams();
  const [visualization, setVisualization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisualization = async () => {
      try {
        const res = await getVisualizationById(id);
        setVisualization(res?.data?.data);
      } catch (error) {
        console.error("Error fetching visualization:", error);
        toast.error("Failed to load visualization.");
      } finally {
        setLoading(false);
      }
    };

    fetchVisualization();
  }, [id]);

  if (loading) {
    return <Skeleton className="w-full h-[300px] rounded-xl" />;
  }

  if (!visualization) {
    return <p className="text-red-500 text-center mt-10">Visualization not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {visualization.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base mb-1">
            {visualization.description}
          </p>
          <p className="text-sm text-muted-foreground">
            Created on {format(new Date(visualization.createdAt), "PPpp")}
          </p>
        </div>

        <Link to={`/dashboard/visualization/edit/${id}`}>
          <Button variant="ghost" className="text-sm">
            ✏️ Edit
          </Button>
        </Link>
      </div>

      <Card className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            📊 Visualization Preview
          </h2>

          {/* Placeholder for chart or graph */}
          <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
            Chart rendering goes here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewVisualizationPage;
