import { createContext, useState, useEffect, useCallback } from "react";
import { HashConnect, HashConnectConnectionState } from "hashconnect";
import { AccountId, TransferTransaction, LedgerId, Hbar } from "@hashgraph/sdk";
import { CONTRACTS } from "../utils/contracts";

const HederaContext = createContext();
let hashConnectInstance = null;

const APP_METADATA = {
  name: "Hashguard",
  description: "Security Layer for Hedera",
  icon: "https://www.hashpack.app/img/logo.svg",
  url: window.location.origin,
};

export { HederaContext };

export const HederaProvider = ({ children }) => {
  const [hashconnect, setHashconnect] = useState(null);
  const [state, setState] = useState(HashConnectConnectionState.Disconnected);
  const [pairingData, setPairingData] = useState(null);
  const [signer, setSigner] = useState(null);
  const [client, setClient] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);

  const setUpHashConnectEvents = useCallback((hcInstance) => {
    if (!hcInstance) return;

    hcInstance.connectionStatusChange.on((connectionStatus) => {
      setState(connectionStatus);
      if (connectionStatus === HashConnectConnectionState.Disconnected) {
        setPairingData(null);
        setSigner(null);
        setClient(null);
      }
    });

    hcInstance.pairingEvent.on((newPairing) => {
      setPairingData(newPairing);
      setError(null);
      const signerInstance = hcInstance.getSigner(newPairing.accountIds[0]);
      setSigner(signerInstance);
      setClient(signerInstance.client);
    });

    hcInstance.disconnectionEvent.on(() => {
      setPairingData(null);
      setSigner(null);
      setClient(null);
      setError(null);
    });
  }, []);

  // Initialize HashConnect
  useEffect(() => {
    const initHashConnect = async () => {
      if (hashConnectInstance || typeof window === "undefined") return;

      try {
        hashConnectInstance = new HashConnect(false);

        // Initialize with project ID
        await hashConnectInstance.init(APP_METADATA, "testnet", false, {
          projectId: "211fbb88841c26a16f0c2f72d87780fc",
          network: "testnet",
        });

        setUpHashConnectEvents(hashConnectInstance);
        setHashconnect(hashConnectInstance);
      } catch (err) {
        console.error("HashConnect init failed:", err);
        // Don't show error on initial load
      }
    };

    initHashConnect();

    return () => {
      if (hashConnectInstance) {
        hashConnectInstance.disconnect();
        hashConnectInstance = null;
      }
    };
  }, [setUpHashConnectEvents]);

  const connectWallet = async () => {
    if (!hashconnect || isPairingModalOpen) return;

    try {
      setIsInitializing(true);
      setIsPairingModalOpen(true);
      await hashconnect.openPairingModal();
    } catch (err) {
      console.error("Connection error:", err);
      setError("Failed to connect wallet");
    } finally {
      setIsPairingModalOpen(false);
      setIsInitializing(false);
    }
  };

  const disconnect = async () => {
    try {
      if (hashconnect) {
        await hashconnect.disconnect();
      }
    } catch (err) {
      console.error("Disconnection error:", err);
      setError("Failed to disconnect properly");
    }
  };

  const sendTransaction = async (recipientId, amount) => {
    if (!signer || !pairingData) throw new Error("Wallet not connected");

    try {
      setError(null);
      const fromAccount = pairingData.accountIds[0];
      const amountHbar = new Hbar(amount);

      const transaction = await new TransferTransaction()
        .addHbarTransfer(
          AccountId.fromString(fromAccount),
          amountHbar.negated()
        )
        .addHbarTransfer(AccountId.fromString(recipientId), amountHbar)
        .freezeWithSigner(signer);

      const response = await transaction.executeWithSigner(signer);
      const receipt = await response.getReceiptWithSigner(signer);

      const newTx = {
        id: receipt.transactionId.toString(),
        date: new Date().toISOString(),
        amount,
        sender: fromAccount,
        recipient: recipientId,
        status: receipt.status.toString(),
      };

      setTransactions((prev) => [newTx, ...prev]);
      return receipt;
    } catch (err) {
      console.error("Transaction failed:", err);
      setError(err.message || "Transaction failed");
      throw err;
    }
  };

  const contextValue = {
    state,
    pairingData,
    signer,
    client,
    error,
    isInitializing,
    connectWallet,
    disconnect,
    sendTransaction,
    getTransactions: () => transactions,
    contracts: CONTRACTS,
  };

  return (
    <HederaContext.Provider value={contextValue}>
      {children}
    </HederaContext.Provider>
  );
};
