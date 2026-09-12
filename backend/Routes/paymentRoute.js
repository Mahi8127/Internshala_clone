const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment,
  sendPaymentOtp,
  verifyPaymentOtp,
} = require("../Controllers/paymentController");
router.post("/send-otp", sendPaymentOtp);
router.post("/verify-otp", verifyPaymentOtp);
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
module.exports = router;
