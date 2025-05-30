
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

 function VisualizationsOverTimeChart({ data }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border dark:border-slate-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Visualizations Over Time
      </h3>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis
              dataKey="date"
              tickFormatter={(dateStr) => new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              stroke="#8884d8"
              minTickGap={20}
            />
            <YAxis allowDecimals={false} stroke="#8884d8" />
            <Tooltip
              labelFormatter={(label) =>
                new Date(label).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
              }
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-20">
          No data available
        </p>
      )}
    </div>
  );
}

export default VisualizationsOverTimeChart;