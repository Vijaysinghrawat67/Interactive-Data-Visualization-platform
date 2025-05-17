import React from "react";

const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-4xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          ✖️
        </button>
        <div className="p-6 overflow-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
