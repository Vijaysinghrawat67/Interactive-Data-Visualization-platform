import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getVisualizationById } from "@/services/Visualization.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import ChartRenderer from "@/components/charts/ChartRenderer.jsx";

const ViewVisualizationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visualization, setVisualization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisualization = async () => {
      try {
        const res = await getVisualizationById(id);
        if (res?.data?.data) {
          setVisualization(res.data.data);
        } else {
          throw new Error("Invalid visualization data");
        }
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

  // Ensure we have a valid chart type (default to "bar" if invalid)
  const validChartTypes = ["bar", "line", "pie", "area", "scatter"];
  const chartType = validChartTypes.includes(visualization.chartType)
    ? visualization.chartType
    : "bar"; // Default to "bar" if chart type is invalid or empty

  const chartData = visualization.datasourceId?.data || [];

  if (!chartData.length) {
    return <p className="text-center text-red-500">No data available to render the chart.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Go Back Button */}
      <Button
        variant="outline"
        className="mb-6 text-sm"
        onClick={() => navigate(-1)}
      >
        🔙 Go Back
      </Button>

      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-all ease-in-out duration-300 hover:text-blue-500">
            {visualization.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base mb-1 leading-relaxed">
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

      <Card className="rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 transition-all ease-in-out duration-300 hover:shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            📊 {visualization?.title}
          </h2>

          {/* Display the X and Y fields with their labels */}
          <div className="mb-6 text-lg text-gray-800 dark:text-white">
            <p><strong className="text-lg font-semibold">X Axis Field:</strong> <span className="text-gray-500">{visualization.xField}</span></p>
            <p><strong className="text-lg font-semibold">Y Axis Field:</strong> <span className="text-gray-500">{visualization.yField}</span></p>
          </div>

          {/* Render the chart */}
          
            {/* {console.log("Chart Data:", chartData)}
            {console.log("Visualization xField:", visualization.xField)} 
            {console.log("Visualization yField:", visualization.yField)}
            {console.log("Chart Type:", chartType)} */}
            
        
          <div className="w-full h-[550px] bg-gray-100 dark:bg-gray-800 rounded-2xl flex flex-col  items-center justify-center transition-all ease-in-out duration-500 p-6 hover:shadow-2xl"> 
            <ChartRenderer
              type={chartType}
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
