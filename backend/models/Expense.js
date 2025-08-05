const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This is the link to the User model
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true, // Removes whitespace from the beginning and end
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Expense', ExpenseSchema);

/*

Why this code?

We define the fields for an expense: description, amount, category, and date.

The user field is the most important concept here.

type: mongoose.Schema.Types.ObjectId: This tells Mongoose that we are going to store the unique ID of another database object here.

ref: 'User': This is the magic link. It explicitly tells Mongoose that the ID stored in this field refers to a document in our User collection. This is how we will know which user created which expense. This is called creating a "relationship" between our models.

*/