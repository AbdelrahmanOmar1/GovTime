const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');

// Auth routes
router.post("/signin", authController.signin);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/verify/:token", authController.verifyEmail);

module.exports = router;
