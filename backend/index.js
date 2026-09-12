const bodyparser = require("body-parser");
const express = require("express");
require("dotenv").config();
const path = require("path");

const app = express();
const cors = require("cors");
const { connect } = require("./db");
const router = require("./Routes/index");
const PORT = process.env.PORT || 5000;
const paymentRoute = require("./Routes/paymentRoute");
const loginHistory = require("./Routes/loginHistory");
const friendRoutes = require("./Routes/friendRoutes");
const postRoutes = require("./Routes/postRoutes");
const messageRoutes = require("./Routes/messageRoutes");

app.use(cors());
app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());
app.use("/api/payment", paymentRoute);
app.use("/api/login-history", loginHistory);
app.use("/api/friends", friendRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Hello this is internshala backend");
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", router);
connect();
app.use((req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


