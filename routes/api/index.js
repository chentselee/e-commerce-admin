const express = require("express");
const router = express.Router();
const products = require("./products");
const categories = require("./categories");

const setHeader = (req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": [
      process.env.FRONTEND,
      process.env.BACKEND,
      "http://localhost:3000",
    ].join(","),
    "Access-Control-Allow-Headers": "content-type",
  });
  next();
};

router.use(setHeader);
router.use("/products", products);
router.use("/categories", categories);

module.exports = router;
