// backend/models/Budget.js

const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  limit: {
    type: Number,
    required: true,
    min: 0,
  },
  // We'll store the month as a string like "YYYY-MM" to easily find it
  month: {
    type: String, 
    required: true,
  }
}, {
  timestamps: true,
});

// Create a compound index to ensure a user can only have one budget per category per month
BudgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);

/*

What This Code Does
BudgetSchema: Defines the structure for a budget entry in our MongoDB database.

user: Links the budget to a specific user.

category: The expense category this budget applies to (e.g., "Food").

limit: The maximum amount the user wants to spend in that category for the month.

month: A field to store the year and month (e.g., "2025-08") so we can have different budgets for different months.

index: This is a database rule that prevents a user from accidentally creating two budgets for the same category in the same month.

-----------------------------------------------------------

BudgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });
What it does: This line creates a unique compound index in the database.

Index: An index is like an index at the back of a book. It helps the database find documents much faster based on the indexed fields.

Compound Index: This means the index is based on a combination of multiple fields: user, category, and month.

unique: true: This adds a powerful rule. It enforces that the combination of values for these three fields must be unique across the entire collection.

Why it's used: This is for data integrity. It enforces a critical business rule at the database level: A single user cannot have two budget entries for the same category in the same month.

Let's see an example:

Allowed: ✅

User A, 'Food', '2025-08'

User A, 'Transport', '2025-08' (Category is different)

User A, 'Food', '2025-09' (Month is different)

User B, 'Food', '2025-08' (User is different)

NOT Allowed: ❌

Trying to create a second document for User A, 'Food', '2025-08'. The database will reject it and throw an error because that combination already exists.

*/