const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const mongoDBSession = require("connect-mongodb-session")(session);
const User = require("./Models/User");
const bcrypt = require("bcrypt");
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
const sessionStore = new mongoDBSession({
  uri: process.env.MONGODBURL,
  databaseName: "Auth",
  collection: "mySessions",
});
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 5,
    },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});
app.get("/register", (req, res) => {
  res.sendFile("register.html", { root: "public" });
});
app.post("/register", async (req, res) => {
  console.log(req.body);
  const { username, password, email } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/register");
  }
  const hashedPsw = await bcrypt.hash(password, 12);
  user = new User({ username, email, password: hashedPsw });
  await user.save();
  res.redirect("/log");
});
app.get("/log", (req, res) => {
  res.sendFile("log.html", { root: "public" });
});
app.get("/logs", (req, res) => {
  res.json({ text: "Hello World" });
});
app.use((req, res, next) => {
  res.status(404).send("404 errors");
});
app.listen(3000, () => {
  console.log("test session");
});
