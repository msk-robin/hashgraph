const axios = require("axios");

const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY;
const VIRUSTOTAL_API_URL = "https://www.virustotal.com/api/v3/files";

async function checkHashWithVirusTotal(hash) {
  try {
    const response = await axios.get(`${VIRUSTOTAL_API_URL}/${hash}`, {
      headers: { "x-apikey": VIRUSTOTAL_API_KEY },
    });

    const data = response.data.data;
    const stats = data.attributes.last_analysis_stats;
    const maliciousCount = stats.malicious || 0;
    const risk =
      maliciousCount > 10 ? "high" : maliciousCount > 0 ? "medium" : "low";

    return {
      data,
      hash,
      risk,
      details: data.attributes.type_description || "No description available",
    };
  } catch (error) {
    console.error("VirusTotal error:");
    if (error.response) {
      console.error("status", error.response.status);
      console.error("Data", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Message", error.message);
    }

    throw new Error("Error fetching VirusTotal data");
  }
}

module.exports = { checkHashWithVirusTotal };
