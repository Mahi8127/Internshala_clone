const mongoose = require("mongoose");
const Jobschema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  Experience: String,
  category: String,
  aboutCompany: String,
  aboutJob: String,
  Whocanapply: String,
  perks: Array,
  CTC: String,
  startDate: String,
  AdditionalInfo: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  numberofopening: String,
});
module.exports = mongoose.model("Job", Jobschema);
