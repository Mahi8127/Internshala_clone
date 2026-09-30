const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UAParser = require("ua-parser-js");

const User = require("../Model/User");
const LoginHistory = require("../Model/LoginHistory");
const loginOtpStore = require("../Utils/loginOtpStore");
const sendEmail = require("../Utils/sendEmail.js");
const generatePassword = require("../Utils/passwordGenerator.js");

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await user.save();

    return res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const parser = new UAParser();
    parser.setUA(req.headers["user-agent"]);
    const result = parser.getResult();

    // DEBUG: Check what device the backend detects
    console.log("USER AGENT:", req.headers["user-agent"]);
    console.log("DEVICE DETECTED:", result.device);

    const browser = result.browser.name || "Unknown";
    const browserVersion = result.browser.version || "Unknown";

    const os = result.os.name || "Unknown";
    const osVersion = result.os.version || "Unknown";

    let deviceType = "Desktop";

    if (result.device.type === "mobile") {
      deviceType = "Mobile";
    } else if (result.device.type === "tablet") {
      deviceType = "Tablet";
    }
    console.log("FINAL DEVICE TYPE:", deviceType);
console.log("CURRENT HOUR:", new Date().getHours());

    if (deviceType === "Mobile") {
      const now = new Date();
      const currentHour = now.getHours();

      if (currentHour < 10 || currentHour >= 13) {
        return res.status(403).json({
          message: "Mobile login is allowed only between 10:00 AM and 1:00 PM.",
        });
      }
    }

    let deviceName = "Desktop";

    if (deviceType === "Mobile" || deviceType === "Tablet") {
      deviceName =
        `${result.device.vendor || ""} ${result.device.model || ""}`.trim();

      if (!deviceName) {
        deviceName = deviceType;
      }
    }

    if (result.browser.name === "Chrome") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      loginOtpStore[user.email] = {
        otp,
        expires: Date.now() + 5 * 60 * 1000,
        user,
        browser,
        browserVersion,
        os,
        osVersion,
        deviceType,
        deviceName,
        ipAddress: req.ip,
      };

      await sendEmail(
        user.email,
        "Login OTP verification",
        `Your login OTP is ${otp}. It is valid for 5 minutes.`,
      );

      return res.status(200).json({
        otpRequired: true,
        message: "OTP sent to your registered email.",
        email: user.email,
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    await LoginHistory.create({
      user: user._id,
      browser,
      browserVersion,
      os,
      osVersion,
      deviceType,
      deviceName,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpData = loginOtpStore[email];

    if (!otpData) {
      return res.status(400).json({
        message: "OTP not found, Please login again",
      });
    }

    if (Date.now() > otpData.expires) {
      delete loginOtpStore[email];

      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP.",
      });
    }

    const user = otpData.user;

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    await LoginHistory.create({
      user: user._id,
      browser: otpData.browser,
      browserVersion: otpData.browserVersion,
      os: otpData.os,
      osVersion: otpData.osVersion,
      deviceType: otpData.deviceType,
      deviceName: otpData.deviceName,
      ipAddress: otpData.ipAddress,
    });

    delete loginOtpStore[email];

    return res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const getLoginHistory = async (req, res) => {
  try {
    const history = await LoginHistory.find({
      user: req.params.userId,
    }).sort({ loginTime: -1 });

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { name, email, photo } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        photo,
      });
    }

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    if (user.lastPasswordReset) {
      const lastReset = new Date(user.lastPasswordReset);
      const today = new Date();

      if (
        lastReset.getDate() === today.getDate() &&
        lastReset.getMonth() === today.getMonth() &&
        lastReset.getFullYear() === today.getFullYear()
      ) {
        return res.status(400).json({
          message: "You can use this option only once per day.",
        });
      }
    }

    const newPassword = generatePassword(10);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.lastPasswordReset = new Date();

    await user.save();

    await sendEmail(
      user.email,
      "Password Reset Successful",
      `Hello ${user.name},
      Your password has been reset successfully.
      Your new Password is : ${newPassword}
      
      Please log in using this password and change it as soon as possible for security reasons.
      
      Regards,
      Internship Portal Team`,
    );

    return res.status(200).json({
      message: "A new password has been sent to your registered email.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const resendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otpData = loginOtpStore[email];

    if (!otpData) {
      return res.status(400).json({
        message: "Session expired. Please login again.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    loginOtpStore[email] = {
      ...otpData,
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    };

    await sendEmail(
      email,
      "Login OTP Verification",
      `Your new login OTP is ${otp}.It is valid for 5 minutes.`,
    );

    return res.status(200).json({
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("_id name photo")
      .sort({ name: 1 });

    console.log("USERS FOUND:", users);

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getLoginHistory,
  verifyLoginOtp,
  googleLogin,
  forgotPassword,
  changePassword,
  resendLoginOtp,
  getAllUsers,
};