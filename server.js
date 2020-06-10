const express = require("express");
const mongoose = require("mongoose");
const api = require("./routes/api/index");

const app = express();
const PORT = process.env.PORT || 8000;
const DB = process.env.DB || "mongodb://localhost/test";

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("db connected"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));
app.use("/", api);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}...`));
