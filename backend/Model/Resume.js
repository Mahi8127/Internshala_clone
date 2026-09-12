const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fullname: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: String,

    linkedin: String,
    github: String,
    portfolio: String,

    objective: String,

    education: [
      {
        degree: String,
        college: String,
        branch: String,
        cgpa: String,
        startYear: String,
        endYear: String,
      },
    ],

    experience: [
      {
        company: String,
        position: String,
        duration: String,
        description: String,
      },
    ],

    projects: [
      {
        title: String,
        description: String,
        github: String,
      },
    ],

    skills: [String],

    certification: [String],

    languages: [String],

    interests: String,

    photo: String,

    resumeUrl: {
      type: String,
      default: "",
    },
    PaymentStatus: {
      type: Boolean,
      default: false,
    },

    paymentId:{
      type: String,
      default:"",
    },
    orderId:{
      type: String,
      default:"",
    },
    amount:{
      type: String,
      default:"",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Resume", ResumeSchema);
