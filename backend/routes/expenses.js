const express = require('express');
const router = express.Router();
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

// Apply the 'protect' middleware to all routes defined in this file.
// This is a clean way to protect a whole set of routes.
router.use(protect);

// Chain .get() and .post() to the same URL ('/')
router.route('/').get(getExpenses).post(createExpense);

// Chain .put() and .delete() to the URL with an ID ('/:id')
router.route('/:id').put(updateExpense).delete(deleteExpense);

module.exports = router;

/*

Why this structure?

router.use(protect); is an efficient way to apply our security guard middleware to every single route in this file without repeating it for each one.

router.route(...) lets us chain multiple methods (GET, POST, PUT, DELETE) to the same URL path, which keeps our code organized and readable.

*/