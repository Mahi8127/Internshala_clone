const express = require("express");

const router = express.Router();

const Application = require("../Model/Application");
const Resume = require("../Model/Resume");
const Subscription = require("../Model/Subscription");

// Submit internship application
router.post("/", async (req, res) => {
  try {
    const user = req.body.user;

    if (!user || !user.id) {
      return res.status(400).json({
        success: false,
        message: "User information is required.",
      });
    }

    const userId = user.id;

    /*
     * ---------------------------------------------------------
     * 1. CHECK RESUME PURCHASE
     * ---------------------------------------------------------
     */

    const resume = await Resume.findOne({
      user: userId,
      PaymentStatus: true,
    });

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "Please purchase your resume first.",
      });
    }

    /*
     * ---------------------------------------------------------
     * 2. GET CURRENT MONTH
     * ---------------------------------------------------------
     */

    const now = new Date();

    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    /*
     * ---------------------------------------------------------
     * 3. FIND USER SUBSCRIPTION
     * ---------------------------------------------------------
     */

    let subscription = await Subscription.findOne({
      user: userId,
    });

    /*
     * ---------------------------------------------------------
     * 4. CREATE FREE PLAN IF USER HAS NO SUBSCRIPTION
     * ---------------------------------------------------------
     */

    if (!subscription) {
      subscription = await Subscription.create({
        user: userId,
        plan: "free",
        price: 0,
        monthlyApplicationLimit: 1,
        applicationsUsed: 0,
        currentMonth,
        paymentStatus: "paid",
      });
    }

    /*
     * ---------------------------------------------------------
     * 5. RESET MONTHLY USAGE
     * ---------------------------------------------------------
     */

    if (subscription.currentMonth !== currentMonth) {
      subscription.applicationsUsed = 0;
      subscription.currentMonth = currentMonth;

      await subscription.save();
    }

    /*
     * ---------------------------------------------------------
     * 6. CHECK SUBSCRIPTION EXPIRY
     * ---------------------------------------------------------
     */

    if (
      subscription.plan !== "free" &&
      subscription.endDate &&
      subscription.endDate < now
    ) {
      subscription.plan = "free";
      subscription.price = 0;
      subscription.monthlyApplicationLimit = 1;
      subscription.applicationsUsed = 0;
      subscription.currentMonth = currentMonth;
      subscription.startDate = null;
      subscription.endDate = null;
      subscription.paymentId = "";
      subscription.orderId = "";
      subscription.paymentStatus = "paid";

      await subscription.save();
    }

    /*
     * ---------------------------------------------------------
     * 7. CHECK APPLICATION LIMIT
     * ---------------------------------------------------------
     *
     * Gold plan has:
     *
     * monthlyApplicationLimit = null
     *
     * Therefore Gold is unlimited.
     */

    const isUnlimited =
      subscription.plan === "gold" ||
      subscription.monthlyApplicationLimit === null;

    if (
      !isUnlimited &&
      subscription.applicationsUsed >=
        subscription.monthlyApplicationLimit
    ) {
      return res.status(403).json({
        success: false,
        message: `Monthly application limit reached for your ${subscription.plan} plan.`,
        plan: subscription.plan,
        limit: subscription.monthlyApplicationLimit,
        used: subscription.applicationsUsed,
      });
    }

    /*
     * ---------------------------------------------------------
     * 8. CREATE APPLICATION
     * ---------------------------------------------------------
     */

    const applicationdata = new Application({
      company: req.body.company,
      category: req.body.category,
      coverLetter: req.body.coverLetter,
      user: req.body.user,
      Application: req.body.Application,
      body: req.body.body,
      resume: resume._id,
    });

    await applicationdata.save();

    /*
     * ---------------------------------------------------------
     * 9. INCREASE MONTHLY APPLICATION COUNT
     * ---------------------------------------------------------
     */

    subscription.applicationsUsed += 1;

    await subscription.save();

    /*
     * ---------------------------------------------------------
     * 10. RESPONSE
     * ---------------------------------------------------------
     */

    res.status(200).json({
      success: true,
      message: "Application submitted successfully.",
      data: applicationdata,
      subscription: {
        plan: subscription.plan,
        applicationsUsed: subscription.applicationsUsed,
        monthlyApplicationLimit:
          subscription.monthlyApplicationLimit,
        unlimited: isUnlimited,
      },
    });
  } catch (error) {
    console.log("Application Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Get all applications
router.get("/", async (req, res) => {
  try {
    const data = await Application.find();

    res.status(200).json(data);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Get single application
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Application.findById(id).populate("resume");

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Update application status
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  let status;

  if (action === "accepted") {
    status = "accepted";
  } else if (action === "rejected") {
    status = "rejected";
  } else {
    return res.status(400).json({
      success: false,
      error: "Invalid action",
    });
  }

  try {
    const updateapplication =
      await Application.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true }
      );

    if (!updateapplication) {
      return res.status(404).json({
        success: false,
        error: "Not able to update the application",
      });
    }

    res.status(200).json({
      success: true,
      data: updateapplication,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

module.exports = router;