import axios from 'axios';

// This will automatically switch between your development and production URLs
const API_URL = import.meta.env.VITE_API_URL;

// Create a pre-configured instance of axios
const api = axios.create({
  baseURL: API_URL,
});

export default api;

/*

Why? This creates a special axios instance that already knows our backend's address. Now, instead of typing the full URL for every request, we can just use api.post('/auth/register').

: The Full Workflow - From Frontend Click to Backend Database
Let's follow the complete journey of the data when a user fills out the registration form and clicks "Sign Up".

In the Frontend (React - RegisterPage.jsx)
User Fills Form: The user types their name, email, and password. The formData state in your RegisterPage component updates with every keystroke.

User Clicks "Sign Up": This triggers the handleSubmit function.

API Call is Made: Inside handleSubmit, you'll eventually have a line that calls your pre-configured Axios instance:

JavaScript

// This call is made from your RegisterPage component
api.post('/auth/register', formData);
Axios Constructs the URL: Your api.js file takes the relative path '/auth/register' and combines it with its baseURL (http://localhost:5000/api/).

Final URL: http://localhost:5000/api/auth/register

Request is Sent: Axios creates an HTTP POST request with this full URL and bundles the formData object into the request's body as JSON. The browser then sends this request over the network.

In the Backend (Node.js / Express)
Server Receives Request: Your Express server running on port 5000 catches the incoming POST request.

Middleware Runs (server.js):

The express.json() middleware sees the JSON data in the request body and parses it, making it available as req.body.

Routing Begins (server.js):

The server looks at the URL path: /api/auth/register.

It finds this line: app.use('/api/auth', require('./routes/auth'));

The path matches! Express now hands off the request to the router defined in ./routes/auth.js.

Specific Route is Found (auth.js):

The auth router looks at the rest of the path: /register.

It finds this line: router.post('/register', registerUser);

It matches! The router knows it needs to execute the registerUser function.

Controller Logic Runs (authController.js):

The registerUser function is now executed.

It gets the req object (which contains req.body with the user's data) and the res object.

It performs all the logic: checks if the user exists, hashes the password, and finally uses the User model to save the new user to the MongoDB database.

JavaScript

// Inside authController.js
await user.save(); // Data is now in the database!
The Response Journey Back
Response is Sent: After successfully saving the user, the registerUser controller sends back a success response (e.g., res.status(201).json({ token });).

Frontend Receives Response: The api.post(...) call in your React component receives this response. You can use a .then() block or await to handle this response, for example, by saving the token and redirecting the user to the dashboard.

This entire flow ensures that data travels securely and predictably from the user's browser all the way to your database.

*/
