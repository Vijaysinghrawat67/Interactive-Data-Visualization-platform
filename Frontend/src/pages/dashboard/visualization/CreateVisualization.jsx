import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { getDataSources } from "@/services/datasource.js";
import { toast } from "sonner";

const CreateVisualization = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [dataSources, setDataSources] = useState([]);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await getDataSources();
        setDataSources(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch data sources", err);
        toast.error("Unable to load data sources.");
      }
    };

    fetchSources();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !selectedSource) {
      toast.warning("Title and Data Source are required.");
      return;
    }

    try {
      await createVisualization({
        title,
        description,
        dataSource: selectedSource,
      });
      toast.success("Visualization created.");
      navigate("/dashboard/visualization");
    } catch (err) {
      console.error("Error creating visualization:", err);
      toast.error("Failed to create visualization.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="rounded-2xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle>Create New Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Monthly Sales"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional short description"
              />
            </div>

            <div>
              <Label>Data Source</Label>
              <Select onValueChange={setSelectedSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a data source" />
                </SelectTrigger>
                <SelectContent>
                  {dataSources.map((ds) => (
                    <SelectItem key={ds._id} value={ds._id}>
                      {ds.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full rounded-xl">
                Create Visualization
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateVisualization;
