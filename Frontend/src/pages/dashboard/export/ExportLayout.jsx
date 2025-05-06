import React from "react";
import GridLayout from "react-grid-layout";
import ChartRenderer from "@/components/charts/ChartRenderer.jsx";
import { Button } from "@/components/ui/button";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ExportLayout = ({ charts, layout, onLayoutChange, onRemoveChart }) => {
  // Calculate the next available position in the grid
  const findAvailablePosition = () => {
    const gridCols = 12;
    let x = 0;
    let y = 0;

    const layoutCopy = [...layout];
    layoutCopy.forEach(({ x: layoutX, y: layoutY, w, h }) => {
      if (layoutX + w > gridCols) {
        y = Math.max(y, layoutY + h);
      }
    });

    return { x, y };
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        🧩 Arrange Your Layout
      </h2>

      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        onLayoutChange={onLayoutChange}
        draggableHandle=".drag-handle"
        margin={[16, 16]}
        useCSSTransforms={true}
        isResizable={true}
        isDraggable={true}
        compactType={null}
        preventCollision={false}
      >
        {charts.map((chart, index) => {
          const { x, y } = findAvailablePosition();

          return (
            <div
              key={chart._id}
              className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 relative transition-all"
            >
              <div className="drag-handle cursor-move text-sm text-gray-700 dark:text-gray-200 font-medium mb-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
                🟰 {chart.title}
              </div>

              <div className="rounded-lg overflow-hidden">
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
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition"
                onClick={() => onRemoveChart(chart._id)}
              >
                ❌
              </Button>
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
};

export default ExportLayout;
