const express = require("express");

const authMiddleware = require("../Middleware/authMiddleware");

const {
  sendLanguageOTP,
  verifyLanguageOTP,
} = require("../Controllers/languageController");

const router = express.Router();

router.post("/send-otp", authMiddleware, sendLanguageOTP);

router.post("/verify-otp", authMiddleware, verifyLanguageOTP);

module.exports = router;
