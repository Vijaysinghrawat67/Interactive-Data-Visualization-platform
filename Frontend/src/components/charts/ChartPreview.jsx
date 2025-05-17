import React from "react";
import ChartRenderer from "./ChartRenderer.jsx";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

export const ChartPreview = ({ exportData }) => {
  const layout = exportData.layout || [];

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
        {exportData.title}
      </h2>
      {exportData.description && (
        <p className="text-md text-gray-600 dark:text-gray-300 mb-6">
          {exportData.description}
        </p>
      )}

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 10, sm: 6 }}
        rowHeight={35}  
        margin={[20, 20]}
        isDraggable={false}
        isResizable={false}
        useCSSTransforms={true}
        autoSize={true}
      >
        {(exportData.visualizations || []).map((viz) => {
          const chartData = viz.data || [];
          const chartType = viz.chartType || viz.type || "bar";
          const xField = viz.xField || "x";
          const yField = viz.yField || "y";
          const config = viz.config || {};
          const chartLayout = layout.find((l) => l.i === viz._id) || {};

          if (!chartData.length) return null;

          // Estimate height: 8 rows minimum, + extra if there's a long description
          const estimatedHeight = chartLayout?.h || (viz.description?.length > 80 ? 12 : 10);

          return (
            <div
              key={viz._id}
              data-grid={{ ...chartLayout, h: estimatedHeight }}
              className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex flex-col justify-between"
            >
              {/* Chart */}
              <ChartRenderer
                type={chartType}
                data={chartData}
                xField={xField}
                yField={yField}
                config={config}
              />

              {/* Metadata */}
              <div className="mt-4 space-y-1">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {viz.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {viz.description || "No description available"}
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="inline-block mr-4">
                    <strong>X Field:</strong> {xField}
                  </span>
                  <span className="inline-block">
                    <strong>Y Field:</strong> {yField}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
};
