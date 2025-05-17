import React, { useState, useEffect } from "react";
import { getUserVisualization } from "@/services/Visualization.js";
import { saveExport } from "@/services/apiServices.js";
import ChartSelector from "@/components/charts/ChartSelector.jsx";
import ExportLayout from "./ExportLayout.jsx";
import ExportSettings from "./ExportSetting.jsx";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";

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

      if (needed.every((cell) => !occupied.has(cell))) {
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

    let imageData = null;

    if (exportFormat === "png" || exportFormat === "pdf") {
      const node = document.getElementById("export-content");
      if (!node) {
        toast.error("Export layout not found");
        return;
      }

      try {
        imageData = await toPng(node);
      } catch (err) {
        console.error("Image capture error:", err);
        toast.error("Failed to capture chart layout");
        return;
      }
    }

    try {
      const exportData = {
        title,
        description,
        exportFormat,
        layout: layoutConfig,
        visualizationIds: selectedCharts.map((chart) => chart._id),
        imageData,
      };
      await saveExport(exportData);
      toast.success("Export saved!");
      navigate("/dashboard/export/view");
    } catch {
      toast.error("Failed to save export");
    }
  };

  const handleViewExports = () => {
    navigate("/dashboard/export/view");
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-10 space-y-10"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          📦 Build Your Export
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Select charts, organize the layout, and save your export.
        </p>
        <button
          onClick={handleViewExports}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          View Existing Exports
        </button>
      </header>

      {/* Export Settings Section */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-md max-w-4xl mx-auto">
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

      {/* Chart Selector Section */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-md max-w-4xl mx-auto">
        <ChartSelector onSelectChart={handleChartAdd} />
      </section>

      {/* Export Preview Section */}
      <section
        id="export-content"
        className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-6xl mx-auto"
      >
        <header className="mb-6 border-b border-gray-300 dark:border-gray-700 pb-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{title || "Untitled Export"}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{description || "No description provided."}</p>
        </header>

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
