// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for the token in the authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (it's formatted as "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get the user from the database using the id from the token's payload
      // and attach it to the request object. We exclude the password.
      req.user = await User.findById(decoded.user.id).select('-password');
      
      if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // If everything is good, call the next middleware/controller
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If there's no token at all
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };

/*

Core Concept: What is Middleware?
Middleware is simply a function that runs in the middle of a request, before your actual controller logic is executed. It's the perfect place to check for things like authentication.
Its only job is to check if a person is authorized to access the route they are trying to reach.

This type of function is called middleware because it runs in the middle—after the server gets a request but before the final route logic (the controller) is executed.

Our protect middleware will do the following:

Look for the user's JWT in the request headers.

Verify if the token is valid and not expired.

If it's valid, it will decode the user's ID from the token.

It will fetch the user from the database and attach their info to the request object (req.user).

Finally, it will pass the request along to the intended controller.

If the token is missing or invalid, it will immediately stop the process and send back an "Unauthorized" error.




*/