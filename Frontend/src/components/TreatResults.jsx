// src/components/TreatResults.jsx
import React from "react";

export default function TreatResults({ data }) {  // Changed from result to data
  if (!data) return null;
  const riskLevel = data.risk_level || "Unknown";  // Changed from result to data

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Threat Analysis Result
      </h2>
      
      <div className="space-y-4">
        <div className="flex flex-col items-center mb-6">
          <span className="text-sm uppercase tracking-wide text-gray-500">Risk Level</span>
          <span className={`text-xl font-semibold ${getRiskColor(riskLevel)}`}>
            {riskLevel}
          </span>
        </div>

        <div className="grid gap-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <span className="block text-sm font-medium text-gray-500">Hash</span>
            <span className="text-gray-900 font-mono">{data.hash}</span>
          </div>

          <div className="p-4 bg-gray-50 rounded-md">
            <span className="block text-sm font-medium text-gray-500">Detected By</span>
            <span className="text-gray-900">{data.detected_by || "N/A"}</span>
          </div>

          <div className="p-4 bg-gray-50 rounded-md">
            <span className="block text-sm font-medium text-gray-500">Scan Date</span>
            <span className="text-gray-900">{data.scan_date || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
