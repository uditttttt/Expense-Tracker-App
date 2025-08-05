// backend/routes/auth.js
const express = require('express');
const router = express.Router();

// Import the controller functions
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;

/*

Why this code?

express.Router() creates a special router object that we can attach routes to.

We import our controller functions.

router.post('/register', registerUser); tells the router: "When you receive a POST request at the /register path, execute the registerUser function."


*/