const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment,
  sendPaymentOtp,
  verifyPaymentOtp,
  createSubscriptionOrder,
  verifySubscriptionPayment,
  getSubscription,
} = require("../Controllers/paymentController");

// ==========================================
// Existing Resume Payment
// ==========================================

router.post("/send-otp", sendPaymentOtp);

router.post("/verify-otp", verifyPaymentOtp);

router.post("/create-order", createOrder);

router.post("/verify-payment", verifyPayment);


// ==========================================
// Subscription Payment
// ==========================================

// Create Razorpay order for Bronze / Silver / Gold
router.post(
  "/subscription/create-order",
  createSubscriptionOrder
);

// Verify successful subscription payment
router.post(
  "/subscription/verify-payment",
  verifySubscriptionPayment
);

// Get user's current subscription
router.get(
  "/subscription/:userId",
  getSubscription
);


module.exports = router;