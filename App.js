const express = require("express");
const app = express();
const Router = require("./Router");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to database"));
mongoose.connect("mongodb://127.0.0.1:27017/POC")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", Router);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
