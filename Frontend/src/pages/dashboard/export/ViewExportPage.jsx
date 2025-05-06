import React, { useEffect, useState } from "react";
import { getAllExports, downloadExport } from "@/services/apiServices.js";
import { toast } from "sonner";

const ViewExportsPage = () => {
  const [exports, setExports] = useState([]);

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
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">📂 Your Export Records</h1>
      {exports.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">No exports found.</p>
      ) : (
        <div className="space-y-4">
          {exports.map((exp) => (
            <div
              key={exp._id}
              className="bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{exp.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{exp.description}</p>
                <p className="text-sm text-gray-400 mt-1">Format: <span className="font-mono">{exp.exportFormat}</span></p>
              </div>
              <button
                onClick={() => handleDownload(exp.downloadLink)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                ⬇️ Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewExportsPage;
