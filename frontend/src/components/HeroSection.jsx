import React, { useState } from "react";
import axios from "axios";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/search", {
        hash: query,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error searching hash:", error);
    }
    setLoading(false);
  };

  return (
    <section className="hero">
      <h1>HashGuard Search</h1>
      <p>Enter a public key or hash to check for malicious activity.</p>
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter key or hash..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {result && (
        <p>
          {result.status}: {result.message || result.details}
        </p>
      )}
    </section>
  );
};

export default HeroSection;
