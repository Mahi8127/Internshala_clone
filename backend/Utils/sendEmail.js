const dns = require("dns");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Enforce IPv4-first DNS resolution across this process to eliminate IPv6 ENETUNREACH errors in container environments like Render
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

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
      family: 4,    // Force IPv4 socket connection to eliminate container IPv6 timeouts
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