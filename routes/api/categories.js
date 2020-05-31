const express = require("express");
const router = express.Router();
const Category = require("../../models/categories");

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
