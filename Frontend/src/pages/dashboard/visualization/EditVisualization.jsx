import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getVisualizationById, updateVisualization } from "@/services/Visualization.js";

const EditVisualization = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViz = async () => {
      try {
        const res = await getVisualizationById(id);
        const data = res?.data?.data;
        setForm({
          title: data?.title || "",
          description: data?.description || "",
        });
      } catch (error) {
        toast.error("Failed to fetch visualization.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchViz();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVisualization(id, form);
      toast.success("Visualization updated!");
      navigate("/dashboard/visualization");
    } catch (err) {
      toast.error("Update failed.");
      console.error(err);
    }
  };

  if (loading) return <p className="text-center py-8">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Visualization</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Enter title"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Write a brief description..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit">Update</Button>
        </div>
      </form>
    </div>
  );
};

export default EditVisualization;
