import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const searchHash = async (hash) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/search/${hash}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching hash data:", error);
    throw error;
  }
};

export const getRecentSearches = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/search/recent`);
    return res.data;
  } catch (error) {
    console.error("Error fetching recent searches:", error);
    return [];
  }
};
