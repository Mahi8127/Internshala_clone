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

router.use("/admin", admin);
router.use("/internship", intern);
router.use("/job", job);
router.use("/application", application);
router.use("/resume", resume);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getAllUsers);
router.get("/profile", authMiddleware, async (req, res) => {
  return res.status(200).json({
    message: "Profile accessed successfully",
    user: req.user,
  });
});

router.post("/forgot-password", forgotPassword);
router.get("/login-history", authMiddleware, getLoginHistory);
router.post("/verify-login-otp", verifyLoginOtp);
router.post("/google-login", googleLogin);
router.put("/change-password", changePassword);
router.post("/resend-login-otp", resendLoginOtp);

module.exports = router;
