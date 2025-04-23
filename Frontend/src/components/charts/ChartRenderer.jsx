import React from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6"];

const ChartRenderer = ({ type, data, xField, yField, config }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-muted-foreground">No data available.</p>;
  }

  const { color = "#6366f1", barWidth = 40 } = config || {};

  // Dynamic key check
  const availableFields = Object.keys(data[0] || {});
  const dynamicXField = xField || availableFields[1] || "id";
  const dynamicYField = yField || availableFields[2] || "value";

  switch (type) {
    case "bar":
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey={dynamicXField}
              label={{ value: dynamicXField, position: "bottom", offset: 20 }}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              label={{ value: dynamicYField, angle: -90, position: "insideLeft", offset: 10 }}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <Tooltip contentStyle={{ fontSize: 13 }} />
            <Legend />
            <Bar dataKey={dynamicYField} fill={color} barSize={barWidth} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    case "line":
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey={dynamicXField}
              label={{ value: dynamicXField, position: "bottom", offset: 20 }}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              label={{ value: dynamicYField, angle: -90, position: "insideLeft", offset: 10 }}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <Tooltip contentStyle={{ fontSize: 13 }} />
            <Legend />
            <Line
              type="monotone"
              dataKey={dynamicYField}
              stroke={color}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case "pie":
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Tooltip contentStyle={{ fontSize: 13 }} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            <Pie
              data={data}
              dataKey={dynamicYField}
              nameKey={dynamicXField}
              cx="50%"
              cy="45%"
              outerRadius={110}
              innerRadius={50}
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      );

    default:
      return <p className="text-center text-red-500">Chart type "{type}" is not supported yet.</p>;
  }
};

export default ChartRenderer;
