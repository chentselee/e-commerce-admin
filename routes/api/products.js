const express = require("express");
const router = express.Router();
const Product = require("../../models/products");

const fields = ["category", "name", "price", "created", "updated"].join(" ");

router.get("/", (req, res) => {
  if (req.query.hasOwnProperty("id")) {
    Product.findById(req.query.id)
      .select(fields)
      .populate("category", "-__v")
      .exec()
      .then((result) => {
        res.json(result);
      })
      .catch((error) => res.status(500).json({ msg: error }));
  } else if (req.query.hasOwnProperty("category")) {
    Product.find({ category: req.query.category })
      .select(fields)
      .populate("category", "-__v")
      .sort("name")
      .exec()
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  } else if (req.query.hasOwnProperty("name")) {
    Product.find({ name: req.query.name })
      .select(fields)
      .populate("category", "-__v")
      .sort("name")
      .exec()
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  } else {
    Product.find()
      .select(`_id ${fields}`)
      .populate("category", "-__v")
      .sort("name")
      .exec()
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
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
      res.sendStatus(201);
    }
  });
});

router.patch("/", (req, res) => {
  const { id, ...updatedProduct } = req.body;
  Product.updateOne({ _id: id }, { ...updatedProduct, updated: new Date() })
    .exec()
    .then((result) => {
      if (result.ok !== 1) {
        res.sendStatus(500);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

router.delete("/", (req, res) => {
  Product.deleteOne({ _id: req.body.id })
    .exec()
    .then((result) => {
      if (result.ok !== 1) {
        res.sendStatus(500);
      } else {
        res.json({ deletedCount: result.deletedCount });
      }
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

module.exports = router;
