const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Session = require("../models/session");
const { body, validationResult, check } = require("express-validator");
const asyncHandler = require("express-async-handler");

// User Registration
exports.user_registration_post = [

    body('email', "Email is required").isEmail().escape(),
    body('password', "Password is required.").isLength({min: 6}).escape(),
    body('name', "Provide a name.").not().isEmpty().escape(),

    asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, name } = req.body;

    try {
      // Check if the email is already registered
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      // Hash the user's password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const user = new User({
        email,
        password: hashedPassword,
        name,
      });

      // Save the user to the database
      await user.save();

      // Generate a unique session token
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '24h' });

      // Store the token in the sessions collection
      const session = new Session({
        userId: user._id,
        token,
      });
      await session.save();

      res.json({ token, message: "Registered Succesffuly" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }),
]

exports.user_login_post = [

    body('email', "Email is required").isEmail().escape(),
    body('password', "Password is required.").isLength({min: 6}).escape(),

    asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find the user by email
      const user = await User.findOne({ email });

      // Check if the user exists and the password is correct
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate a unique session token
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '24h' });

      // Store the token in the sessions collection
      const session = new Session({
        userId: user._id,
        token,
      });
      await session.save();

      res.json({ token , message: "Login Succesful"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Login failed' });
    }
  }),
];

exports.user_logout_post = asyncHandler( async (req, res, next) => {
    try {
      // Delete the session token from the sessions collection
      await Session.deleteOne({ userId: req.user_id, token: req.token });
      res.json({ message: 'Logout successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Logout failed' });
    }
});
