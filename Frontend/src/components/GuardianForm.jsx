import { useState, useEffect } from "react";
import { useHedera } from "../contexts/useHedera";
import { ContractExecuteTransaction } from "@hashgraph/sdk";

const ADMIN_KEY = "0.0.123456"; // Replace with actual admin key
const STORAGE_KEY = "guardianFormSubmission";
const MONTH_IN_MS = 2592000000; // 30 days in milliseconds

export default function GuardianForm({ onError }) {
  const { client, contracts } = useHedera();
  const [formData, setFormData] = useState({
    maxTransactionAmount: "",
    dailyLimit: "",
    transactionDelay: "",
    whitelistedAddresses: "",
  });
  const [showForm, setShowForm] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    checkSubmissionHistory();
  }, []);

  const checkSubmissionHistory = () => {
    const lastSubmission = localStorage.getItem(STORAGE_KEY);
    if (lastSubmission) {
      const submissionDate = new Date(parseInt(lastSubmission));
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      if (submissionDate > twelveMonthsAgo) {
        setShowForm(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!client || !contracts?.HashGuardDAO) {
      setError("Client or contracts not initialized");
      onError?.("Client or contracts not initialized");
      return;
    }

    try {
      const tx = await new ContractExecuteTransaction()
        .setContractId(contracts.HashGuardDAO.address)
        .setFunction("setGuardianRules", [
          parseInt(formData.maxTransactionAmount * 1e8),
          parseInt(formData.dailyLimit * 1e8),
          parseInt(formData.transactionDelay),
          formData.whitelistedAddresses.split(",").map((addr) => addr.trim()),
        ])
        .setGas(300000)
        .execute(client);

      await tx.getReceipt(client);

      // Store submission timestamp
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
      setShowForm(false);
    } catch (error) {
      console.error("Failed to set guardian rules:", error);
      setError(error.message);
      onError?.(error.message);
    }
  };

  const resetRules = async () => {
    if (!client || !contracts?.HashGuardDAO) {
      setError("Client or contracts not initialized");
      return;
    }

    try {
      const tx = await new ContractExecuteTransaction()
        .setContractId(contracts.HashGuardDAO.address)
        .setFunction("resetRules", [])
        .setGas(100000)
        .execute(client);

      await tx.getReceipt(client);
      localStorage.removeItem(STORAGE_KEY);
      setShowForm(true);
      setFormData({
        maxTransactionAmount: "",
        dailyLimit: "",
        transactionDelay: "",
        whitelistedAddresses: "",
      });
    } catch (error) {
      console.error("Failed to reset rules:", error);
      setError(error.message);
    }
  };

  if (!showForm) {
    return (
      <div className="p-4 bg-gray-100 rounded">
        <p className="text-gray-700">
          Guardian rules have been set. Changes can be made after 12 months.
        </p>
        {client?.operatorAccountId === ADMIN_KEY && (
          <button
            onClick={resetRules}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reset Rules (Admin Only)
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Set Guardian Rules</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Max Transaction Amount (HBAR)
          </label>
          <input
            type="number"
            name="maxTransactionAmount"
            value={formData.maxTransactionAmount}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Daily Limit (HBAR)
          </label>
          <input
            type="number"
            name="dailyLimit"
            value={formData.dailyLimit}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Delay Between Transactions (seconds)
          </label>
          <input
            type="number"
            name="transactionDelay"
            value={formData.transactionDelay}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Whitelisted Addresses (comma-separated)
          </label>
          <textarea
            name="whitelistedAddresses"
            value={formData.whitelistedAddresses}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit Rules
        </button>
      </form>
    </div>
  );
}
