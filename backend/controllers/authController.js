// backend/controllers/authController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  // 1. Destructure the name, email, and password from the request body
  const { name, email, password } = req.body;

  try {
    // 2. Check if a user with this email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. If user doesn't exist, create a new user instance
    user = new User({
      name,
      email,
      password,
    });

    // 4. Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10); // random string
    user.password = await bcrypt.hash(password, salt);

    // 5. Save the new user to the database
    await user.save();

    // 6. Create a payload for our JWT
    const payload = {
      user: {
        //user.id is a convenient virtual property provided by Mongoose that gives you the string version of the document's _id.
        id: user.id, // Mongoose uses 'id' as a virtual getter for '_id'
      },
    };

    // 7. Sign the JWT and send it back to the client
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" }, // The token will expire in 30 days
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token }); // 201 means 'Created'
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists by email
    const user = await User.findOne({ email });

    if (!user) {
      // If no user is found, send an error
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. If user exists, compare the submitted password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // If passwords don't match, send an error
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. If everything is correct, create and sign a JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) throw err;
        // Send the token to the client
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

/*

Why the comments? These @desc, @route, and @access comments are a professional standard for documenting API endpoints. It makes it incredibly easy to see what a function does at a glance.

Code Breakdown:

We get the name, email, and password from req.body. This works because of the express.json() middleware.

User.findOne({ email }) searches the database(Users Collection) for an existing user with that email.

If no user is found, new User({...}) creates a new user object in memory (but doesn't save it yet).

bcrypt.genSalt and bcrypt.hash work together to securely hash the plain text password.

user.save() saves the complete user object (with the hashed password) to MongoDB.

We create a payload for the token. We only need to include the user's unique database ID.

jwt.sign creates the token using our payload and the secret key from the .env file. We send this token back to the user with a 201 Created status.

Code Breakdown & Security Note:

We first find the user by their email.

bcrypt.compare() does the magic of securely checking the password.

Crucially, notice that we return the exact same error message (Invalid credentials) whether the email doesn't exist or the password is wrong. This is an important security practice. It prevents attackers from figuring out which email addresses are valid in our system.

If the credentials are valid, we generate a new JWT, just like we did in the registration function, and send it back.
*/
