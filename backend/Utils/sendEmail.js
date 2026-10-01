const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,   // 10 seconds
  socketTimeout: 15000,     // 15 seconds
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text, attachments = []) => {
  const fromAddress = process.env.EMAIL || process.env.EMAIL_USER;
  return await transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    text,
    attachments,
  });
};

module.exports = sendEmail;