import React from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const SuccessModal = ({ isOpen, onClose, onDownload }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white rounded-2xl shadow-lg p-6 w-96 text-center"
      >
        {/* Success Icon */}
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />

        {/* Success Message */}
        <h2 className="text-xl font-bold text-gray-800 mt-4">
          Bill Generated Successfully!
        </h2>
        <p className="text-gray-600 mt-2">
          Your invoice is ready for download.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onDownload}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Download Invoice
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-500 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessModal;
