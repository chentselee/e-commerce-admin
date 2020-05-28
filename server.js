const express = require("express");
const mongoose = require("mongoose");
const products = require("./routes/api/products");
const categories = require("./routes/api/categories");

const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect("mongodb://localhost/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("db connected"));

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("static"));
app.use("/products", products);
app.use("/categories", categories);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}...`));
