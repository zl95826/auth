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
  collection: "passportSessions",
});
app.use(
  session({
    secret: process.env.SECRET, //secret is used to sign the session cookie
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 5,
    },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  console.log("Session:", req.session);
  res.sendFile("index.html", { root: "public" });
});
app.get("/register", (req, res) => {
  res.sendFile("register.html", { root: "public" });
});
app.post("/register", async (req, res) => {
  res.json({ text: "working" });
});
app.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "public" });
});
app.post("/login", async (req, res) => {
  res.json({ text: "working" });
});
const isAuth = (req, res, next) => {
  //a middleware to prevent visit without authentication to access the dashboard page
  req.session.isAuth ? next() : res.redirect("/login");
};
app.get("/dashboard", isAuth, (req, res) => {
  res.sendFile("dashboard.html", { root: "public" });
});
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
});
app.get("/logs", (req, res) => {
  res.json({ text: "Hello World" });
});
app.use((req, res, next) => {
  res.status(404).send("404 errors");
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("error happens");
});
app.listen(3000, () => {
  console.log("test session");
});
