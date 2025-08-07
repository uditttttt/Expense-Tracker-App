// backend/controllers/expenseController.js

const Expense = require('../models/Expense');

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
exports.createExpense = async (req, res) => {
  const { description, amount, category, date } = req.body;

  if (!description || !amount || !category || !date) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const expense = await Expense.create({
      description,
      amount,
      category,
      date,
      user: req.user.id,
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all expenses for the logged-in user
// @route   GET /api/expenses
// @access  Private
// Make sure this function is defined and exported correctly
exports.getExpenses = async (req, res) => {
  res.send('Get all expenses placeholder');
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
// Make sure this function is defined and exported correctly
exports.updateExpense = async (req, res) => {
  res.send(`Update expense ${req.params.id} placeholder`);
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
// Make sure this function is defined and exported correctly
exports.deleteExpense = async (req, res) => {
  res.send(`Delete expense ${req.params.id} placeholder`);
};

/*

Code Breakdown:

user: req.user.id: This is the most important line. Remember how our protect middleware found the user and attached them to the request object? This is where we use that information to link the new expense directly to the logged-in user

*/