const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const mongoDBSession = require("connect-mongodb-session")(session);
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
app.use(express.static("public"));
app.get("/", (req, res) => {
  //   req.session.userData = {
  //     userId: "123",
  //     userName: "JohnDoe",
  //     userType: "admin",
  //   };
  // comment out the userData, mySessions table would have no data
  // If you have an empty session object or there's no new data added to the session during a request,
  // the session store may not initiate a storage operation(=may not save anything) because there's no new information to keep.
  // So, when checking your MongoDB collection for session data, it's helpful to perform actions in your
  // application that involve adding or modifying data in the session.

  // res.send("welcome to the session demo." + JSON.stringify(req.session));
  res.sendFile("index.html", { root: "public" });
});
app.listen(3000, () => {
  console.log("test session");
});
