const express = require("express");
const { checkHashWithVirusTotal } = require("../services/virusTotal");
const router = express.Router();

router.post("/", async (req, res) => {
  console.log("Received request:", req.body); //debuging
  const { hash } = req.body;
  if (!hash) {
    return res.status(400).json({ error: "Hash is required" });
  }
  try {
    const result = await checkHashWithVirusTotal(hash);
    console.log("Got result from VirusTotal:", result); //debuging
    res.json(result);
  } catch (error) {
    console.error("VirusTotal error:", error.message); //debuging
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

//test hash " fb55414848281f8064858ce188c3dc659d129e283bd62d58d34f6e6f568feab37 "
