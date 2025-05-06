
import React from "react";
import { X } from "lucide-react"; // For delete icon

const ChartCard = ({ id, children, onRemove }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-full w-full p-3 relative">
      <button
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        onClick={() => onRemove(id)}
      >
        <X size={20} />
      </button>
      {children}
    </div>
  );
};

export default ChartCard;
