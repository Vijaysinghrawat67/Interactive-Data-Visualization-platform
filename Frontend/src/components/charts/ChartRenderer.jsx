import React from "react";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, LineChart, Line, PieChart, Pie, ScatterChart, Scatter, AreaChart, Area } from "recharts";

const ChartRenderer = ({ type, data, xField, yField, config }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400">No data available.</p>;
  }

  // Default chart if no valid type
  if (!type || !["bar", "line", "pie", "scatter", "area"].includes(type)) {
    console.error("Invalid chart type:", type);
    type = "bar"; // Default to bar chart if type is invalid
  }

  const chartProps = {
    data,
    margin: { top: 20, right: 30, left: 20, bottom: 40 },
    width: "100%",
    height: 400,
  };

  // Common style for all charts
  const chartStyle = {
    backgroundColor: "transparent",
    borderRadius: "10px",
    transition: "all 0.3s ease-in-out",
    padding: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  };

  switch (type) {
    case "bar":
      return (
        <ResponsiveContainer {...chartProps} style={chartStyle}>
          <BarChart data={data}>
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={yField} fill={config?.barColor || "#8884d8"} animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      );

    case "line":
      return (
        <ResponsiveContainer {...chartProps} style={chartStyle}>
          <LineChart data={data}>
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={yField} stroke={config?.lineColor || "#8884d8"} strokeWidth={2} dot={false} animationDuration={1000} />
          </LineChart>
        </ResponsiveContainer>
      );

    case "pie":
      return (
        <ResponsiveContainer {...chartProps} style={chartStyle}>
          <PieChart>
            <Pie
              data={data}
              dataKey={yField}   // Use yField for value
              nameKey={xField}   // Use xField for name (product name)
              outerRadius={120}  // Increase outer radius for better visibility
              innerRadius={50}   // Add inner radius for a donut effect (optional)
              fill={config?.pieColor || "#8884d8"}
              animationDuration={1000}
              label={({ name, value }) => `${name}: ${value}`} // Show name and value on the Pie chart
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );

    case "scatter":
      return (
        <ResponsiveContainer {...chartProps} style={chartStyle}>
          <ScatterChart>
            <XAxis dataKey={xField} name={xField} />
            <YAxis dataKey={yField} name={yField} />
            <Tooltip />
            <Scatter data={data} fill={config?.scatterColor || "#8884d8"} shape="circle" size={6} animationDuration={1000} />
          </ScatterChart>
        </ResponsiveContainer>
      );

    case "area":
      return (
        <ResponsiveContainer {...chartProps} style={chartStyle}>
          <AreaChart data={data}>
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey={yField} stroke={config?.areaColor || "#8884d8"} fill={config?.areaFill || "#8884d8"} />
          </AreaChart>
        </ResponsiveContainer>
      );

    default:
      return <p className="text-center text-red-500">Chart type "{type}" is not supported yet.</p>;
  }
};

export default ChartRenderer;
