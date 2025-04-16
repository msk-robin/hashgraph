// src/components/SearchLog.jsx
import React, { useEffect, useState } from "react";
import { getRecentSearches } from "../services/virusTotal";

export default function SearchLog() {
  const [searches, setSearches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRecentSearches();
      setSearches(data);
    };
    fetchData();
  }, []);

  const getRiskColor = (risk) => {
    switch ((risk || '').toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Recent Searches
      </h2>
      
      {searches.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No recent searches yet.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {searches.map((item, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between">
              <span className="font-mono text-sm text-gray-700">{item.query}</span>
              <span className={`text-sm font-medium ${getRiskColor(item.risk_level)}`}>
                {item.risk_level || "Unknown"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
