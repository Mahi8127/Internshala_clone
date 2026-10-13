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
      connectionTimeout: 4000, // 4 seconds
      greetingTimeout: 4000,   // 4 seconds
      socketTimeout: 6000,     // 6 seconds
    });
  }
  return transporter;
};

const sendEmailViaResend = async (to, subject, text, attachments = []) => {
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  const fromAddress =
    process.env.RESEND_FROM ||
    process.env.EMAIL_FROM ||
    "Internshala <onboarding@resend.dev>";

  const payload = {
    from: fromAddress,
    to: Array.isArray(to) ? to : [to],
    subject,
    text,
  };

  if (attachments && attachments.length > 0) {
    payload.attachments = attachments.map((att) => {
      let content = att.content;
      if (Buffer.isBuffer(content)) {
        content = content.toString("base64");
      } else if (typeof content === "string" && !att.path) {
        content = Buffer.from(content).toString("base64");
      }
      return {
        filename: att.filename,
        content,
        path: att.path,
      };
    });
  }

  const response = await axios.post("https://api.resend.com/emails", payload, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    timeout: 15000,
  });

  console.log(`[EMAIL SUCCESS] Message sent via Resend HTTPS API (Id: ${response.data?.id})`);
  return response.data;
};

const sendEmail = async (to, subject, text, attachments = []) => {
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim() !== "") {
    try {
      return await sendEmailViaResend(to, subject, text, attachments);
    } catch (resendError) {
      const errMsg =
        resendError.response?.data?.message ||
        resendError.message ||
        "Unknown Resend error";
      console.error(
        `[RESEND DISPATCH ERROR] Status: ${resendError.response?.status || "N/A"}, Message: ${errMsg}`
      );
      throw new Error(`Email delivery failed via Resend HTTPS API: ${errMsg}`);
    }
  }

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
    console.error(
      `[SMTP DISPATCH ERROR] Code: ${error.code || "N/A"}, ResponseCode: ${error.responseCode || "N/A"}, Message: ${error.message}`
    );
    throw error;
  }
};

module.exports = sendEmail;