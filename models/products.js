const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  created: { type: Date, required: true },
  updated: { type: Date },
});

module.exports = mongoose.model("Product", productSchema);
