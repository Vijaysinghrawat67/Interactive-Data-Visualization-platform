import React from "react";
import GridLayout from "react-grid-layout";
import ChartRenderer from "@/components/charts/ChartRenderer.jsx";
import { Button } from "@/components/ui/button";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ExportLayout = ({ charts, layout, onLayoutChange, onRemoveChart }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        🧩 Arrange Your Layout
      </h2>

      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={32}
        width={1200}
        onLayoutChange={onLayoutChange}
        draggableHandle=".drag-handle"
        margin={[20, 20]}
        useCSSTransforms={true}
        isResizable={true}
        isDraggable={true}
        compactType={null}
        preventCollision={false}
      >
        {charts.map((chart) => (
          <div
            key={chart._id}
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 p-5 flex flex-col"
          >
            <div className="drag-handle cursor-move text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 bg-gray-100 dark:bg-gray-800 px-4 py-1 rounded-lg select-none">
              🟰 {chart.title}
            </div>

            <div className="flex-1 rounded-lg overflow-hidden">
              <ChartRenderer
                type={chart.chartType}
                data={chart.data || []}
                xField={chart.xField}
                yField={chart.yField}
                config={chart.config || {}}
              />
            </div>

            <Button
              variant="ghost"
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
              onClick={() => onRemoveChart(chart._id)}
              aria-label={`Remove chart ${chart.title}`}
            >
              ❌
            </Button>
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default ExportLayout;
