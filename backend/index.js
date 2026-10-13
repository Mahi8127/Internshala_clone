const bodyparser = require("body-parser");
const express = require("express");
require("dotenv").config();
const dns = require("dns");
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}
const path = require("path");
const cors = require("cors");
const { connect } = require("./db");
const router = require("./Routes/index");
const PORT = process.env.PORT || 5000;
const paymentRoute = require("./Routes/paymentRoute");
const loginHistory = require("./Routes/loginHistory");
const friendRoutes = require("./Routes/friendRoutes");
const postRoutes = require("./Routes/postRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const languageRoutes = require("./Routes/languageRoutes");

const app = express();

// ==========================================
// CORS Configuration
// ==========================================
const allowedOrigins = [
  "https://internshala-clone-1-d6ig.onrender.com",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

// Append any configured environment origins (comma-separated or single)
const envOrigins = [process.env.FRONTEND_URL, process.env.CLIENT_URL].filter(
  Boolean
);
for (const envOriginStr of envOrigins) {
  envOriginStr.split(",").forEach((item) => {
    const trimmed = item.trim().replace(/\/+$/, "");
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow non-browser requests (curl, Postman, server-to-server)
  const cleanOrigin = origin.replace(/\/+$/, "");
  if (allowedOrigins.includes(cleanOrigin)) return true;
  // Also permit preview/staging branches hosted on Render for internshala
  if (/^https:\/\/internshala-[a-z0-9-]+\.onrender\.com$/.test(cleanOrigin))
    return true;
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      console.warn(
        `[CORS] Request blocked from unauthorized origin: ${origin}`
      );
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "x-access-token",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400, // Cache preflight response for 24 hours
  optionsSuccessStatus: 204,
};

// Enable CORS and preflight handling
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// Sanitize double slashes in paths
app.use((req, res, next) => {
  if (req.url.startsWith("//")) {
    req.url = req.url.replace(/^\/+/, "/");
  }
  next();
});

app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

// Routes
app.use("/api/payment", paymentRoute);
app.use("/api/login-history", loginHistory);
app.use("/api/friends", friendRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/language", languageRoutes);

app.get("/", (req, res) => {
  res.send("Hello this is internshala backend");
});

app.get("/api/cors-test", (req, res) => {
  res.status(200).json({
    status: "ok",
    clientOrigin: req.headers.origin || "no origin header",
    allowed: isOriginAllowed(req.headers.origin),
    allowedOrigins,
  });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", router);

connect();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
