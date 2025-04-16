import React, { useState, useEffect } from "react";
import { HashConnect, HashConnectConnectionState } from "hashconnect";
import { AccountId, TransferTransaction, LedgerId, Hbar } from "@hashgraph/sdk";

const TransactionForm = ({ onSend, onCancel }) => {
  const [recipientId, setRecipientId] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSend(recipientId, parseFloat(amount));
      setRecipientId("");
      setAmount("");
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute right-0 top-12 mt-2 w-96 bg-white rounded-lg shadow-xl p-6 z-50">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            Recipient ID
          </label>
          <input
            type="text"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            placeholder="0.0.1234"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base p-2"
            required
          />
        </div>
        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            Amount (HBAR)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.00000001"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base p-2"
            required
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};

const HederaConnectButton = () => {
  const [hashconnect, setHashconnect] = useState(null);
  const [connectionState, setConnectionState] = useState(
    HashConnectConnectionState.Disconnected
  );
  const [pairingData, setPairingData] = useState(null);
  const [showTransferForm, setShowTransferForm] = useState(false);

  // Initialize HashConnect
  useEffect(() => {
    const appMetadata = {
      name: "Hashguard",
      description: "Hashguard test case",
      icons: [
        "https://images.unsplash.com/photo-1496200186974-4293800e2c20?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9nb3xlbnwwfHwwfHx8MA%3D%3D",
      ],
      url: "localhost",
    };

    const hashconnectInstance = new HashConnect(
      LedgerId.TESTNET,
      "211fbb88841c26a16f0c2f72d87780fc",
      appMetadata,
      true
    );
    setHashconnect(hashconnectInstance);

    hashconnectInstance.init().then(() => {
      setUpHashConnectEvents(hashconnectInstance);
    });

    return () => {
      if (hashconnectInstance) {
        hashconnectInstance.disconnect();
      }
    };
  }, []);

  const setUpHashConnectEvents = (hashconnectInstance) => {
    hashconnectInstance.pairingEvent.on((newPairing) => {
      setPairingData(newPairing);
    });

    hashconnectInstance.disconnectionEvent.on(() => {
      setPairingData(null);
      setShowTransferForm(false);
    });

    hashconnectInstance.connectionStatusChangeEvent.on((status) => {
      setConnectionState(status);
    });
  };

  const handleConnect = async () => {
    if (!hashconnect) return;

    // Open pairing modal - removed custom styling to match working implementation
    hashconnect.openPairingModal();
  };

  const handleDisconnect = () => {
    if (hashconnect) {
      hashconnect.disconnect();
      setPairingData(null);
      setShowTransferForm(false);
      setConnectionState(HashConnectConnectionState.Disconnected);
    }
  };

  const handleSendTransaction = async (recipientId, amount) => {
    if (!pairingData) return;

    try {
      const accountId = AccountId.fromString(pairingData.accountIds[0]);
      const signer = hashconnect.getSigner(accountId);

      // Convert amount to tinybar (1 HBAR = 100,000,000 tinybar)
      const amountHbar = new Hbar(amount);

      const transaction = new TransferTransaction()
        .setMaxTransactionFee(new Hbar(1)) // Set max transaction fee to 1 HBAR
        .addHbarTransfer(accountId, amountHbar.negated()) // Negative amount for sender
        .addHbarTransfer(AccountId.fromString(recipientId), amountHbar); // Positive amount for recipient

      const frozenTx = await transaction.freezeWithSigner(signer);
      const response = await frozenTx.executeWithSigner(signer);
      const receipt = await response.getReceiptWithSigner(signer);

      console.log("Transaction successful:", receipt);
      setShowTransferForm(false);
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  };

  return (
    <div className="relative inline-flex items-center">
      {(connectionState === HashConnectConnectionState.Disconnected ||
        !pairingData) && (
        <button
          onClick={handleConnect}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Connect Wallet
        </button>
      )}

      {connectionState === HashConnectConnectionState.Paired && pairingData && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600 font-medium">
              Connected to {pairingData?.metadata?.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTransferForm(!showTransferForm)}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send HBAR
            </button>
            <button
              onClick={handleDisconnect}
              className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {showTransferForm &&
        connectionState === HashConnectConnectionState.Paired && (
          <TransactionForm
            onSend={handleSendTransaction}
            onCancel={() => setShowTransferForm(false)}
          />
        )}
    </div>
  );
};

export default HederaConnectButton;
