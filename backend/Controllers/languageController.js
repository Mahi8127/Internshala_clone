const crypto = require("crypto");
const languageOtpStore = require("../Utils/languageOtpStore");
const sendEmail = require("../Utils/sendEmail");

const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const sendLanguageOTP = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User authentication required.",
      });
    }
    const userId = user.id || user._id || user.userId;

    const email = user.email;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in authentication token.",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "User email address not found.",
      });
    }

    const otp = generateOTP();

    const expiresAt = Date.now() + 5 * 60 * 1000;

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    languageOtpStore[userId] = {
      otpHash,
      expiresAt,
      attempts: 0,
    };

    await sendEmail(
      email,
      "InternArea - French Language Verification",
      `Hello,
            You requested to switch your InternArea language to French.
            Your Verification code is: 
                ${otp}
                
            This code will expires in 5 minutes.
            If you did not request this change, you can safely ignore this email.
            
            Regards, 
            InternArea Team`,
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your registered email.",
    });
  } catch (error) {
    console.error("Send language OTP error: ", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send language verification OTP.",
    });
  }
};

const verifyLanguageOTP = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User authentication required.",
      });
    }

    const userId = user.id || user._id || user.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in autthentication token.",
      });
    }

    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    if (!/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({
        success: false,
        message: "OTP must be a 6-digit number.",
      });
    }

    const storedOTP = languageOtpStore[userId];

    if (!storedOTP) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new OTP.",
      });
    }

    if (storedOTP.attempts >= 5) {
      delete languageOtpStore[userId];

      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    if (Date.now() > storedOTP.expiresAt) {
      delete languageOtpStore[userId];

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    const enteredOtpHash = crypto
      .createHash("sha256")
      .update(String(otp))
      .digest("hex");

    storedOTP.attempts += 1;

    if (enteredOtpHash !== storedOTP.otpHash) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
        attemptsRemaining: 5 - storedOTP.attempts,
      });
    }

    delete languageOtpStore[userId];

    return res.status(200).json({
      success: true,
      verified: true,
      language: "fr",
      message: "French language verification successful.",
    });
  } catch (error) {
    console.error("Verify language OTP error: ", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify language OTP.",
    });
  }
};

module.exports = {
  sendLanguageOTP,
  verifyLanguageOTP,
};
