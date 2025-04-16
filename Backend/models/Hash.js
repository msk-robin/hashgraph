const mongoose = require("mongoose");

const HashSchema = new mongoose.Schema({
  hash: { type: String, required: true, unique: true },
  risk: { type: String, required: true },
  details: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Hash", HashSchema);
