// backend/server.js

const express = require('express');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

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

*/