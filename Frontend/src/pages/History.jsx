import { useHedera } from "../contexts/useHedera";
import { useState, useEffect } from "react";
import { fetchAccountHistory } from "../utils/hedera";
import LoadingSpinner from "../components/LoadingSpinner";

export default function History() {
  const { pairingData } = useHedera();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        if (!pairingData?.accountIds?.[0]) {
          setError("Please connect your wallet to view transaction history");
          return;
        }

        const history = await fetchAccountHistory(pairingData.accountIds[0]);
        setTransactions(history);
        setError(null);
      } catch (err) {
        setError("Failed to load transaction history. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
    // Set up polling for updates every 30 seconds
    const interval = setInterval(loadHistory, 30000);
    return () => clearInterval(interval);
  }, [pairingData]);

  const handleViewDetails = (tx) => {
    setSelectedTx(tx);
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <div className="text-sm text-gray-600">
          Account: {pairingData?.accountIds?.[0]}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-left">To/From</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">
                  {new Date(Number(tx.timestamp) * 1000).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {tx.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {(tx.amount / 100_000_000).toFixed(8)} ℏ
                </td>
                <td className="px-6 py-4 font-mono text-sm">
                  {tx.sender === pairingData?.accountIds?.[0] ? tx.recipient : tx.sender}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded ${
                    tx.status === 'SUCCESS'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(tx)}
                      className="text-blue-600 hover:underline"
                    >
                      Details
                    </button>
                    <a
                      href={tx.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      HashScan ↗
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTx && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
            <dl className="grid grid-cols-2 gap-4">
              <dt className="font-semibold">Transaction ID</dt>
              <dd className="font-mono text-sm break-all">{selectedTx.id}</dd>
              <dt className="font-semibold">Date</dt>
              <dd>{new Date(Number(selectedTx.timestamp) * 1000).toLocaleString()}</dd>
              <dt className="font-semibold">Type</dt>
              <dd>{selectedTx.type}</dd>
              <dt className="font-semibold">Amount</dt>
              <dd>{(selectedTx.amount / 100_000_000).toFixed(8)} ℏ</dd>
              <dt className="font-semibold">From</dt>
              <dd className="font-mono text-sm break-all">{selectedTx.sender}</dd>
              <dt className="font-semibold">To</dt>
              <dd className="font-mono text-sm break-all">{selectedTx.recipient}</dd>
              <dt className="font-semibold">Status</dt>
              <dd>
                <span className={`px-2 py-1 rounded ${
                  selectedTx.status === 'SUCCESS'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedTx.status}
                </span>
              </dd>
              {selectedTx.memo && (
                <>
                  <dt className="font-semibold">Memo</dt>
                  <dd>{selectedTx.memo}</dd>
                </>
              )}
              <dt className="font-semibold">View in Explorer</dt>
              <dd>
                <a
                  href={selectedTx.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View on HashScan ↗
                </a>
              </dd>
            </dl>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
