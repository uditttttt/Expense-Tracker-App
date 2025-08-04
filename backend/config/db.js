// backend/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;

/*
Why this code?

async () => { ... }: Connecting to a database is an asynchronous operation (it takes time). Using async allows us to use the await keyword.

try...catch: This block attempts the connection. If it succeeds, it prints a success message. If it fails (e.g., wrong password), it catches the error, prints it, and stops the application with process.exit(1) because our app can't run without a database.

process.env.MONGO_URI: This is how we access the variable we just defined in our .env file.

module.exports: This makes the connectDB function available to be used in other files, like our server.js.

*/