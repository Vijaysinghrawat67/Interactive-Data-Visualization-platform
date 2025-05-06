
import React, { useState, useEffect } from "react";
import { getUserVisualization } from "@/services/Visualization.js";
import { saveExport } from "@/services/apiServices.js";
import ChartSelector from "@/components/charts/ChartSelector.jsx";
import ExportLayout from "./ExportLayout.jsx";
import ExportSettings from "./ExportSetting.jsx";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ExportPage = () => {
  const navigate = useNavigate();
  const [selectedCharts, setSelectedCharts] = useState([]);
  const [layoutConfig, setLayoutConfig] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [exportFormat, setExportFormat] = useState("pdf");

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        await getUserVisualization();
      } catch {
        toast.error("Failed to fetch charts");
      }
    };
    fetchCharts();
  }, []);

  const handleChartAdd = (chart) => {
    if (selectedCharts.find((c) => c._id === chart._id)) {
      toast.error("Chart already added");
      return;
    }

    const w = 4;
    const h = 6;
    const gridCols = 12;

    // Build a map of all occupied grid cells
    const occupied = new Set();
    layoutConfig.forEach(({ x, y, w, h }) => {
      for (let dx = 0; dx < w; dx++) {
        for (let dy = 0; dy < h; dy++) {
          occupied.add(`${x + dx}-${y + dy}`);
        }
      }
    });

    let positionFound = false;
    let x = 0;
    let y = 0;

    while (!positionFound) {
      const needed = [];
      for (let dx = 0; dx < w; dx++) {
        for (let dy = 0; dy < h; dy++) {
          needed.push(`${x + dx}-${y + dy}`);
        }
      }

      if (needed.every(cell => !occupied.has(cell))) {
        positionFound = true;
        break;
      }

      x += w;
      if (x + w > gridCols) {
        x = 0;
        y += h;
      }
    }

    const newLayoutItem = {
      i: chart._id,
      x,
      y,
      w,
      h,
    };

    setSelectedCharts((prev) => [...prev, chart]);
    setLayoutConfig((prev) => [...prev, newLayoutItem]);
  };

  const handleChartRemove = (id) => {
    setSelectedCharts((prev) => prev.filter((c) => c._id !== id));
    setLayoutConfig((prev) => prev.filter((l) => l.i !== id));
  };

  const handleLayoutChange = (newLayout) => {
    const cleanedLayout = newLayout.map((item) => ({
      i: item.i,
      x: Number(item.x) || 0,
      y: Number(item.y) || 0,
      w: Number(item.w) || 4,
      h: Number(item.h) || 6,
    }));
    setLayoutConfig(cleanedLayout);
  };

  const handleSaveExport = async () => {
    if (!title || selectedCharts.length === 0) {
      toast.error("Provide title and select at least one chart");
      return;
    }

    try {
      const exportData = {
        title,
        description,
        exportFormat,
        layout: layoutConfig,
        visualizationIds: selectedCharts.map((chart) => chart._id),
      };
      await saveExport(exportData, selectedCharts[0]._id);
      toast.success("Export saved!");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to save export");
    }
  };

  return (
    <motion.div
      className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8 space-y-8"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="flex justify-between items-center mb-6">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            📦 Build Your Export
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Select charts, organize layout, and save your export.
          </p>
        </div>

        <Link to="/dashboard/export/view">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          📁 View Existing Exports
        </button>
        </Link>
      </header>

      <section>
        <ExportSettings
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          onSave={handleSaveExport}
        />
      </section>

      <section>
        <ChartSelector onSelectChart={handleChartAdd} />
      </section>

      <section>
        <ExportLayout
          charts={selectedCharts}
          layout={layoutConfig}
          onLayoutChange={handleLayoutChange}
          onRemoveChart={handleChartRemove}
        />
      </section>
    </motion.div>
  );
};

export default ExportPage;