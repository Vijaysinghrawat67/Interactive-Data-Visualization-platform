import React from "react";
import ChartRenderer from "./ChartRenderer.jsx";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

export const ChartPreview = ({ exportData }) => {
  const layout = exportData.layout || [];

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-100px)] p-4 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        {exportData.title}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">{exportData.description}</p>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 10, sm: 6 }}
        rowHeight={30}
        margin={[20, 20]}
        isDraggable={false}
        isResizable={false}
        useCSSTransforms={true}
        autoSize={true}
      >
        {(exportData.visualizations || []).map((viz, index) => {
          const chartData = viz.data || [];
          const chartType = viz.chartType || viz.type || "bar";
          const xField = viz.xField || "x";
          const yField = viz.yField || "y";
          const config = viz.config || {};
          const chartLayout = layout.find((l) => l.i === viz._id) || {};

          if (!chartData.length) return null;

          return (
            <div
              key={viz._id}
              data-grid={{ ...chartLayout, h: chartLayout?.h || (viz.description?.length > 100 ? 10 : 6)}}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md overflow-visible flex flex-col"
            >
              {/* Chart Renderer */}
              <div className="flex-grow">
                <ChartRenderer
                  type={chartType}
                  data={chartData}
                  xField={xField}
                  yField={yField}
                  config={config}
                />
              </div>

              {/* Metadata */}
              <div className="mt-4">
                <h4 className="font-semibold text-lg text-gray-800 dark:text-white">
                  {viz.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {viz.description || "No description available"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>X Field:</strong> {xField} <br />
                  <strong>Y Field:</strong> {yField}
                </p>
              </div>
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
};
