const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  display_name: { type: String },
  path: { type: String, unique: true },
});

const Category = mongoose.model("Category", categorySchema);

const catergories = [
  { name: "phone", display_name: "手機", path: "phone" },
  { name: "tablet", display_name: "平板", path: "tablet" },
  { name: "laptop", display_name: "筆電", path: "laptop" },
];

catergories.forEach((category) => {
  Category.find({ name: category.name })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        return;
      } else {
        const newCategory = new Category({
          name: category.name,
          display_name: category.display_name,
          path: category.path,
        });
        newCategory.save((error) => {
          if (error) console.log(error);
        });
      }
    });
});

router.get("/", (req, res) => {
  Category.find()
    .select("-_id name display_name path")
    .sort("_id")
    .exec()
    .then((result) => {
      res
        .set({ "Access-Control-Allow-Origin": "http://localhost:8080" })
        .json(result);
    })
    .catch((error) => res.status(500).json({ msg: JSON.stringify(error) }));
});

module.exports = router;
