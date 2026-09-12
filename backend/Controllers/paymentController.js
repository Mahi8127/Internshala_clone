const Razorpay = require("razorpay");
const crypto = require("crypto");
const Resume = require("../Model/Resume");
const User = require("../Model/User");
const sendEmail = require("../Utils/sendEmail");
const paymentOtpStore = require("../Utils/loginOtpStore");
const { json } = require("body-parser");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const sendPaymentOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    paymentOtpStore[user.email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    };

    await sendEmail(
      user.email,
      "Resume Payment OTP",
      `Your OTP for resume payment is ${otp}. It is valid for 5 minutes.`,
    );

    res.json({
      success: true,
      email: user.email,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const { userId } = req.body;
    const options = {
      amount: 5000, // ₹50 in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId,
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    await Resume.findOneAndUpdate(
      { user: userId },
      {
        PaymentStatus: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      },
    );

    res.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "verification failed",
    });
  }
};

const verifyPaymentOtp = (req, res) => {
  const { email, otp } = req.body;
  const otpData = paymentOtpStore[email];

  if (!otpData) {
    return res.status(400).json({
      success: false,
      message: "OTP not found",
    });
  }

  if (Date.now() > otpData.expires) {
    delete paymentOtpStore[email];
    return res.status(400).json({
      success: false,
      message: "OTP expired",
    });
  }

  if (otpData.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  delete paymentOtpStore[email];

  res.json({
    success: true,
    message: "OPT verified successfully",
  });
};

module.exports = {
  createOrder,
  verifyPayment,
  sendPaymentOtp,
  verifyPaymentOtp,
};
