It is important to understand that the Passport JS framework, consists of 2 separate libraries.

The first is the main “Passport JS” library, and the second is the relevant “strategy” library.

<b>The primary “Passport JS” library is always required, and is used to maintain session information for authenticated users</b> (i.e. you will import this library irrespective of the type of “Strategy” that you will use to authenticate the user).
<b>The secondary “strategy” library is dependent on the methodology you plan use to authenticate a user. </b>eg. “passport-local”, “passport-facebook”, “passport-oauth-google” etc.

The Passport JS framework abstracts the Login process into 2 separate parts, the <b>“session management”</b> (done by the “Passport JS library” ), and the <b>“authentication”</b> (done by the secondary “Strategy” library eg. “passport-local” or “passport-facebook” or “passport-oauth-google” etc.)

#### line 35 in server.js

The “authUser” function is a callback function that is required within the LocalStrategy, and can takes three arguments.
The “user” and “password” are populated from the “req.body.username” and “req.body.password”. These can be used to search the DB to find and authenticate the username/password that was entered in the “login” form.

```javascript
authUser = (user, password, done) => {
  //Search the user, password in the DB to authenticate the user
  //Let's assume that a search within your DB returned the username and password match for "Kyle".
  let authenticated_user = { id: 123, name: "Kyle" };
  return done(null, authenticated_user);
};
```

The “done()” function is then used to pass the “{authenticated_user}” to the serializeUser() function. Note, the done(<err>, <user>) function in the “authUser” is passed as,

1. If the user not found in DB, <b>done (null, false)</b>
1. If the user found in DB, but password does not match, <b>done (null, false)</b>
1. If user found in DB and password match, <b>done (null, {authenticated_user})</b>

- if user not found,
  done( <no error> so null, <no matching user> so false),
- if user found but password does not match,
  done ( <no error> so null, <no matching user> so false)
- if user found and password matches, we found our authenticated user and
  done ( <no error> so null, <pass authenticated user to serializeUser()>)

https://medium.com/@prashantramnyc/node-js-with-passport-authentication-simplified-76ca65ee91e5

```javascript
passport.use(new LocalStrategy(authUser));
```

In this line, you are configuring Passport to use the LocalStrategy for authentication, and you're providing the authUser function as the callback that will be invoked during the authentication process.

```javascript
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);
```

When a POST request is made to the "/login" endpoint, Passport triggers the authentication process using the <b>LocalStrategy</b>. The <b>authUser</b> function is called during this process to verify the user's credentials.

- If authentication is successful, the user is redirected to "/dashboard" <b>(successRedirect).</b>
- f authentication fails, the user is redirected back to "/login" <b>(failureRedirect).</b>

1. Session Serialization: When a user logs in, you typically want to store some identifier (like user ID) in the session to uniquely identify the user. serializeUser defines how this user identifier is stored.
1. Session Deserialization: When a user makes subsequent requests, the stored user identifier in the session needs to be used to fetch the user's full information (e.g., from a database). deserializeUser defines how this retrieval process is done.
