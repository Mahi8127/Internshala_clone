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
const allowedOrigins = [
  "https://internshala-clone-rho.vercel.app",
  "https://internshala-clone-1-d6ig.onrender.com",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

const envOrigins = [process.env.FRONTEND_URL, process.env.CLIENT_URL].filter(Boolean);
for (const envOriginStr of envOrigins) {
  envOriginStr.split(",").forEach((item) => {
    const trimmed = item.trim().replace(/\/+$/, "");
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  const clean = origin.replace(/\/+$/, "");
  if (allowedOrigins.includes(clean)) return true;
  if (/^https:\/\/.*\.vercel\.app$/.test(clean)) return true;
  if (/^https:\/\/.*\.onrender\.com$/.test(clean)) return true;
  return true; // Fallback permit with reflection so browser clients are never blocked
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "x-access-token",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
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
