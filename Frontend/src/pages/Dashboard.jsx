import React, { useState } from "react";
import TreatResults from "../components/TreatResults";
import SearchLog from "../components/SearchLog";
import { searchHash } from "../services/virusTotal";
import hashguardLogo from "../assets/hashguard.svg";

export default function Dashboard({ onError }) {
  const [results, setResults] = useState(null);
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    try {
      const response = await searchHash(query);
      setResults(response);
    } catch (error) {
      console.error(error);
      onError?.("Error fetching threat data.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Hero Section */}
      <div className="text-center py-12">
        <img src={hashguardLogo} alt="HashGuard" className="h-20 mx-auto mb-8" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to HashGuard
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your Decentralized Guardian Against Digital Threats
        </p>
      </div>

      {/* Search Section */}
      <div className="flex gap-2 justify-center mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter hash or key"
          className="border px-3 py-2 rounded w-96"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
        >
          Search
        </button>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Decentralized Security</h3>
          <p className="text-gray-600">Leveraging Hedera's blockchain for transparent and immutable threat detection</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">DAO Governance</h3>
          <p className="text-gray-600">Community-driven security rules and policies through decentralized governance</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Real-time Protection</h3>
          <p className="text-gray-600">Instant threat detection and analysis powered by advanced security protocols</p>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-8">
        {results && <TreatResults data={results} />}
        <SearchLog />
      </div>
    </div>
  );
}
