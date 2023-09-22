const brypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Session = require("../models/session");
const { body, validateResult, check } = require("express-validator");
const asyncHandler = require("express-async-handler");

// User Registration
exports.user_registration_post = [

    check('email').isEmail,
    check('password').isLength({min: 6}),
    check('name').not().isEmpty(),

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
      const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '24h' });

      // Store the token in the sessions collection
      const session = new Session({
        userId: user._id,
        token,
      });
      await session.save();

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }),
]

exports.user_login_post = [

    check('email').isEmail(),
    check('password').isLength({ min: 6 }),

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
      const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '24h' });

      // Store the token in the sessions collection
      const session = new Session({
        userId: user._id,
        token,
      });
      await session.save();

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Login failed' });
    }
  }),
];

exports.user_logout_post = asyncHandler( async (req, res, next) => {
    try {
      // Delete the session token from the sessions collection
      await Session.deleteOne({ userId: req.user._id, token: req.token });
      res.json({ message: 'Logout successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Logout failed' });
    }
});