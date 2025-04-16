export const CONTRACTS = {
  HashGuard: {
    address: "0.0.1234", // test contract ID
    abi: [
      "function setPolicy(uint256 spendingLimit, uint256 dailyLimit, address[] whitelist)",
      "function validateTransaction(address user, uint256 amount, address recipient) view returns (bool)",
      "function updateRiskScore(address target, uint256 score)",
      "event PolicyUpdated(address indexed user)",
    ],
  },
  HashGuardDAO: {
    address: "0.0.5678", // test contract ID
    abi: [
      "function submitDispute(address target, uint256 proposedScore)",
      "function vote(address target, bool approve)",
      "event DisputeCreated(address indexed target, uint256 proposedScore)",
    ],
  },
};

export const HTS_TOKEN = {
  address: "0.0.5812216", // DAO Token ID
  decimals: 8,
};

// src/utils/contracts.js
export const getContractId = (name) => {
  const envVar = import.meta.env[`VITE_${name.toUpperCase()}_CONTRACT_ID`];
  if (!envVar) throw new Error(`Missing contract ID for ${name}`);
  return getContractId.fromString(envVar);
};
