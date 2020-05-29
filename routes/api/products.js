const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  created: { type: Date },
  image: Buffer,
});

const Product = mongoose.model("Product", productSchema);

const setHeader = (req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
  });
  next();
};

router.use(setHeader);

router.get("/", (req, res) => {
  if (req.query.hasOwnProperty("id")) {
    Product.findById(req.query.id)
      .select("category name price created")
      .exec()
      .then((result) => {
        res.json(result);
      })
      .catch((error) => res.status(500).json({ msg: error }));
  } else if (req.query.hasOwnProperty("category")) {
    Product.find({ category: req.query.category })
      .select("category name price created")
      .sort("name")
      .exec()
      .then((result) => {
        res.json(result);
      })
      .catch((error) => res.status(500).json({ msg: error }));
  } else {
    Product.find()
      .select("_id category name price created")
      .sort("name")
      .exec()
      .then((result) => {
        res.json(result);
      })
      .catch((error) => res.status(500).json({ msg: error }));
  }
});

router.post("/", (req, res) => {
  const newProduct = new Product({
    ...req.body,
    created: new Date(),
  });
  newProduct.save((error) => {
    if (error) {
      res.status(400).json({ msg: error });
    } else {
      res.end();
    }
  });
});

module.exports = router;
