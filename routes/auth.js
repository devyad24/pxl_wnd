const express = require("express");
const router = express.Router();
const auth_controller = require("../controllers/authController");

//User Registration
router.post('/register', auth_controller.user_registration_post);

//User Login
router.post('/login', auth_controller.user_login_post);

//User Logout
router.post('logout', auth_controller.user_logout_post);

module.exports = router;