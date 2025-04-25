import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { uploadCsvOrExcel, uploadApi, uploadText } from "@/services/datasource.js";

const UploadDataSource = () => {
  const [sourceType, setSourceType] = useState("file");
  const [file, setFile] = useState(null);
  const [apiUrl, setApiUrl] = useState("");
  const [textData, setTextData] = useState("");
  const [name, setName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setIsUploading(true);

      if (!name) return toast.error("Please enter a name for the data source.");

      if (sourceType === "file") {
        if (!file) return toast.error("Please select a file.");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", name);
        await uploadCsvOrExcel(formData);
      }

      if (sourceType === "api") {
        if (!apiUrl) return toast.error("Please enter an API URL.");
        await uploadApi({ name, apiUrl });
      }

      if (sourceType === "text") {
        if (!textData) return toast.error("Please enter text data.");
        await uploadText({ name, text: textData }); // ✅ CORRECT FORMAT
      }

      toast.success("Data uploaded successfully!");
      navigate("/dashboard/datasource");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload data");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Card className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg">
        <CardContent className="p-6 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              📤 Upload Data Source
            </h2>
            <div className="flex flex-wrap gap-2">
              {["file", "api", "text"].map((type) => (
                <Button
                  key={type}
                  variant={sourceType === type ? "default" : "outline"}
                  className={`text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 ${
                    sourceType === type
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setSourceType(type)}
                >
                  {type.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
            <Label htmlFor="data-source-name" className="text-sm font-medium text-gray-800 dark:text-gray-100 min-w-[180px]">
              Data Source Name
            </Label>
            <Input
              id="data-source-name"
              type="text"
              placeholder="Enter a name for the data source"
              className="w-full sm:flex-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {sourceType === "file" && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
              <Label htmlFor="file-upload" className="text-sm font-medium text-gray-800 dark:text-gray-100 min-w-[180px]">
                Select CSV / XLSX File
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv, .xlsx"
                className="w-full sm:flex-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          )}

          {sourceType === "api" && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
              <Label htmlFor="api-url" className="text-sm font-medium text-gray-800 dark:text-gray-100 min-w-[180px]">
                API Endpoint URL
              </Label>
              <Input
                id="api-url"
                type="text"
                placeholder="https://api.example.com/data"
                className="w-full sm:flex-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
            </div>
          )}

          {sourceType === "text" && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Label htmlFor="text-data" className="text-sm font-medium text-gray-800 dark:text-gray-100 min-w-[180px] pt-2">
                Enter Text Data
              </Label>
              <div className="w-full sm:flex-1">
                <Textarea
                  id="text-data"
                  rows={10}
                  className="w-full max-h-[300px] overflow-y-auto resize-y bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  placeholder="Paste your text here..."
                  value={textData}
                  onChange={(e) => setTextData(e.target.value)}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Supports large blocks of text. Scrollable if content is long.
                </p>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isUploading}
              className="w-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadDataSource;
