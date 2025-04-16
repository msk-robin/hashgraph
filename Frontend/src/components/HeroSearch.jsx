import React, { useState } from "react";
import { searchAddress } from "../utils/aiService";
import LoadingSpinner from "./LoadingSpinner";
import TreatResults from "./treatResults";

export default function HeroSearch() {
  const [address, setAddress] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError("Please enter a valid address");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearchResult(null);

      const result = await searchAddress(address);
      if (!result) {
        throw new Error("No results returned from search");
      }

      setSearchResult(result);
    } catch (err) {
      console.error("Search failed:", err);
      setError(
        err.message || "Failed to perform address search. Please try again."
      );
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address to analyze"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !address.trim()}
          className={`w-full py-2 px-4 rounded-lg ${
            loading || !address.trim()
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white font-semibold transition-colors`}
        >
          {loading ? "Analyzing..." : "Analyze Address"}
        </button>
      </form>

      {error && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-2 text-gray-600">Analyzing address...</p>
        </div>
      )}

      {searchResult && !loading && !error && (
        <TreatResults searchResult={searchResult} address={address} />
      )}
    </div>
  );
}
