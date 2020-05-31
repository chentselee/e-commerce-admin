const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  created: { type: Date, required: true },
  updated: { type: Date },
  image: Buffer,
});

module.exports = mongoose.model("Product", productSchema);
