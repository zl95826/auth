const express = require("express");
const session = require("express-session");
const env = require("dotenv");
const app = express();
env.config();
app.get("/", (req, res) => {
  res.end("welcome to the session demo.");
});
app.listen(3000, () => {
  console.log("test session");
});
