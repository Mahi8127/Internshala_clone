const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text, attachments = []) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text,
    attachments,
  });
};

module.exports = sendEmail;