const nodemailer = require("nodemailer");
const axios = require("axios");
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
      connectionTimeout: 5000, // 5 seconds
      greetingTimeout: 5000,   // 5 seconds
      socketTimeout: 8000,     // 8 seconds
    });
  }
  return transporter;
};

/**
 * Send email using Resend HTTPS API (Port 443) if RESEND_API_KEY is configured,
 * or fallback to Gmail SMTP via Nodemailer.
 * Never logs credentials, API keys, or email passwords.
 */
const sendEmail = async (to, subject, text, attachments = []) => {
  const resendApiKey = process.env.RESEND_API_KEY;

  // 1. Resend HTTPS API (Works reliably on cloud hosts with blocked SMTP ports)
  if (resendApiKey) {
    const fromAddress = process.env.RESEND_FROM || process.env.EMAIL_FROM || "onboarding@resend.dev";
    try {
      const response = await axios.post(
        "https://api.resend.com/emails",
        {
          from: fromAddress,
          to: Array.isArray(to) ? to : [to],
          subject,
          text,
        },
        {
          headers: {
            Authorization: `Bearer ${resendApiKey.trim()}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );
      console.log(`[EMAIL SUCCESS via Resend API] Message dispatched successfully (Id: ${response.data?.id || "N/A"})`);
      return { success: true, messageId: response.data?.id };
    } catch (apiError) {
      const errMsg = apiError.response?.data?.message || apiError.message;
      console.error(`[EMAIL DISPATCH ERROR via Resend API] Status: ${apiError.response?.status || "N/A"}, Message: ${errMsg}`);
      throw new Error(`Email delivery failed via API: ${errMsg}`);
    }
  }

  // 2. Fallback to SMTP (for local environment or environments where SMTP ports 465/587 are open)
  const mailTransporter = getTransporter();
  const fromAddress = process.env.EMAIL || process.env.EMAIL_USER;

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