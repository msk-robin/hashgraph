import React, { useState } from "react";
import PolicyForm from "./PolicyForm";
import GuardianForm from "./GuardianForm";

function DAOGovernance() {
  const [error, setError] = useState(null);

  const handleError = (message) => {
    setError(message);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">DAO Governance</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Policy Settings</h2>
          <PolicyForm onError={handleError} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Guardian Settings</h2>
          <GuardianForm onError={handleError} />
        </div>
      </div>
    </div>
  );
}

export default DAOGovernance;
