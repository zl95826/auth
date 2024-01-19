app.get("/", (req, res) => {
//req.session.userData = {
//userId: "123",
//userName: "JohnDoe",
//userType: "admin",
//};
res.send("welcome to the session demo." + JSON.stringify(req.session));

});
If you comment out the userData, mySessions table would have no data, the reason is below:
If you have an empty session object or there's no new data added to the session during a request,
the session store may not initiate a storage operation(=may not save anything) because there's no new information to keep.
So, when checking your MongoDB collection for session data, it's helpful to perform actions in your
application that involve adding or modifying data in the session.

When you click a button in an HTML page and want to trigger an HTTP event, you typically use JavaScript to make an HTTP request to a server.
The <b>fetch</b> function is a commonly used method in modern web development to make HTTP requests from the client-side (browser).
Fetch API mainly designed for Web brower.

"express.urlencoded middleware": This middleware is responsible for parsing incoming requests with URL-encoded payloads,
which includes form data submitted through HTML forms.
Without this middleware, req.body will be undefined for URL-encoded form data, as Express won't automatically parse the request body.
"express.urlencoded({ extended: true })": The extended: true option allows for parsing complex objects and arrays.

By using express.urlencoded, you enable Express to parse the form data sent in the request and populate <b>'req.body'</b> object with the parsed values.
This is essential for handling form submissions and extracting data from the submitted form fields.

When you submit a form with the <b>"GET"</b> method, the form data is appended to the URL in the form of query parameters.
The URL will look like this:<b>http://localhost:3000/register?name=ww&password=1233&email=z%40hotmail.com</b>
The form data is visible in the URL, making it easy to bookmark or share.

When you submit a form with the <b>"POST"</b> method, the form data is sent in the body of the HTTP request.
This method is often used for forms that may contain sensitive or large amounts of data, as the data is not exposed in the URL.
Form data submitted using the "POST" method doesn't appear in the URL, it's expected behavior.

When you submit a form with the <b>"POST"</b> method using the standard HTML form submission, the default content type is <b>application/x-www-form-urlencoded</b>.
This is the default behavior for HTML forms.when you submit the form, the data is sent in the body of the HTTP request with the
application/x-www-form-urlencoded content type. The data is encoded as key-value pairs separated by "&" symbols.
On the server side, you can use the express.urlencoded() middleware in Express to parse this type of data.

The express.json() middleware in Express is used to parse JSON-encoded request bodies.
If your client sends data using the "application/json" content type, you should use express.json() to parse that data on the server side. For example:
client-side:

<pre>
```javascript
fetch('/api/data', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({ key: 'value' }),
});
```
</pre>
