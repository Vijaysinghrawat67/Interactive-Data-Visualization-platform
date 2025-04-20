import {
    BarChart, Bar,
    LineChart, Line,
    PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
  } from "recharts";
  
  const ChartRenderer = ({ chartType, dataPreview, xField, yField }) => {
    if (!dataPreview || dataPreview.length === 0) return <p>No data available</p>;
  
    const commonProps = {
      data: dataPreview,
      width: "100%",
      height: 300,
    };
  
    switch (chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={yField} fill="#8884d8" />
          </BarChart>
        );
      case "line":
        return (
          <LineChart {...commonProps}>
            <XAxis dataKey={xField} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={yField} stroke="#8884d8" />
          </LineChart>
        );
      case "pie":
        return (
          <PieChart width={400} height={400}>
            <Pie
              data={dataPreview}
              dataKey={yField}
              nameKey={xField}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#82ca9d"
              label
            >
              {dataPreview.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      default:
        return <p>Unsupported chart type</p>;
    }
  };
  
  export default ChartRenderer;
  