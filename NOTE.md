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

The “done()” function is then used to pass the “{authenticated_user}” to the serializeUser() function. Note, the done(<err>, <user>) function in the “authUser” is passed as ,

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
