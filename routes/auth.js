const express = require("express");
const router = express.Router();
const auth_controller = require("../controllers/authController");
const authenticate = require("../middleware/authenticate");

router.post('/register', auth_controller.user_registration_post);

router.post('/login', auth_controller.user_login_post);

router.post('/logout', auth_controller.user_logout_post, authenticate);

module.exports = router;