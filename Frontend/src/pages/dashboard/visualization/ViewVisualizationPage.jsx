import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getVisualizationById } from "@/services/Visualization.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import ChartRenderer from "@/components/charts/ChartRenderer.jsx";

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

  // Ensure we have a valid data source before passing to the ChartRenderer
  const chartData = visualization.datasourceId?.data || [];

  // If no data or invalid chart data, display an error or placeholder
  if (!chartData.length) {
    return <p className="text-center text-red-500">No data available to render the chart.</p>;
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
            📊 {visualization?.title}
          </h2>

          {/* Render the chart */}
          <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
            <ChartRenderer
              type={visualization.chartType}
              data={chartData}
              xField={visualization.xField}
              yField={visualization.yField}
              config={visualization.config} // Pass configuration for the chart (e.g., color, barWidth)
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewVisualizationPage;
