const express = require("express");
const router = express.Router();
const auth_controller = require("../controllers/authController");
const authenticate = require("../middleware/authenticate");

//User Registration
router.post('/register', auth_controller.user_registration_post);

//User Login
router.post('/login', auth_controller.user_login_post);

//User Logout
router.post('/logout', auth_controller.user_logout_post, authenticate);

module.exports = router;