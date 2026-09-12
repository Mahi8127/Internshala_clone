const mongoose = require("mongoose");
const Applicationschema = new mongoose.Schema({
  company: String,
  category: String,
  coverLetter: String,
  user: Object,
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Resume",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["accepted", "pending", "rejected"],
    default: "pending",
  },
  Application: Object,
});
module.exports = mongoose.model("Application", Applicationschema);
