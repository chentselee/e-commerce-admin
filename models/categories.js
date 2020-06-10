const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    display_name: { type: String, required: true },
  },
  { toJSON: { virtuals: true } }
);

categorySchema.virtual("num_products", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
  count: true,
});

module.exports = mongoose.model("Category", categorySchema);
