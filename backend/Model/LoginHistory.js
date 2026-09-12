const mongoose = require("mongoose");
const { DeviceType } = require("ua-parser-js/enums");

const LoginHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  browser: {
    type: String,
    required: true,
  },
  browserVersion: {
    type: String,
    default: "Unknown",
  },
  os: {
    type: String,
    required: true,
  },
  osVersion: {
    type: String,
    required: true,
  },
  deviceType: {
    type: String,
    required: true,
  },
  deviceName: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  loginTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("LoginHistory", LoginHistorySchema);
