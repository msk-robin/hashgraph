import { useState } from "react";
import { ContractExecuteTransaction } from "@hashgraph/sdk";
import { useHedera } from "../contexts/useHedera";

export default function PolicyForm({ onError }) {
  const { client, contracts } = useHedera();
  const [error, setError] = useState(false);
  const [limits, setLimits] = useState({
    daily: "",
    perTx: "",
    whitelist: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    if (!client || !contracts?.HashGuardDAO) {
      setError(true);
      onError("Client or contracts not initialized");
      return;
    }

    try {
      const tx = await new ContractExecuteTransaction()
        .setContractId(contracts.HashGuardDAO.address)
        .setFunction("setPolicy", [
          parseInt(limits.daily * 1e8),
          parseInt(limits.perTx * 1e8),
          limits.whitelist.split(",").map((a) => a.trim()),
        ])
        .setGas(200_000)
        .execute(client);
      const receipt = await tx.getReceipt(client);
      console.log("Policy updated:", receipt.status.toString());
    } catch (error) {
      console.error("Policy update failed:", error);
      setError(true);
      onError(error.message);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>Something went wrong</p>
          <p>
            We've encountered an unexpected error. Please try refreshing the
            page.
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Daily Limit (HBAR)
          </label>
          <input
            type="number"
            value={limits.daily}
            onChange={(e) => setLimits({ ...limits, daily: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter daily limit"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Per Transaction Limit (HBAR)
          </label>
          <input
            type="number"
            value={limits.perTx}
            onChange={(e) => setLimits({ ...limits, perTx: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter per transaction limit"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Whitelist (comma-separated addresses)
          </label>
          <input
            type="text"
            value={limits.whitelist}
            onChange={(e) =>
              setLimits({ ...limits, whitelist: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter whitelisted addresses"
          />
        </div>

        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Update Policy
        </button>
      </form>
    </div>
  );
}
