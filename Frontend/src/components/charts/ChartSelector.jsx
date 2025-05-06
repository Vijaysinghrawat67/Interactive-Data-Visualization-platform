import React, { useEffect, useState } from "react";
import { getUserVisualization } from "@/services/Visualization.js";
import { getSingleDataSource } from "@/services/datasource.js";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const ChartSelector = ({ onSelectChart }) => {
  const [availableCharts, setAvailableCharts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const res = await getUserVisualization();
        const charts = res?.data?.data || [];
        setAvailableCharts(charts);
      } catch (error) {
        toast.error("Failed to fetch charts.");
      }
    };
    fetchCharts();
  }, []);

  const handleSelect = async (chartId) => {
    const selectedChart = availableCharts.find(c => c._id === chartId);
    if (!selectedChart) return;

    try {
      setLoading(true);
      const res = await getSingleDataSource(selectedChart.datasourceId._id);
      const data = res?.data?.fulldata || [];

      const chartWithData = {
        ...selectedChart,
        data,
      };

      setSelectedId(chartId);
      onSelectChart(chartWithData);
    } catch (err) {
      toast.error("Failed to fetch chart data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="mt-6 mb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">📊 Select a Chart</h2>

      <div className="w-full max-w-md">
        <Select value={selectedId} onValueChange={handleSelect}>
          <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white transition-colors">
            <SelectValue placeholder="Choose a chart to add..." />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border dark:border-gray-700 text-sm shadow-lg">
            {availableCharts.length > 0 ? (
              availableCharts.map((chart) => (
                <SelectItem
                  key={chart._id}
                  value={chart._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors px-2 py-1"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{chart.title}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {chart.chartType}
                    </span>
                  </div>
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                No charts available
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        {loading && (
          <div className="flex items-center gap-2 text-blue-500 mt-3">
            <Loader2 className="animate-spin w-4 h-4" />
            <span>Loading chart data...</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChartSelector;
