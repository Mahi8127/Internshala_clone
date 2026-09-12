const express = require("express");
const router = express.Router();

const { getLoginHistory } = require("../Controllers/authController");
const authMiddlewear = require("../Middleware/authMiddleware");

router.get("/:userId", getLoginHistory);

module.exports = router;
