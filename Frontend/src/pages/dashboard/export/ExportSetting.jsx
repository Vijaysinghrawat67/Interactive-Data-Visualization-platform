import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ExportSettings = ({
  title,
  setTitle,
  description,
  setDescription,
  exportFormat,
  setExportFormat,
  onSave,
}) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg space-y-5 transition-all duration-300 border dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
        📝 Export Settings
      </h2>

      <div className="space-y-3">
        <Input
          placeholder="Export Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />

        <Textarea
          placeholder="Export Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="pdf">PDF</option>
          <option value="png">PNG</option>
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
        </select>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
          onClick={onSave}
        >
          💾 Save & Export
        </Button>
      </div>
    </motion.div>
  );
};

export default ExportSettings;
