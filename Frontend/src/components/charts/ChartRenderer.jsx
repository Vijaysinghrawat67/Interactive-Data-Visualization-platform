import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  Legend,
  Cell,
} from "recharts";

const ChartRenderer = ({ type, data, xField, yField, config }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400">No data available.</p>;
  }

  // Detect if dark mode is active
  const isDarkMode = typeof window !== "undefined" && document.documentElement.classList.contains('dark');

  // Dynamic colors based on theme
  const axisTickColor = isDarkMode ? "#ddd" : "#333";
  const tooltipBgColor = isDarkMode ? "#2d2d2d" : "#ffffff";
  const tooltipBorderColor = isDarkMode ? "#444" : "#ddd";
  const primaryColor = config?.primaryColor || (isDarkMode ? "#76b7b2" : "#8884d8");

  const chartProps = {
    data,
    margin: { top: 20, right: 30, left: 20, bottom: 40 },
    width: "100%",
    height: 400,
  };

  const chartStyle = {
    backgroundColor: "transparent",
    borderRadius: "10px",
    transition: "all 0.3s ease-in-out",
    padding: "15px",
  };

  const tooltipStyle = {
    backgroundColor: tooltipBgColor,
    border: `1px solid ${tooltipBorderColor}`,
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
    color: isDarkMode ? "#eee" : "#333",
  };

  const tickStyle = {
    fontSize: 12,
    fontWeight: "500",
    fill: axisTickColor,
  };

  // Random pastel color generator for Pie chart
  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  };

  switch (type) {
    case "bar":
      return (
        <ResponsiveContainer {...chartProps} style={chartStyle}>
          <BarChart data={data}>
            <XAxis dataKey={xField} tick={tickStyle} />
            <YAxis tick={tickStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar
              dataKey={yField}
              fill={primaryColor}
              animationDuration={800}
              barSize={30}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      );

    case "line":
      return (
        <ResponsiveContainer {...chartProps} style={chartStyle}>
          <LineChart data={data}>
            <XAxis dataKey={xField} tick={tickStyle} />
            <YAxis tick={tickStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey={yField}
              stroke={primaryColor}
              strokeWidth={2}
              dot={{ stroke: primaryColor, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 7 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case "area":
      return (
        <ResponsiveContainer {...chartProps} style={chartStyle}>
          <AreaChart data={data}>
            <XAxis dataKey={xField} tick={tickStyle} />
            <YAxis tick={tickStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey={yField}
              stroke={primaryColor}
              fill={primaryColor}
              fillOpacity={0.25}
              animationDuration={1000}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      );

    case "scatter":
      return (
        <ResponsiveContainer {...chartProps} style={chartStyle}>
          <ScatterChart>
            <XAxis dataKey={xField} tick={tickStyle} />
            <YAxis dataKey={yField} tick={tickStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Scatter
              data={data}
              fill={primaryColor}
              shape="circle"
              animationDuration={800}
            />
          </ScatterChart>
        </ResponsiveContainer>
      );

    case "pie":
      const processedPieData = data.map((item, index) => ({
        ...item,
        [yField]: Number(item[yField]) || 0,
        fill: config?.pieColors?.[index] || getRandomPastelColor(),
      }));

      return (
        <div style={{ width: '100%', height: "100%" }}>
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={processedPieData}
                dataKey={yField}
                nameKey={xField}
                outerRadius={150}
                innerRadius={70}
                paddingAngle={5}
                label={({ name, value }) => `${name}: ${value}`}
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {processedPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`$${value}`, `${name}`]}
                contentStyle={tooltipStyle}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ marginTop: "20px", fontSize: "14px", color: axisTickColor }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );

    default:
      return <p className="text-center text-red-500">Chart type "{type}" is not supported yet.</p>;
  }
};

export default ChartRenderer;
