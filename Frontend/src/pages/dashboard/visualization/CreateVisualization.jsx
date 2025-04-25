import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { createVisualization } from "@/services/Visualization";
import { getDataSources, getDataSourceSchema } from "@/services/datasource.js";
import { toast } from "sonner";
import {
  BarChart2,
  LineChart,
  PieChart,
  AreaChart,
  ScatterChart,
} from "lucide-react";
import ChartRenderer from "@/components/charts/ChartRenderer";

const chartTypes = [
  { label: "Bar", value: "bar", icon: <BarChart2 className="w-5 h-5" /> },
  { label: "Line", value: "line", icon: <LineChart className="w-5 h-5" /> },
  { label: "Pie", value: "pie", icon: <PieChart className="w-5 h-5" /> },
  { label: "Area", value: "area", icon: <AreaChart className="w-5 h-5" /> },
  { label: "Scatter", value: "scatter", icon: <ScatterChart className="w-5 h-5" /> },
];

const CreateVisualization = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [dataSources, setDataSources] = useState([]);
  const [schema, setSchema] = useState([]);
  const [chartType, setChartType] = useState("");
  const [xField, setXField] = useState("");
  const [yField, setYField] = useState("");
  const [config, setConfig] = useState({
    xAxisLabel: "",
    yAxisLabel: "",
    colorScheme: "default",
  });

  // Fetch data sources
  useEffect(() => {
    const fetchDataSources = async () => {
      try {
        const res = await getDataSources();
        const sources = res?.data || []; // Correctly access data
        if (sources.length === 0) {
          toast.info("No data sources found. Please upload one first.");
        }
        setDataSources(sources); // Update state
      } catch (err) {
        console.error("Error fetching data sources:", err);
        toast.error("Unable to load data sources.");
      }
    };
    fetchDataSources();
  }, []);

  // Fetch schema fields based on selected data source
  useEffect(() => {
    const fetchSchema = async () => {
      if (!selectedSource) return;
      try {
        const res = await getDataSourceSchema(selectedSource);
        const fields = res?.data?.schema || []; // Correctly access schema fields
        if (fields.length === 0) {
          toast.warning("No schema fields available for the selected data source.");
        }
        setSchema(fields); // Update state
      } catch (err) {
        console.error("Error fetching schema:", err);
        toast.error("Failed to fetch schema.");
      }
    };
    fetchSchema();
  }, [selectedSource]);

  // Update config when X and Y fields are selected
  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      xAxisLabel: xField,
      yAxisLabel: yField,
    }));
  }, [xField, yField]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !selectedSource || !chartType || !xField || !yField) {
      toast.warning("All fields are required.");
      return;
    }

    try {
      await createVisualization({
        title,
        description,
        datasourceId: selectedSource, // Backend requires "datasourceId"
        chartType,
        xField,
        yField,
        config, // Include the required config field
      });
      toast.success("Visualization created successfully.");
      navigate("/dashboard/visualization");
    } catch (err) {
      console.error("Error creating visualization:", err);
      toast.error("Failed to create visualization.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Card className="rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle>Create New Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter visualization title"
              />
            </div>

            {/* Description Input */}
            <div>
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description for the visualization"
              />
            </div>

            {/* Data Source Selector */}
            <div>
              <Label>Data Source</Label>
              <Select
                value={selectedSource}
                onValueChange={setSelectedSource}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Data Source" />
                </SelectTrigger>
                <SelectContent>
                  {dataSources.length > 0 ? (
                    dataSources.map((ds) => (
                      <SelectItem key={ds._id} value={ds._id}>
                        {ds.name || "Unnamed Data Source"}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground px-2 py-1">
                      No data sources available
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Chart Type Selector */}
            <div>
              <Label>Chart Type</Label>
              <div className="flex flex-wrap gap-3">
                {chartTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={chartType === type.value ? "default" : "outline"}
                    onClick={() => setChartType(type.value)}
                    type="button"
                  >
                    {type.icon} <span className="ml-2">{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Field Selectors for X and Y Axes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>X-Axis</Label>
                <Select
                  value={xField}
                  onValueChange={setXField}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select X field" />
                  </SelectTrigger>
                  <SelectContent>
                    {schema.length > 0 ? (
                      schema.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground px-2 py-1">
                        No fields available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Y-Axis</Label>
                <Select
                  value={yField}
                  onValueChange={setYField}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Y field" />
                  </SelectTrigger>
                  <SelectContent>
                    {schema.length > 0 ? (
                      schema.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground px-2 py-1">
                        No fields available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Chart Preview */}
            <div>
              <ChartRenderer
                chartType={chartType}
                dataSourceId={selectedSource}
                xField={xField}
                yField={yField}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full rounded-xl">
              Create Visualization
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateVisualization;