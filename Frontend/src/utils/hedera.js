import { Client, ContractId } from "@hashgraph/sdk";

let client = null;

export const initClient = async () => {
  if (!client && window.hashpack) {
    const provider = window.hashpack.getProvider();
    const accountIds = await provider.request({ method: "connect" });
    client = Client.forTestnet().setSigner(provider.getSigner());
    return { client, accountId: accountIds[0] };
  }
  return { client, accountId: null };
};

export const contractConfig = {
  HashGuard: ContractId.fromString("0.0.1234"),
  HashGuardDAO: ContractId.fromString("0.0.5678"),
};

const getNetworkPrefix = () => {
  return import.meta.env.VITE_HEDERA_NETWORK || "testnet";
};

export const fetchAccountHistory = async (accountId) => {
  try {
    const network = getNetworkPrefix();
    const baseUrl =
      import.meta.env.VITE_HASHSCAN_API_URL || "https://api.hashscan.io/api/v1";

    // HashScan API endpoint
    const response = await fetch(
      `${baseUrl}/${network}/accounts/${accountId}/transactions?limit=100&order=desc`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from HashScan");
    }

    const data = await response.json();

    // Transform the data into our format
    return data.transactions.map((tx) => ({
      id: tx.transaction_id,
      timestamp: tx.consensus_timestamp,
      type: tx.name,
      amount:
        tx.transfers?.reduce(
          (acc, t) =>
            t.account === accountId ? acc + parseFloat(t.amount) : acc,
          0
        ) || 0,
      sender: tx.from || tx.payer_account_id,
      recipient: tx.to || accountId,
      status: tx.result,
      memo: tx.memo_base64 ? atob(tx.memo_base64) : "",
      explorerUrl: `${import.meta.env.VITE_HASHSCAN_EXPLORER_URL || "https://hashscan.io"}/${network}/transaction/${tx.transaction_id}`,
    }));
  } catch (error) {
    console.error("Error fetching account history:", error);
    throw error;
  }
};
