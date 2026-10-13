const express = require("express");
const router = express.Router();
const admin = require("./admin");
const intern = require("./internship");
const job = require("./job");
const application = require("./application");
const resume = require("./resume");

const {
  registerUser,
  loginUser,
  getLoginHistory,
  verifyLoginOtp,
  googleLogin,
  forgotPassword,
  changePassword,
  resendLoginOtp,
  getAllUsers,
} = require("../Controllers/authController");
const authMiddleware = require("../Middleware/authMiddleware");
const { createRateLimiter } = require("../Middleware/rateLimiter");

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: "Too many authentication attempts, please try again in a few minutes."
});

router.use("/admin", admin);
router.use("/internship", intern);
router.use("/job", job);
router.use("/application", application);
router.use("/resume", resume);
router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.get("/users", getAllUsers);
router.get("/profile", authMiddleware, async (req, res) => {
  return res.status(200).json({
    message: "Profile accessed successfully",
    user: req.user,
  });
});

router.post("/forgot-password", authLimiter, forgotPassword);
router.get("/login-history", authMiddleware, getLoginHistory);
router.post("/verify-login-otp", authLimiter, verifyLoginOtp);
router.post("/google-login", authLimiter, googleLogin);
router.put("/change-password", authLimiter, changePassword);
router.post("/resend-login-otp", authLimiter, resendLoginOtp);

module.exports = router;

