const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  display_name: { type: String },
  path: { type: String, unique: true },
});

module.exports = mongoose.model("Category", categorySchema);
