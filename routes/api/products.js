const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Category = require("./categories");

const productSchema = new mongoose.Schema({
  category: String,
  name: String,
  price: Number,
  image: Buffer,
});

const Product = mongoose.model("Product", productSchema);

const products = [
  { category: "phone", name: "iPhone 6", price: 5999 },
  { category: "phone", name: "iPhone 7", price: 7999 },
  { category: "phone", name: "iPhone 8", price: 9999 },
];

products.forEach((product) => {
  Product.find({ name: product.name })
    .exec()
    .then((data) => {
      if (data.length > 0) {
        return;
      } else {
        const newProduct = new Product({
          category: product.category,
          name: product.name,
          price: product.price,
        });
        newProduct.save((error) => {
          if (error) console.log(error);
        });
      }
    });
});

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
      .select("category name price")
      .exec()
      .then((result) => {
        res.json(result);
      })
      .catch((error) => res.status(500).json({ msg: error }));
  } else if (req.query.hasOwnProperty("category")) {
    Product.find({ category: req.query.category })
      .select("category name price")
      .sort("name")
      .exec()
      .then((result) => {
        res.json(result);
      })
      .catch((error) => res.status(500).json({ msg: error }));
  } else {
    Product.find()
      .select("_id category name price")
      .sort("name")
      .exec()
      .then((result) => {
        res.json(result);
      })
      .catch((error) => res.status(500).json({ msg: error }));
  }
});

module.exports = router;
