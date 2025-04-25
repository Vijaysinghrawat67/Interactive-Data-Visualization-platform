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
          if (Array.isArray(data.fulldata) && data.fulldata.length > 0) {
            data.schemaFields = Object.keys(data.fulldata[0]);
          }
        }

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
    return (
      <p className="text-center text-red-500 dark:text-red-400">
        Data source not found.
      </p>
    );
  }

  const {
    fields: schemaFields = [],
    fulldata: data = [],
    createdAt,
    sourceType,
    name,
  } = dataSource;

  const renderField = (fieldValue) => {
    if (typeof fieldValue === "object" && fieldValue !== null) {
      if (fieldValue.name) return fieldValue.name;
      if (fieldValue.city && fieldValue.street)
        return `${fieldValue.street}, ${fieldValue.city}`;
      if (fieldValue.city) return fieldValue.city;
      if (fieldValue.lat && fieldValue.lng)
        return `Lat: ${fieldValue.lat}, Lng: ${fieldValue.lng}`;
      return "Details available";
    }

    return fieldValue != null ? fieldValue.toString() : "-";
  };

  const renderTextParagraphs = () => {
    return (
      <div className="space-y-6 mt-4">
        {data.map((entry, index) => (
          <div
            key={index}
            className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800 shadow-sm space-y-2"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
              Record #{index + 1}
            </p>
            <div className="space-y-1">
              {schemaFields.map((field) => (
                <p
                  key={field}
                  className="text-sm text-gray-700 dark:text-gray-200"
                >
                  <span className="font-medium capitalize">{field}:</span>{" "}
                  {renderField(entry[field])}
                </p>
              ))}
            </div>
          </div>
        ))}
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Showing {data.length} {data.length === 1 ? "record" : "records"}
        </div>
      </div>
    );
  };

  const renderTable = () => {
    if (!Array.isArray(data) || data.length === 0 || !Array.isArray(schemaFields)) {
      return <p className="text-gray-500 dark:text-gray-400">No data available to display.</p>;
    }

    return (
      <div className="overflow-auto max-h-[500px] border rounded-md mt-4 bg-gray-50 dark:bg-gray-800 shadow-md">
        <table className="min-w-full text-sm text-gray-800 dark:text-gray-100">
          <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              {schemaFields.map((field) => (
                <th
                  key={field}
                  className="text-left px-4 py-2 font-medium whitespace-nowrap text-gray-600 dark:text-gray-300"
                >
                  {field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                {schemaFields.map((field) => (
                  <td
                    key={field}
                    className="px-4 py-2 whitespace-nowrap"
                    style={{ width: "150px" }}
                  >
                    {renderField(row[field])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-xs text-gray-500 dark:text-gray-400 px-4 py-2 border-t">
          Showing {data.length} {data.length === 1 ? "record" : "records"}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <Button
        variant="outline"
        onClick={() => navigate("/dashboard/datasource")}
        className="text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        ← Go Back to List
      </Button>

      <Card className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-300 dark:border-gray-700">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              📄 Data Source Details
            </h2>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Name: <span className="capitalize">{name || "Unnamed Data Source"}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Type: <span className="capitalize">{sourceType}</span> | Uploaded on:{" "}
              {createdAt ? format(new Date(createdAt), "PPpp") : "Date not available"}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
              Schema Fields
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
              {schemaFields.length > 0 ? schemaFields.join(", ") : "No schema detected"}
            </p>
          </div>

          {/* Only change layout if sourceType === "text" */}
          {sourceType === "text" ? renderTextParagraphs() : renderTable()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewDataSource;
