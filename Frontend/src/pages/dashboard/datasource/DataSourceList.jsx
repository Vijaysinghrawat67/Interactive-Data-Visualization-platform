import React, { useEffect, useState } from "react";
import { getDataSources } from "@/services/datasource.js";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
          📁 Uploaded Data Sources
        </h1>
        <Link to="/dashboard/datasource/upload">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            + Upload Data
          </Button>
        </Link>
      </div>

      {/* Data Source Cards */}
      {dataSources.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No data sources found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataSources.map((ds) => (
            <Card
              key={ds._id}
              className="border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 bg-white dark:bg-gray-800"
            >
              <CardContent className="p-6 space-y-4">
                {/* Title and Name */}
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {ds.name || "Unnamed Data Source"}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                  Type: {ds.sourceType}
                </p>

                {/* Fields */}
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Fields:</span>{" "}
                  {ds.schemaFields && ds.schemaFields.length > 0
                    ? ds.schemaFields.slice(0, 3).join(", ") +
                      (ds.schemaFields.length > 3 ? "..." : "")
                    : "No fields detected"}
                </p>

                {/* Uploaded Date */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Uploaded:</span>{" "}
                  {ds.createdAt
                    ? format(new Date(ds.createdAt), "PPpp")
                    : "Date not available"}
                </p>

                {/* View Button */}
                <div className="mt-4">
                  <Link to={`/dashboard/datasource/view/${ds._id}`}>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all duration-300">
                      View Details
                    </Button>
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