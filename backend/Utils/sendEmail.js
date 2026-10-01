const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,   // 10 seconds
      socketTimeout: 15000,     // 15 seconds
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

const sendEmail = async (to, subject, text, attachments = []) => {
  const mailTransporter = getTransporter();
  const fromAddress = process.env.EMAIL || process.env.EMAIL_USER;
  return await mailTransporter.sendMail({
    from: fromAddress,
    to,
    subject,
    text,
    attachments,
  });
};

module.exports = sendEmail;