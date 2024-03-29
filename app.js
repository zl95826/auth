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
//app.use(express.static("public"));
app.use((req, res, next) => {
  console.log("Middleware Log:", req.session); // Log session before the route handler
  next();
});
app.get("/", (req, res) => {
  console.log("Session:");
  if (req.session.isAuth) {
    // console.log(req.session);
    return res.redirect("/dashboard");
  }
  res.sendFile("index.html", { root: "public" });
});
app.get("/register", (req, res) => {
  res.sendFile("register.html", { root: "public" });
});
app.post("/register", async (req, res) => {
  // console.log(req.body);
  const { username, password, email } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "Email alreay exists." });
  }
  const hashedPsw = await bcrypt.hash(password, 12);
  user = new User({ username, email, password: hashedPsw });
  await user.save();
  res.redirect("/login");
});
app.get("/login", (req, res) => {
  if (req.session.isAuth) {
    return res.redirect("/dashboard");
  }
  res.sendFile("login.html", { root: "public" });
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const errorMessage = "No such account existing, please register first.";
    return res.redirect(`/login?error=${errorMessage}`);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const errorMessage = "Password doesn't match.";
    return res.redirect(`/login?error=${errorMessage}`);
  }
  req.session.isAuth = true;
  res.redirect("/dashboard");
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
  //console.log(err);
  res.status(500).send("error happens");
});
app.listen(3000, () => {
  console.log("test session");
});
