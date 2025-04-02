import { useState } from "react";
import SearchBar from "../components/SearchBar";

const HashGuardUI = () => {
  const [result, setResult] = useState(null);

  const searchHash = async (query) => {
    const res = await fetch(`/api/check/${query}`);
    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <SearchBar onSearch={searchHash} />
      {result && (
        <div className="result">
          <h3>Search Result</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default HashGuardUI;
