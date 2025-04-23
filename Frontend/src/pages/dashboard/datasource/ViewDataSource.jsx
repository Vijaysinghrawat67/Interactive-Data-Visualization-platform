import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSingleDataSource } from "@/services/datasource.js";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

const ViewDataSource = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSingleDataSource(id);
        let data = res?.data;

        // Dynamically derive schemaFields if empty
        if (data && (!data.schemaFields || data.schemaFields.length === 0)) {
          if (Array.isArray(data.data) && data.data.length > 0) {
            data.schemaFields = Object.keys(data.data[0]); // Extract schema fields from first object in data
          }
        }

        //console.log("Processed data source:", data); // Debugging log
        setDataSource(data);
      } catch (err) {
        console.error("Failed to fetch data source:", err);
        toast.error("Failed to load data source.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <Skeleton className="w-full h-[300px] rounded-xl" />;
  }

  if (!dataSource) {
    return <p className="text-center text-red-500">Data source not found.</p>;
  }

  const { sourceType, schemaFields = [], data = [], createdAt } = dataSource;

  const renderDataTable = () => {
    if (!Array.isArray(data) || data.length === 0 || !Array.isArray(schemaFields)) {
      return <p className="text-gray-500">No data available to display.</p>;
    }

    if (sourceType === "text") {
      // Enhanced styled display for text-based data
      const textData = data[0]; // Assuming it's a single object in an array
      return (
        <div className="space-y-6 mt-6 border rounded-md p-6 bg-gray-50 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Text Data Analysis</h3>
          <div className="bg-white p-4 rounded-md shadow-sm border">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600">Original Text:</h4>
              <p className="text-gray-800 italic border-l-4 border-blue-500 pl-4 break-words">
                {textData.originalText}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600">Word Count:</h4>
              <p className="text-gray-800 font-semibold border-l-4 border-green-500 pl-4">
                {textData.wordCount}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="overflow-auto max-h-[500px] border rounded-md mt-2">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {schemaFields.map((field) => (
                <th key={field} className="text-left px-4 py-2 font-medium whitespace-nowrap">
                  {field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t">
                {schemaFields.map((field) => (
                  <td key={field} className="px-4 py-2 whitespace-nowrap">
                    {row[field] != null ? row[field].toString() : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-xs text-gray-500 px-4 py-2 border-t">
          Showing {data.length} {data.length === 1 ? "record" : "records"}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <Button variant="outline" onClick={() => navigate("/dashboard/datasource")}>
        ← Go Back to List
      </Button>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">📄 Data Source Details</h2>
            <p className="text-sm text-muted-foreground">
              Type: <span className="capitalize">{sourceType}</span> | Uploaded on:{" "}
              {format(new Date(createdAt), "PPpp")}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">Schema Fields</h3>
            <p className="text-sm text-gray-600 break-words">
              {schemaFields.length > 0 ? schemaFields.join(", ") : "No schema detected"}
            </p>
          </div>

          {renderDataTable()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewDataSource;