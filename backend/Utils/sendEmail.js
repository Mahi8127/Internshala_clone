const dns = require("dns");
const nodemailer = require("nodemailer");
const axios = require("axios");
require("dotenv").config();

// Enforce IPv4-first DNS resolution across this process to eliminate IPv6 ENETUNREACH errors in container environments like Render
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

let transporter = null;
let cachedConfigKey = "";

/**
 * Safely parse sender string into structured object for APIs like Brevo
 * Supports "Name <email@domain.com>" or plain "email@domain.com"
 */
const parseSender = (senderStr, defaultEmail = "noreply@internshala.com") => {
  if (!senderStr || typeof senderStr !== "string") {
    return { name: "Internshala", email: defaultEmail };
  }
  const match = senderStr.match(/^(?:([^<]+)\s*<)?([^>]+)>?$/);
  if (match) {
    return {
      name: (match[1] || "Internshala").trim(),
      email: match[2].trim(),
    };
  }
  return { name: "Internshala", email: senderStr.trim() };
};

/**
 * Determine which email provider to use
 * Priority:
 * 1. Explicit EMAIL_PROVIDER ('brevo', 'resend', 'smtp')
 * 2. Auto-detect if BREVO_API_KEY is present
 * 3. Auto-detect if RESEND_API_KEY is present
 * 4. Fallback to standard SMTP
 */
const getProvider = () => {
  const explicit = (process.env.EMAIL_PROVIDER || "").toLowerCase().trim();
  if (explicit) return explicit;
  if (process.env.BREVO_API_KEY && process.env.BREVO_API_KEY.trim() !== "") {
    return "brevo";
  }
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim() !== "") {
    return "resend";
  }
  return "smtp";
};

/**
 * Create or reuse Nodemailer SMTP transporter with strict IPv4 and customizable TLS settings
 */
const getTransporter = () => {
  const user = process.env.EMAIL_USER;
  const rawPass = process.env.EMAIL_PASS || "";
  const cleanPass = rawPass.replace(/[\s"']/g, "");

  if (!user || !cleanPass) {
    const errorMsg = `SMTP configuration error: EMAIL_USER is ${user ? "SET" : "MISSING"}, EMAIL_PASS is ${cleanPass ? "SET" : "MISSING"} on the server environment.`;
    console.error(`[SMTP CONFIG ERROR] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === "true"
      : port === 465;
  const timeoutMs = parseInt(process.env.SMTP_TIMEOUT || "10000", 10);

  const currentConfigKey = `${host}:${port}:${secure}:${user.trim()}`;

  if (!transporter || cachedConfigKey !== currentConfigKey) {
    console.log(
      `[SMTP CONFIG] Initializing transporter: Host=${host}, Port=${port}, Secure=${secure}, Family=IPv4, Timeout=${timeoutMs}ms`
    );

    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      family: 4, // Force IPv4 socket connection to prevent ENETUNREACH over IPv6 on Render
      auth: {
        user: user.trim(),
        pass: cleanPass,
      },
      tls: {
        rejectUnauthorized: true, // Strict certificate validation (security requirement)
      },
      connectionTimeout: timeoutMs,
      greetingTimeout: Math.min(timeoutMs, 10000),
      socketTimeout: timeoutMs + 5000,
    });

    cachedConfigKey = currentConfigKey;
  }

  return transporter;
};

/**
 * Dispatch transactional email via Brevo HTTPS API (Port 443)
 * Completely immune to cloud hosting SMTP port throttling / IPv6 routing blocks
 */
const sendEmailViaBrevo = async (to, subject, text, attachments = []) => {
  const apiKey = (process.env.BREVO_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not configured on the server environment.");
  }

  const rawSender =
    process.env.BREVO_SENDER_EMAIL ||
    process.env.EMAIL_FROM ||
    process.env.EMAIL_USER ||
    process.env.EMAIL ||
    "Internshala <noreply@internshala.com>";

  const senderObj = parseSender(rawSender);
  const recipients = (Array.isArray(to) ? to : [to]).map((email) => ({
    email: email.trim(),
  }));

  const payload = {
    sender: senderObj,
    to: recipients,
    subject,
    textContent: text,
  };

  if (attachments && attachments.length > 0) {
    payload.attachment = attachments.map((att) => {
      let content = att.content;
      if (Buffer.isBuffer(content)) {
        content = content.toString("base64");
      } else if (typeof content === "string" && !att.path) {
        content = Buffer.from(content).toString("base64");
      }
      return {
        name: att.filename,
        content: content,
      };
    });
  }

  const response = await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    payload,
    {
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 15000,
    }
  );

  console.log(
    `[EMAIL SUCCESS] Message sent via Brevo HTTPS API (MessageId: ${response.data?.messageId || "N/A"})`
  );
  return response.data;
};

/**
 * Dispatch transactional email via Resend HTTPS API (Port 443)
 */
const sendEmailViaResend = async (to, subject, text, attachments = []) => {
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured on the server environment.");
  }

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

  console.log(
    `[EMAIL SUCCESS] Message sent via Resend HTTPS API (Id: ${response.data?.id})`
  );
  return response.data;
};

/**
 * Main email dispatch function
 * Automatically routes to Brevo API, Resend API, or Nodemailer SMTP with IPv4 enforcement
 */
const sendEmail = async (to, subject, text, attachments = []) => {
  const provider = getProvider();

  if (provider === "brevo") {
    try {
      return await sendEmailViaBrevo(to, subject, text, attachments);
    } catch (brevoError) {
      const errMsg =
        brevoError.response?.data?.message ||
        brevoError.message ||
        "Unknown Brevo error";
      console.error(
        `[BREVO DISPATCH ERROR] Status: ${brevoError.response?.status || "N/A"}, Message: ${errMsg}`
      );
      throw new Error(`Email delivery failed via Brevo HTTPS API: ${errMsg}`);
    }
  }

  if (provider === "resend") {
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

  // Fallback to Nodemailer SMTP
  const mailTransporter = getTransporter();
  const fromAddress =
    process.env.EMAIL_FROM || process.env.EMAIL || process.env.EMAIL_USER;

  try {
    const info = await mailTransporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      attachments,
    });
    console.log(
      `[SMTP SUCCESS] Message sent to recipient successfully (MessageId: ${info.messageId})`
    );
    return info;
  } catch (error) {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = process.env.SMTP_PORT || "465";
    console.error(
      `[SMTP DISPATCH ERROR] Host: ${host}, Port: ${port}, Code: ${error.code || "N/A"}, ResponseCode: ${error.responseCode || "N/A"}, Message: ${error.message}`
    );
    if (
      error.code === "ESOCKET" ||
      error.code === "ETIMEDOUT" ||
      error.code === "ENETUNREACH" ||
      error.code === "ECONNREFUSED"
    ) {
      console.error(
        `[SMTP DIAGNOSTIC NOTE] Outbound network connection to ${host}:${port} failed (${error.code}). Render and cloud hosting environments often restrict or throttle direct SMTP ports (465/587) to Gmail. For guaranteed delivery on Render, configure a transactional email API provider (set BREVO_API_KEY or RESEND_API_KEY) over HTTPS port 443.`
      );
    }
    throw error;
  }
};

sendEmail.getProvider = getProvider;

module.exports = sendEmail;