const express = require('express');
const router = express.Router();
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getCategorySummary,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

// Apply the 'protect' middleware to all routes defined in this file.
// This is a clean way to protect a whole set of routes.
router.use(protect);

// Add this new route. A good place is right after the main '/'.
router.route('/summary').get(protect, getExpenseSummary);

// In backend/routes/expenseRoutes.js

// ... make sure getCategorySummary is imported from the controller

// Add this new route
router.route('/category-summary').get(protect, getCategorySummary);

// ... rest of your routes

// Chain .get() and .post() to the same URL ('/')
//In summary, this one line of code creates a complete and secure API endpoint. It tells your application: "When a GET request comes to /api/expenses/summary, first check if the user is authenticated. If they are, then run the logic to calculate and return their expense summary.
router.route('/').get(getExpenses).post(createExpense);

// Chain .put() and .delete() to the URL with an ID ('/:id')
router.route('/:id').put(updateExpense).delete(deleteExpense);

module.exports = router;

/*

Why this structure?

router.use(protect); is an efficient way to apply our security guard middleware to every single route in this file without repeating it for each one.

router.route(...) lets us chain multiple methods (GET, POST, PUT, DELETE) to the same URL path, which keeps our code organized and readable.

*/