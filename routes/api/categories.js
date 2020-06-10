const express = require("express");
const router = express.Router();
const Category = require("../../models/categories");

router.get("/", (req, res) => {
  Category.find()
    .select("name display_name")
    .populate("num_products")
    .sort("_id")
    .exec()
    .then((result) => {
      res.set({ "Access-Control-Allow-Origin": "*" }).json(result);
    })
    .catch((error) => res.status(500).json({ msg: JSON.stringify(error) }));
});

router.post("/", (req, res) => {
  const newCategory = new Category(req.body);
  newCategory.save((error) => {
    if (error) {
      res.status(400).json({ msg: error });
    } else {
      res.sendStatus(201);
    }
  });
});

module.exports = router;
