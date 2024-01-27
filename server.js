const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");

const User = require("./Models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const app = express();
require("dotenv").config();
const saltRounds = 10;
mongoose
  .connect(process.env.MONGODBURL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(
  session({
    secret: process.env.SECRET, //secret is used to sign the session cookie
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    cookie: {
      maxAge: 1000 * 60 * 5,
    },
  })
); //This is the basic express session({..}) initialization.
// "express-session" creates a "req.session" object,
// when it is invoked via app.use(session({..}))
const authUser = async (username, password, done) => {
  console.log(username, password);
  try {
    const auth_user = await User.findOne({ email: username });
    if (!auth_user) return done(null, false, { message: "wrong email" });
    else {
      const isMatch = await bcrypt.compare(password, auth_user.password);
      if (isMatch) return done(null, auth_user);
      else return done(null, false, { message: "wrong password" });
    }
  } catch (error) {
    console.log(error);
    return done(error);
  }
};
app.use(passport.initialize()); // init passport on every route call.
app.use(passport.session()); // allow passport to use "express-session".
// "passport" then adds an additional object "req.session.passport" to this "req.session".
passport.use(new LocalStrategy(authUser));
// Use Passport to define the Authentication Strategy
// The "authUser" is a function that we will define later will contain the steps
// to authenticate a user, and will return the "authenticated user".
passport.serializeUser((userObj, done) => {
  console.log(`--------> Serialize User`);
  console.log(userObj);
  done(null, userObj);
});
passport.deserializeUser((obj, done) => {
  console.log("---------> Deserialize Id");
  console.log(obj);

  done(null, obj);
});
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
  res.sendFile("login-passport.html", { root: "public" });
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);
// The ‘local’ signifies that we are using ‘local’ strategy.
// If you were using google or facebook to authenticate,
// it would say ‘google’ or ‘facebook’ instead of ‘local’.
const isAuth = (req, res, next) => {
  // Use the “req.isAuthenticated()” function to protect logged in routes
  // Passport JS conveniently provides a “req.isAuthenticated()” function, that
  // returns “true” in case an authenticated user is present in
  // “req.session.passport.user”, or
  // returns “false” in case no authenticated user is present in
  // “req.session.passport.user”.
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
};
app.get("/dashboard", isAuth, (req, res) => {
  res.sendFile("dashboard.html", { root: "public" });
});
app.post("/logout", (req, res) => {
  // Passport JS also conveniently provides us with a “req.logOut()” function,
  // which when called clears the “req.session.passport” object and
  // removes any attached params.
  req.logOut((err) => {
    if (err) return next(err);
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
