// backend/controllers/budgetController.js

const Budget = require('../models/Budget');

// @desc    Set or update a budget for a category and month
// @route   POST /api/budgets
// @access  Private
exports.setBudget = async (req, res) => {
  const { category, limit, month } = req.body; // Expecting month in "YYYY-MM" format

  if (!category || limit === undefined || !month) {
    return res.status(400).json({ message: 'Please provide category, limit, and month' });
  }

  if (typeof limit !== 'number' || limit < 0) {
    return res.status(400).json({ message: 'Limit must be a non-negative number' });
  }

  try {
    // Find a budget for this user, category, and month, and update it.
    // If it doesn't exist, create it (thanks to 'upsert: true').
    const budget = await Budget.findOneAndUpdate(
      { user: req.user.id, category, month },
      { limit },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all budgets for the logged-in user for the current month
// @route   GET /api/budgets
// @access  Private
exports.getBudgets = async (req, res) => {
  try {
    // Get current month in "YYYY-MM" format
    const today = new Date();
    // Pad the month with a leading zero if it's a single digit (e.g., 8 -> 08)
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const currentMonth = `${today.getFullYear()}-${month}`;

    const budgets = await Budget.find({
      user: req.user.id,
      month: currentMonth,
    });

    res.status(200).json(budgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/*

Lines 37-40: Formatting the Current Month
const today = new Date();: Gets the current date.

const month = (today.getMonth() + 1).toString().padStart(2, '0');: This line formats the month correctly.

today.getMonth() + 1: getMonth() is zero-indexed (0=January), so we add 1.

.toString(): Converts the number to a string.

.padStart(2, '0'): This is a JavaScript string method that ensures the string is 2 characters long. If it's only one character (like "8" for August), it will add a "0" to the start, making it "08".

**const currentMonth = \today.getFullYear()−{month}`;**: This uses a template literal to combine the year and the formatted month into the "YYYY-MM"string format that you're storing in the database (e.g.,"2025-08"`).

*/