// backend/routes/auth.js
const express = require('express');
const router = express.Router();

// Import the controller functions
const { registerUser, loginUser } = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware'); // 1. Import middleware

router.post('/register', registerUser);
router.post('/login', loginUser);

// 2. Add the new protected route
// When a request hits this URL, it will first go through 'protect',
// and only if that succeeds will it run the final (req, res) function.
router.get('/me', protect, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;

/*

Why this code?

express.Router() creates a special router object that we can attach routes to.

We import our controller functions.

router.post('/register', registerUser); tells the router: "When you receive a POST request at the /register path, execute the registerUser function."


*/