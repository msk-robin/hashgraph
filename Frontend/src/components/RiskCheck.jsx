import { useState } from "react";
import { useHedera } from "../contexts/useHedera";
import { ContractExecuteTransaction } from "@hashgraph/sdk";
import { analyzeTransaction } from "../utils/aiService";
import LoadingSpinner from "./LoadingSpinner";

export default function RiskCheck({ onError }) {
  const { client, contracts } = useHedera();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkRisk = async () => {
    setLoading(true);
    try {
      const txData = {
        recipient: address,
        amount: parseFloat(amount),
        timestamp: new Date().toISOString(),
      };

      // Get AI risk analysis
      const analysis = await analyzeTransaction(txData);
      setRiskAnalysis(analysis);

      // Submit to DAO if high risk
      if (analysis.overallRisk > 70) {
        const tx = await new ContractExecuteTransaction()
          .setContractId(contracts.DAO)
          .setFunction("submitDispute", [address, analysis.overallRisk])
          .setGas(200_000)
          .execute(client);

        await tx.getReceipt(client);
      }
    } catch (error) {
      console.error("Risk check failed:", error);
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="card bg-white shadow-xl p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Risk Assessment</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Account Address
          </label>
          <input
            type="text"
            placeholder="0.0.1234"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Transaction Amount (HBAR)
          </label>
          <input
            type="number"
            placeholder="0.00"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button
          onClick={checkRisk}
          disabled={!address || !amount || loading}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Check Risk
        </button>
      </div>

      {riskAnalysis && (
        <div className="mt-6 space-y-4">
          <div
            className={`p-4 rounded-md ${
              riskAnalysis.overallRisk > 70
                ? "bg-red-50 border-red-400"
                : riskAnalysis.overallRisk > 30
                  ? "bg-yellow-50 border-yellow-400"
                  : "bg-green-50 border-green-400"
            } border`}
          >
            <h3 className="text-lg font-semibold mb-2">
              Risk Analysis Results
            </h3>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span>Overall Risk:</span>
                <span
                  className={
                    riskAnalysis.overallRisk > 70
                      ? "text-red-600 font-bold"
                      : riskAnalysis.overallRisk > 30
                        ? "text-yellow-600 font-bold"
                        : "text-green-600 font-bold"
                  }
                >
                  {riskAnalysis.overallRisk}%
                </span>
              </p>
              <p className="flex justify-between">
                <span>Recommendation:</span>
                <span className="font-bold">{riskAnalysis.recommendation}</span>
              </p>
            </div>
          </div>

          {riskAnalysis.factors.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Risk Factors:</h4>
              <ul className="space-y-2">
                {riskAnalysis.factors.map((factor, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span>{factor.description}</span>
                    <span className="font-mono text-red-600">
                      +{factor.score}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
