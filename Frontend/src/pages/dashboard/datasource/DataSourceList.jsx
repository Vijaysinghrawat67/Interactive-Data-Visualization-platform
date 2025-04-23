import React, { useEffect, useState } from "react";
import { getDataSources } from "@/services/datasource.js";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; // New import for Button

const DataSourceList = () => {
  const [dataSources, setDataSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataSources = async () => {
      try {
        const res = await getDataSources();
        setDataSources(res?.data || []);
      } catch (error) {
        console.error("Error fetching data sources:", error);
        toast.error("Failed to load data sources");
      } finally {
        setLoading(false);
      }
    };

    fetchDataSources();
  }, []);

  if (loading) {
    return <Skeleton className="w-full h-[200px] rounded-xl" />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Flexbox to align heading and button on the same line */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📁 Uploaded Data Sources</h1>
        {/* Upload Data button */}
        <Link to="/dashboard/datasource/upload">
          <Button>Upload Data</Button>
        </Link>
      </div>

      {dataSources.length === 0 ? (
        <p className="text-gray-500">No data sources found.</p>
      ) : (
        <div className="space-y-4">
          {dataSources.map((ds) => (
            <Card key={ds._id} className="border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {ds.sourceType.toUpperCase()} source
                    </h2>
                    <p className="text-sm text-gray-500">
                      Fields: {ds.schemaFields?.join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploaded: {format(new Date(ds.createdAt), "PPpp")}
                    </p>
                  </div>
                  <Link
                    to={`/dashboard/datasource/view/${ds._id}`}
                    className="text-sm text-blue-500 underline"
                  >
                    View
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataSourceList;
