// backend/controllers/expenseController.js

const Expense = require('../models/Expense');

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
exports.createExpense = async (req, res) => {
    const { description, amount, category } = req.body; // <-- Removed 'date'

    if (!description || !amount || !category) { // <-- Removed '!date'
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const expense = await Expense.create({
            description,
            amount,
            category,
            // The date will be added by the model's default value
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
  try {
    // Find all expenses in the database that have a 'user' field matching
    // the logged-in user's ID. Sort them by date, newest first.
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
// Make sure this function is defined and exported correctly
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Authorization Check: Ensure the logged-in user owns the expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // This option returns the updated document
    );

    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
// Make sure this function is defined and exported correctly
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Authorization check (same as update)
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({ id: req.params.id, message: 'Expense removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/*

Code Breakdown:

user: req.user.id: This is the most important line. Remember how our protect middleware found the user and attached them to the request object? This is where we use that information to link the new expense directly to the logged-in user

Code Breakdown:

Expense.find({ user: req.user.id }): This is the core of the function.

.find() is the Mongoose method to retrieve documents.

The object { user: req.user.id } is a query filter. It tells Mongoose: "Don't just give me all expenses; only give me the ones where the user field matches the ID of the user making this request."

.sort({ date: -1 }): This is an optional but very useful addition. It sorts the results by the date field in descending order (-1), ensuring the most recent expenses are always at the top of the list.

Code Breakdown:

Expense.findById(req.params.id): We first find the expense by the ID passed in the URL.

if (expense.user.toString() !== req.user.id): This is the crucial authorization check. We compare the user ID stored on the expense with the ID of the user making the request (from our protect middleware). If they don't match, we deny access with a 401 Unauthorized status.

Expense.findByIdAndUpdate(): This Mongoose method finds the document and updates it with the new data from req.body. The { new: true } option ensures it returns the modified document.

Code Breakdown:

The find and authorization logic is identical to the update function.

await Expense.findByIdAndDelete(req.params.id): This Mongoose method finds the matching document and removes it from the database.

We send back the ID of the deleted item so the frontend knows which one to remove from the display.

*/