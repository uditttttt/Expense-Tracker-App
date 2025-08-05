const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can share the same email
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the creation date
  },
});

module.exports = mongoose.model('User', UserSchema);

/*

Why this code?

We define a UserSchema using mongoose.Schema.

We specify that name, email, and password are required fields (required: true).

We ensure every user has a unique email with unique: true. Mongoose will enforce this rule.

mongoose.model('User', UserSchema) compiles our blueprint into a usable Model named User that we can use to perform operations like creating or finding users.


*/