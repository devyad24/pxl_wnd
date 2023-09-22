const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Session = require("../models/session");
const { body, validationResult, check } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.user_registration_post = [

    body('email', "Email is required").isEmail().escape(),
    body('password', "Either password not provided or is too short").isLength({min: 3}).isAlphanumeric().escape(),
    body('name', "Provide a name.").not().isEmpty().escape(),

    asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, name } = req.body;

    try {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        email,
        password: hashedPassword,
        name,
      });

      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '24h' });

      const session = new Session({
        userId: user._id,
        token,
      });
      await session.save();

      res.status(201).json({ token, message: "Registered Successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }),
]

exports.user_login_post = [

    body('email', "Email is required").isEmail().escape(),
    body('password', "Either password not provided or is too short").isLength({min: 3}).escape(),

    asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '24h' });

      const session = new Session({
        userId: user._id,
        token,
      });
      await session.save();

      res.status(200).json({ token , message: "Logged In Successfully"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Login failed' });
    }
  }),
];

exports.user_logout_post = asyncHandler( async (req, res, next) => {
    try {
      const session = await Session.find({userId: req.user_id, token: req.token });
      await Session.deleteOne({ session });
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Logout failed' });
    }
});
