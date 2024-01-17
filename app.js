const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const app = express();

require("dotenv").config();
mongoose
  .connect(process.env.MONGODBURL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req, res) => {
  res.end("welcome to the session demo.");
});
app.listen(3000, () => {
  console.log("test session");
});
