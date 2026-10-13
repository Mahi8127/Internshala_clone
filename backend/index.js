const express = require("express");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const { connect } = require("./db");
const router = require("./Routes/index");
const paymentRoute = require("./Routes/paymentRoute");
const loginHistory = require("./Routes/loginHistory");
const friendRoutes = require("./Routes/friendRoutes");
const postRoutes = require("./Routes/postRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const languageRoutes = require("./Routes/languageRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration supporting credentials from any valid origin
const corsOptions = {
  origin: (origin, callback) => {
    // Reflect origin to support credentialed requests from localhost, Render, and custom domains
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/payment", paymentRoute);
app.use("/api/login-history", loginHistory);
app.use("/api/friends", friendRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/language", languageRoutes);

app.get("/", (req, res) => {
  res.send("Hello this is internshala backend");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "internshala-backend",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use("/api", router);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });
});

// Connect database
connect();

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
