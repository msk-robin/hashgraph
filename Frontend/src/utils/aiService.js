import { ContractCallQuery } from "@hashgraph/sdk";

const RISK_FACTORS = {
  NEW_ACCOUNT: 20,
  HIGH_VALUE: 15,
  UNUSUAL_PATTERN: 25,
  KNOWN_SCAMMER: 100,
  SUSPICIOUS_ACTIVITY: 40,
};

export const analyzeTransaction = async (txData) => {
  try {
    // Analyze transaction patterns
    const riskFactors = [];
    let totalRisk = 0;

    // Check if recipient is a new account
    if (isNewAccount(txData.recipient)) {
      riskFactors.push({
        type: "NEW_ACCOUNT",
        score: RISK_FACTORS.NEW_ACCOUNT,
        description: "Recipient account is newly created",
      });
      totalRisk += RISK_FACTORS.NEW_ACCOUNT;
    }

    // Check for high-value transactions
    if (txData.amount > 1000) {
      riskFactors.push({
        type: "HIGH_VALUE",
        score: RISK_FACTORS.HIGH_VALUE,
        description: "High-value transaction detected",
      });
      totalRisk += RISK_FACTORS.HIGH_VALUE;
    }

    // Call external AI service for pattern analysis
    const aiAnalysis = await callExternalAI(txData);
    if (aiAnalysis.suspicious) {
      riskFactors.push({
        type: "UNUSUAL_PATTERN",
        score: RISK_FACTORS.UNUSUAL_PATTERN,
        description: aiAnalysis.reason,
      });
      totalRisk += RISK_FACTORS.UNUSUAL_PATTERN;
    }

    // Check known scammer list
    const isScammer = await checkScammerList(txData.recipient);
    if (isScammer) {
      riskFactors.push({
        type: "KNOWN_SCAMMER",
        score: RISK_FACTORS.KNOWN_SCAMMER,
        description: "Recipient is on known scammer list",
      });
      totalRisk += RISK_FACTORS.KNOWN_SCAMMER;
    }

    return {
      overallRisk: Math.min(totalRisk, 100),
      factors: riskFactors,
      timestamp: new Date().toISOString(),
      recommendation:
        totalRisk > 70 ? "BLOCK" : totalRisk > 30 ? "WARN" : "ALLOW",
    };
  } catch (error) {
    console.error("Risk analysis failed:", error);
    return {
      overallRisk: 0,
      factors: [],
      timestamp: new Date().toISOString(),
      recommendation: "ERROR",
      error: error.message,
    };
  }
};

// Helper functions
const isNewAccount = () => {
  // For now, mock the check. In production, this would check account creation date
  return Math.random() > 0.7;
};

const callExternalAI = async (txData) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_AI_SERVICE_URL + "/analyze",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txData),
      }
    );

    if (!response.ok) throw new Error("AI service failed");
    return response.json();
  } catch (error) {
    console.error("AI service error:", error);
    return { suspicious: false };
  }
};

const checkScammerList = async (accountId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/scammer-check/${accountId}`
    );
    if (!response.ok) throw new Error("Scammer check failed");
    const data = await response.json();
    return data.isScammer;
  } catch (error) {
    console.error("Scammer check failed:", error);
    return false;
  }
};

export const getRiskAssessment = async (address) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/risk-assessment/${address}`
    );
    if (!response.ok) throw new Error("Risk assessment failed");
    return response.json();
  } catch (error) {
    console.error("Risk assessment failed:", error);
    throw error;
  }
};
