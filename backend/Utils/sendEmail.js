const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = null;

const getTransporter = () => {
  const user = process.env.EMAIL_USER;
  const rawPass = process.env.EMAIL_PASS || "";
  const cleanPass = rawPass.replace(/[\s"']/g, "");

  if (!user || !cleanPass) {
    const errorMsg = `SMTP configuration error: EMAIL_USER is ${user ? "SET" : "MISSING"}, EMAIL_PASS is ${cleanPass ? "SET" : "MISSING"} on the server environment.`;
    console.error(`[SMTP CONFIG ERROR] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL directly
      auth: {
        user: user.trim(),
        pass: cleanPass,
      },
      connectionTimeout: 20000, // 20 seconds for cold cloud containers
      greetingTimeout: 20000,   // 20 seconds
      socketTimeout: 30000,     // 30 seconds
    });
  }
  return transporter;
};

const sendEmail = async (to, subject, text, attachments = []) => {
  const mailTransporter = getTransporter();
  const rawUser = (process.env.EMAIL_USER || "").trim();
  const fromAddress = process.env.EMAIL || (rawUser ? `"InternArea" <${rawUser}>` : undefined);

  try {
    const info = await mailTransporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      attachments,
    });
    console.log(`[SMTP SUCCESS] Message sent to recipient successfully (MessageId: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error(`[SMTP DISPATCH ERROR] Code: ${error.code || "N/A"}, ResponseCode: ${error.responseCode || "N/A"}, Message: ${error.message}`);
    throw error;
  }
};

module.exports = sendEmail;