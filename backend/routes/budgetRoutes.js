// backend/routes/budgetRoutes.js

const express = require('express');
const router = express.Router();
const { setBudget, getBudgets } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

// Route to get all budgets for the current month
router.route('/').get(protect, getBudgets);

// Route to set or update a budget
router.route('/').post(protect, setBudget);

module.exports = router;

/*

outer.route('/').get(protect, getBudgets);
What it does: This line defines the route for getting the user's budgets.

router.route('/'): Targets the base URL, /api/budgets.

.get(...): Specifies that this rule applies only to HTTP GET requests.

protect: This is the first function to run. It acts as middleware to ensure the user is authenticated by checking their JWT.

getBudgets: This is the second function. It will only run if the protect middleware succeeds. Its job is to fetch the budget data from the database and send it back.

*/