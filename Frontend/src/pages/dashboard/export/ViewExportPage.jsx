import React, { useEffect, useState } from "react";
import { getAllExports, downloadExport, deleteExport } from "@/services/apiServices.js";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal.jsx";
import { ChartPreview } from "@/components/charts/ChartPreview.jsx";

const ViewExportsPage = () => {
  const [exports, setExports] = useState([]);
  const [selectedExport, setSelectedExport] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchExports = async () => {
      try {
        const { data } = await getAllExports();
        setExports(data);
      } catch {
        toast.error("Failed to fetch export records");
      }
    };
    fetchExports();
  }, []);

  const handleDownload = async (downloadLink) => {
    const fileName = downloadLink.split("/").pop();
    try {
      const response = await downloadExport(fileName);

      // Use the content-type from headers to create correct Blob MIME type
      const contentType = response.headers['content-type'] || 'application/octet-stream';
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch {
      toast.error("Download failed");
    }
  };

  const handlePreview = (exp) => {
    setSelectedExport(exp);
    setIsPreviewOpen(true);
  };

  const handleDelete = async (exportId) => {
    const confirmed = window.confirm("Are you sure you want to delete this export?");
    if (!confirmed) return;

    try {
      await deleteExport(exportId);
      toast.success("Export deleted successfully");

      setExports((prev) => prev.filter((e) => e._id !== exportId));
    }
    catch {
      toast.error("Failed to delete export record");
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button
        onClick={handleGoBack}
        className="mb-6 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
      >
        ← Go Back
      </button>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        📂 Your Export Records
      </h1>
      {exports.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">No exports found.</p>
      ) : (
        <div className="space-y-4">
          {exports.map((exp) => (
            <div
              key={exp._id}
              className="bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{exp.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{exp.description}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Format: <span className="font-mono">{exp.exportFormat}</span>
                </p>
              </div>
              <div className="flex gap-3 mt-3 sm:mt-0">
                <button
                  onClick={() => handlePreview(exp)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  👁️ Preview
                </button>
                <button
                  onClick={() => handleDownload(exp.downloadLink)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  ⬇️ Download
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isPreviewOpen && selectedExport && (
        <Modal onClose={() => setIsPreviewOpen(false)}>
          <ChartPreview exportData={selectedExport} />
        </Modal>
      )}
    </div>
  );
};

export default ViewExportsPage;
