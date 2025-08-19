// backend/server.js

const express = require('express');
const cors = require('cors'); // 1. Import the cors package
require('dotenv').config();

const budgetRoutes = require('./routes/budgetRoutes'); // 1. IMPORT the new routes

const connectDB = require('./config/db');

const app = express();

app.use(cors()); // 2. Add the cors middleware HERE

connectDB(); // Call the function to connect to the database

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

// A simple test route to make sure the server is working
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running!');
});

// Mount the authentication routes
app.use('/api/auth', require('./routes/auth'));
// Mount the expense routes
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/budgets', budgetRoutes); // 2. USE the new routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


/*

const express = require('express'); imports the Express library.

require('dotenv').config(); loads the dotenv library so we can use environment variables later.

const app = express(); creates our main application object. We'll use this app object to define routes and configure our server.

const PORT = ... sets the port for our server. It defaults to 5000, a common port for local development.

app.get('/', ...) defines our very first route. It tells the server: "When someone makes a GET request to the base URL (/), send back the text 'Expense Tracker API is running!'."

app.listen(PORT, ...) tells our application to start listening for requests on the specified port. The message will be printed to our terminal to let us know it's ready.

Why the new code?

app.use(express.json()): This is crucial middleware. It tells Express to parse the body of incoming requests as JSON. Without this, we wouldn't be able to read the data a user sends from a form (like their email and password).

app.use('/api/auth', ...): This "mounts" our auth router. It tells our main app: "For any URL that starts with /api/auth, pass the request over to our auth.js route file to handle it."

What does app.use(cors()) do?
It automatically adds the necessary Access-Control-Allow-Origin headers to every response from your backend, effectively telling the browser, "It's okay, I trust requests coming from other origins."

 Understanding the CORS Error (The Main Problem)
Think of your browser as a security guard for your computer.

Your frontend is running on one "address": http://localhost:5173.

Your backend is running on a different "address": http://localhost:5000.

For security reasons, browsers enforce a "Same-Origin Policy". This means by default, a website from one origin (your frontend address) is not allowed to make requests to another origin (your backend address). This prevents malicious websites from making requests to your bank's API on your behalf, for example.

The error message: Access to XMLHttpRequest ... has been blocked by CORS policy is your browser's security guard telling you:

"Hey, the code at localhost:5173 tried to talk to localhost:5000, but the server at localhost:5000 never gave me permission to allow this connection. So, for your safety, I blocked the request."

CORS stands for Cross-Origin Resource Sharing. It's the mechanism that allows a server to relax the Same-Origin Policy and give permission to specific origins. Our backend server is just missing this permission slip right now.

## Understanding the Second Error (TypeError)
The second error, Cannot read properties of undefined (reading 'data'), is a direct symptom of the first CORS error.

Your catch block in RegisterPage.jsx expects to get an error response from the server, so it tries to read error.response.data. However, because the CORS error blocked the request at the browser level, the request never even reached the server, and no response was ever sent back. Therefore, error.response is undefined, and trying to read .data from undefined causes the TypeError.

Once we fix the CORS error, this second error will disappear automatically.

## The Solution: Enable CORS on Your Backend
The fix is simple and happens entirely on your backend. We need to tell our Express server to send the correct permission headers. You've already installed the package for this (cors); we just need to use it.

Open your backend/server.js file.

Import the cors package at the top.

Tell your Express app to use the cors middleware. This should be done before you define your routes.

*/