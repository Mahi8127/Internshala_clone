const Razorpay = require("razorpay");
const crypto = require("crypto");

const Resume = require("../Model/Resume");
const User = require("../Model/User");
const Subscription = require("../Model/Subscription");

const sendEmail = require("../Utils/sendEmail");
const generateInvoice = require("../Utils/generateInvoice");
const paymentOtpStore = require("../Utils/loginOtpStore");
const subscriptionPlans = require("../Utils/subscriptionPlans");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* =========================================================
   PAYMENT TIME CHECK
   Payments are allowed only from 10:00 AM to 11:00 AM IST
   ========================================================= */

const isPaymentTimeAllowed = () => {
  const now = new Date();

  const indiaTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  const [hour] = indiaTime.split(":").map(Number);

  return hour === 10;
};

/* =========================================================
   EXISTING RESUME PAYMENT OTP
   ========================================================= */

const sendPaymentOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    paymentOtpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    await sendEmail(
      email,
      "Resume Payment OTP",
      `Your OTP for resume payment is ${otp}. This OTP is valid for 5 minutes.`
    );

    res.status(200).json({
      success: true,
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

/* =========================================================
   EXISTING RESUME PAYMENT OTP VERIFICATION
   ========================================================= */

const verifyPaymentOtp = (req, res) => {
  try {
    const { email, otp } = req.body;

    const storedData = paymentOtpStore[email];

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    if (Date.now() > storedData.expiresAt) {
      delete paymentOtpStore[email];

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    delete paymentOtpStore[email];

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};

/* =========================================================
   EXISTING RESUME PAYMENT
   ========================================================= */

const createOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    const options = {
      amount: 5000,
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
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
};

/* =========================================================
   EXISTING RESUME PAYMENT VERIFICATION
   ========================================================= */

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
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
      }
    );

    res.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* =========================================================
   CREATE SUBSCRIPTION ORDER
   ========================================================= */

const createSubscriptionOrder = async (req, res) => {
  try {
    const { userId, plan } = req.body;

    /* ---------------------------------------------
       PAYMENT TIME CHECK
       --------------------------------------------- */

    if (!isPaymentTimeAllowed()) {
      return res.status(403).json({
        success: false,
        message:
          "Subscription payments are allowed only between 10:00 AM and 11:00 AM IST.",
      });
    }

    /* ---------------------------------------------
       BASIC VALIDATION
       --------------------------------------------- */

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Subscription plan is required",
      });
    }

    /* ---------------------------------------------
       CHECK USER
       --------------------------------------------- */

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /* ---------------------------------------------
       CHECK PLAN
       --------------------------------------------- */

    const selectedPlan = subscriptionPlans[plan];

    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription plan",
      });
    }

    /* ---------------------------------------------
       FREE PLAN DOES NOT NEED PAYMENT
       --------------------------------------------- */

    if (plan === "free") {
      return res.status(400).json({
        success: false,
        message: "Free plan does not require payment",
      });
    }

    /* ---------------------------------------------
       CREATE RAZORPAY ORDER
       --------------------------------------------- */

    const options = {
      amount: selectedPlan.price * 100,
      currency: "INR",
      receipt: `sub_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        plan,
      },
    };

    const order = await razorpay.orders.create(options);

    /* ---------------------------------------------
       STORE PENDING SUBSCRIPTION
       --------------------------------------------- */

    let subscription = await Subscription.findOne({
      user: userId,
    });

    if (!subscription) {
      subscription = new Subscription({
        user: userId,
      });
    }

    subscription.plan = plan;
    subscription.price = selectedPlan.price;

    subscription.monthlyApplicationLimit =
      selectedPlan.monthlyApplicationLimit;

    subscription.paymentStatus = "pending";
    subscription.orderId = order.id;

    await subscription.save();

    /* ---------------------------------------------
       RESPONSE
       --------------------------------------------- */

    res.status(200).json({
      success: true,
      order,

      plan: {
        name: selectedPlan.name,
        price: selectedPlan.price,
        monthlyApplicationLimit:
          selectedPlan.monthlyApplicationLimit,
      },
    });
  } catch (error) {
    console.log(
      "Subscription order error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create subscription order",
    });
  }
};

/* =========================================================
   VERIFY SUBSCRIPTION PAYMENT
   ========================================================= */

const verifySubscriptionPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      plan,
    } = req.body;

    /* ---------------------------------------------
       REQUIRED DATA
       --------------------------------------------- */

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !userId ||
      !plan
    ) {
      return res.status(400).json({
        success: false,
        message: "Required payment details are missing",
      });
    }

    /* ---------------------------------------------
       VALIDATE PLAN
       --------------------------------------------- */

    const selectedPlan = subscriptionPlans[plan];

    if (!selectedPlan || plan === "free") {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription plan",
      });
    }

    /* ---------------------------------------------
       VERIFY RAZORPAY SIGNATURE
       --------------------------------------------- */

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message:
          "Subscription payment verification failed",
      });
    }

    /* ---------------------------------------------
       FETCH RAZORPAY ORDER
       --------------------------------------------- */

    const razorpayOrder =
      await razorpay.orders.fetch(
        razorpay_order_id
      );

    /* ---------------------------------------------
       VERIFY AMOUNT + CURRENCY
       --------------------------------------------- */

    if (
      razorpayOrder.currency !== "INR" ||
      razorpayOrder.amount !==
        selectedPlan.price * 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment amount or currency is invalid",
      });
    }

    /* ---------------------------------------------
       VERIFY USER
       --------------------------------------------- */

    if (
      razorpayOrder.notes &&
      razorpayOrder.notes.userId &&
      razorpayOrder.notes.userId !==
        userId.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment user verification failed",
      });
    }

    /* ---------------------------------------------
       VERIFY PLAN
       --------------------------------------------- */

    if (
      razorpayOrder.notes &&
      razorpayOrder.notes.plan &&
      razorpayOrder.notes.plan !== plan
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment plan verification failed",
      });
    }

    /* ---------------------------------------------
       CHECK USER
       --------------------------------------------- */

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /* ---------------------------------------------
       SUBSCRIPTION DATES
       --------------------------------------------- */

    const startDate = new Date();

    const endDate = new Date(startDate);

    endDate.setMonth(
      endDate.getMonth() + 1
    );

    const currentMonth =
      `${startDate.getFullYear()}-${String(
        startDate.getMonth() + 1
      ).padStart(2, "0")}`;

    /* ---------------------------------------------
       UPDATE SUBSCRIPTION
       --------------------------------------------- */

    let subscription =
      await Subscription.findOne({
        user: userId,
      });

    if (!subscription) {
      subscription = new Subscription({
        user: userId,
      });
    }

    subscription.plan = plan;

    subscription.price =
      selectedPlan.price;

    subscription.monthlyApplicationLimit =
      selectedPlan.monthlyApplicationLimit;

    subscription.applicationsUsed = 0;

    subscription.currentMonth =
      currentMonth;

    subscription.startDate =
      startDate;

    subscription.endDate =
      endDate;

    subscription.paymentId =
      razorpay_payment_id;

    subscription.orderId =
      razorpay_order_id;

    subscription.paymentStatus =
      "paid";

    await subscription.save();

    /* ---------------------------------------------
       APPLICATION LIMIT TEXT
       --------------------------------------------- */

    const applicationLimit =
      selectedPlan.monthlyApplicationLimit ===
      null
        ? "Unlimited"
        : selectedPlan.monthlyApplicationLimit;

    /* ---------------------------------------------
       EMAIL CONTENT
       --------------------------------------------- */

    const emailText = `
Hello ${user.name},

Your subscription payment was successful.

PLAN DETAILS
-----------------------------
Plan: ${selectedPlan.name}
Price: ₹${selectedPlan.price}
Monthly Applications: ${applicationLimit}

PAYMENT DETAILS
-----------------------------
Payment ID: ${razorpay_payment_id}
Order ID: ${razorpay_order_id}
Payment Status: Successful
Currency: INR

SUBSCRIPTION PERIOD
-----------------------------
Start Date: ${startDate.toDateString()}
End Date: ${endDate.toDateString()}

Your subscription is now active.

Thank you.
`;

    /* ---------------------------------------------
       GENERATE INVOICE
       --------------------------------------------- */

    try {
      const invoicePdf =
        await generateInvoice({
          userName: user.name,
          userEmail: user.email,

          planName: selectedPlan.name,
          planPrice: selectedPlan.price,

          applicationLimit:
            selectedPlan.monthlyApplicationLimit,

          paymentId:
            razorpay_payment_id,

          orderId:
            razorpay_order_id,

          startDate,
          endDate,
        });

      /* ---------------------------------------------
         SEND EMAIL + PDF INVOICE
         --------------------------------------------- */

      await sendEmail(
        user.email,
        `${selectedPlan.name} - Payment Successful`,
        emailText,
        [
          {
            filename:
              `Invoice-${razorpay_payment_id}.pdf`,

            content: invoicePdf,

            contentType:
              "application/pdf",
          },
        ]
      );

      console.log(
        "Subscription invoice email sent to:",
        user.email
      );
    } catch (emailError) {
      /*
        Payment is already successful and subscription
        is already activated. Therefore, an email failure
        should NOT make the payment fail.
      */

      console.log(
        "Subscription invoice email error:",
        emailError
      );
    }

    /* ---------------------------------------------
       SUCCESS RESPONSE
       --------------------------------------------- */

    res.status(200).json({
      success: true,

      message:
        "Subscription payment verified and plan activated successfully",

      subscription,
    });
  } catch (error) {
    console.log(
      "Subscription verification error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to verify subscription payment",
    });
  }
};

/* =========================================================
   GET USER SUBSCRIPTION
   ========================================================= */

const getSubscription = async (req, res) => {
  try {
    const { userId } = req.params;

    let subscription =
      await Subscription.findOne({
        user: userId,
      });

    /* ---------------------------------------------
       CREATE FREE PLAN IF NONE EXISTS
       --------------------------------------------- */

    if (!subscription) {
      const now = new Date();

      const currentMonth =
        `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}`;

      subscription =
        await Subscription.create({
          user: userId,

          plan: "free",

          price: 0,

          monthlyApplicationLimit: 1,

          applicationsUsed: 0,

          currentMonth,

          paymentStatus: "paid",
        });
    }

    /* ---------------------------------------------
       CURRENT MONTH
       --------------------------------------------- */

    const now = new Date();

    const currentMonth =
      `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

    /* ---------------------------------------------
       RESET MONTHLY APPLICATION COUNT
       --------------------------------------------- */

    if (
      subscription.currentMonth !==
      currentMonth
    ) {
      subscription.currentMonth =
        currentMonth;

      subscription.applicationsUsed = 0;

      await subscription.save();
    }

    /* ---------------------------------------------
       CHECK EXPIRED SUBSCRIPTION
       --------------------------------------------- */

    if (
      subscription.plan !== "free" &&
      subscription.endDate &&
      new Date(subscription.endDate) < now
    ) {
      subscription.plan = "free";

      subscription.price = 0;

      subscription.monthlyApplicationLimit = 1;

      subscription.applicationsUsed = 0;

      subscription.paymentStatus = "paid";

      subscription.startDate = null;

      subscription.endDate = null;

      subscription.paymentId = "";

      subscription.orderId = "";

      await subscription.save();
    }

    /* ---------------------------------------------
       RESPONSE
       --------------------------------------------- */

    res.status(200).json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.log(
      "Get subscription error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch subscription",
    });
  }
};

/* =========================================================
   EXPORTS
   ========================================================= */

module.exports = {
  createOrder,
  verifyPayment,

  sendPaymentOtp,
  verifyPaymentOtp,

  createSubscriptionOrder,
  verifySubscriptionPayment,
  getSubscription,
};