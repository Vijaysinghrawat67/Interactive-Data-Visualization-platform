// File: src/pages/dataSource/UploadDataSource.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  uploadCsvOrExcel,
  uploadApi,
  uploadTest,
} from "@/services/datasource.js";

const UploadDataSource = () => {
  const [sourceType, setSourceType] = useState("file"); // file | api | text
  const [file, setFile] = useState(null);
  const [apiUrl, setApiUrl] = useState("");
  const [textData, setTextData] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setIsUploading(true);

      if (sourceType === "file") {
        if (!file) return toast.error("Please select a file.");
        const formData = new FormData();
        formData.append("file", file);
        await uploadCsvOrExcel(formData);
      }

      if (sourceType === "api") {
        if (!apiUrl) return toast.error("Please enter an API URL.");
        await uploadApi(apiUrl);
      }

      if (sourceType === "text") {
        if (!textData) return toast.error("Please enter text data.");
        await uploadTest(textData);
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
      <Card>
        <CardContent className="p-6 space-y-8">
          {/* Header and Toggle */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h2 className="text-2xl font-semibold">📤 Upload Data Source</h2>
            <div className="flex flex-wrap gap-2">
              {["file", "api", "text"].map((type) => (
                <Button
                  key={type}
                  variant={sourceType === type ? "default" : "outline"}
                  onClick={() => setSourceType(type)}
                >
                  {type.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          {sourceType === "file" && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
              <Label htmlFor="file-upload" className="text-sm font-medium min-w-[180px]">
                Select CSV / XLSX File
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv, .xlsx"
                className="w-full sm:flex-1"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          )}

          {/* API Upload */}
          {sourceType === "api" && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
              <Label htmlFor="api-url" className="text-sm font-medium min-w-[180px]">
                API Endpoint URL
              </Label>
              <Input
                id="api-url"
                type="text"
                placeholder="https://api.example.com/data"
                className="w-full sm:flex-1"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
            </div>
          )}

          {/* Text Upload */}
          {sourceType === "text" && (
  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
    <Label htmlFor="text-data" className="text-sm font-medium min-w-[180px] pt-2">
      Enter Text Data
    </Label>
    <div className="w-full sm:flex-1">
      <Textarea
        id="text-data"
        rows={10}
        className="w-full max-h-[300px] overflow-y-auto resize-y"
        placeholder="Paste your text here..."
        value={textData}
        onChange={(e) => setTextData(e.target.value)}
      />
      <p className="text-xs text-muted-foreground mt-1">
        Supports large blocks of text. Scrollable if content is long.
      </p>
    </div>
  </div>
)}


          {/* Upload Button */}
          <div className="pt-2">
            <Button onClick={handleSubmit} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadDataSource;
