app.get("/", (req, res) => {
req.session.userData = {
userId: "123",
userName: "JohnDoe",
userType: "admin",
};

   <!-- If you comment out the userData, mySessions table would have no data, the reason is below:
   If you have an empty session object or there's no new data added to the session during a request,
   the session store may not initiate a storage operation(=may not save anything) because there's no new information to keep.
   So, when checking your MongoDB collection for session data, it's helpful to perform actions in your
   application that involve adding or modifying data in the session. -->

res.send("welcome to the session demo." + JSON.stringify(req.session));

});
