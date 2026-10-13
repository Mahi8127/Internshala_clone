const dns = require("dns");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Enforce IPv4-first DNS resolution across this process to eliminate IPv6 ENETUNREACH errors in container environments like Render
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

let transporter = null;
let cachedConfigKey = "";

/**
 * Return sanitized SMTP configuration metadata for diagnostics
 * NEVER returns credentials, passwords, or secrets.
 */
const getSmtpConfig = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === "true"
      : port === 465;
  const timeoutMs = parseInt(process.env.SMTP_TIMEOUT || "10000", 10);
  const user = process.env.EMAIL_USER;
  const rawPass = process.env.EMAIL_PASS || "";

  return {
    host,
    port,
    secure,
    family: 4,
    timeoutMs,
    configured: Boolean(user && rawPass.trim()),
    hasUser: Boolean(user),
    hasPass: Boolean(rawPass.trim()),
  };
};

/**
 * Create or reuse Nodemailer SMTP transporter for Gmail
 * - Host: smtp.gmail.com
 * - Port: 465 (or configurable via SMTP_PORT)
 * - secure: true for 465 / SSL, false for 587 / STARTTLS
 * - family: 4 (forces IPv4 to prevent ENETUNREACH over IPv6 on Render)
 * - tls: { rejectUnauthorized: true } (strict TLS certificate verification)
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
      `[SMTP CONFIG] Initializing Gmail SMTP transporter: Host=${host}, Port=${port}, Secure=${secure}, Family=IPv4, Timeout=${timeoutMs}ms`
    );

    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      family: 4, // Force IPv4 socket connection
      auth: {
        user: user.trim(),
        pass: cleanPass,
      },
      tls: {
        rejectUnauthorized: true, // Strict certificate verification
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
 * Diagnostic helper: verify connection to the SMTP server without sending an email.
 * Safe to call from status checks.
 */
const verifySmtpConnection = async () => {
  try {
    const activeTransporter = getTransporter();
    await activeTransporter.verify();
    return { success: true, message: "SMTP server connection verified successfully." };
  } catch (error) {
    return {
      success: false,
      code: error.code || "UNKNOWN",
      message: error.message,
    };
  }
};

/**
 * Dispatch email via Gmail SMTP (Nodemailer)
 * @param {string|string[]} to - Recipient email address(es)
 * @param {string} subject - Email subject
 * @param {string} text - Plain text email body
 * @param {Array} attachments - Optional list of attachments
 */
const sendEmail = async (to, subject, text, attachments = []) => {
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
      `[SMTP SUCCESS] Email sent to recipient successfully (MessageId: ${info.messageId})`
    );
    return info;
  } catch (error) {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = process.env.SMTP_PORT || "465";

    // Safe error logging: never log passwords, tokens, or OTP values
    console.error(
      `[SMTP DISPATCH ERROR] Host: ${host}, Port: ${port}, Code: ${error.code || "N/A"}, Command: ${error.command || "N/A"}, ResponseCode: ${error.responseCode || "N/A"}, Message: ${error.message}`
    );

    if (error.code === "EAUTH") {
      console.error(
        "[SMTP DIAGNOSTIC NOTE] Authentication failed (EAUTH). Ensure you are using a 16-character Google App Password (with 2-Step Verification enabled), NOT your regular Google account login password."
      );
    } else if (
      error.code === "ESOCKET" ||
      error.code === "ETIMEDOUT" ||
      error.code === "ENETUNREACH" ||
      error.code === "ECONNREFUSED"
    ) {
      console.error(
        `[SMTP DIAGNOSTIC NOTE] Network socket failure (${error.code}) connecting to ${host}:${port}. If running on Render, verify outbound connection rules or test port 587 (SMTP_PORT=587 SMTP_SECURE=false) if port 465 is filtered by the host network.`
      );
    }

    throw error;
  }
};

sendEmail.getSmtpConfig = getSmtpConfig;
sendEmail.verifySmtpConnection = verifySmtpConnection;

module.exports = sendEmail;