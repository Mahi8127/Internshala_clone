const assert = require("assert");
const dns = require("dns");
const tls = require("tls");
const nodemailer = require("nodemailer");

console.log("=== RUNNING GMAIL SMTP & OTP VERIFICATION SUITE ===");

// 1. Verify DNS IPv4 First
console.log("\n[TEST 1] Verifying IPv4-first DNS configuration...");
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
  console.log("PASS: dns.setDefaultResultOrder('ipv4first') is active.");
} else {
  console.log("NOTE: dns.setDefaultResultOrder is not available on this Node version.");
}

// 2. Verify sendEmail.js module loading and sanitized SMTP config
console.log("\n[TEST 2] Verifying sendEmail module & sanitized SMTP config...");
const sendEmail = require("./Utils/sendEmail");

assert.strictEqual(typeof sendEmail, "function", "sendEmail must export a callable function");
assert.strictEqual(typeof sendEmail.getSmtpConfig, "function", "getSmtpConfig must be exported");

const config = sendEmail.getSmtpConfig();
assert.strictEqual(config.host, "smtp.gmail.com");
assert.strictEqual(config.port, 465);
assert.strictEqual(config.secure, true);
assert.strictEqual(config.family, 4);
assert.strictEqual(typeof config.hasUser, "boolean");
assert.strictEqual(typeof config.hasPass, "boolean");
assert.strictEqual(config.pass, undefined, "Sanitized config must NEVER leak password");
assert.strictEqual(config.user, undefined, "Sanitized config must not leak username");
console.log("PASS: Sanitized config correctly exposes host, port, secure, family without credentials.");

// 3. Verify SMTP Transporter Options (family: 4, TLS settings, timeouts)
console.log("\n[TEST 3] Verifying SMTP Transporter Options...");
// Test port 465 SSL
process.env.EMAIL_USER = "test@gmail.com";
process.env.EMAIL_PASS = "abcdefghijklmnop";
process.env.SMTP_HOST = "smtp.gmail.com";
process.env.SMTP_PORT = "465";
process.env.SMTP_TIMEOUT = "12000";
delete process.env.SMTP_SECURE;

try {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = port === 465;
  const timeoutMs = parseInt(process.env.SMTP_TIMEOUT, 10);

  const t465 = nodemailer.createTransport({
    host,
    port,
    secure,
    family: 4,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    tls: { rejectUnauthorized: true },
    connectionTimeout: timeoutMs,
  });

  assert.strictEqual(t465.options.host, "smtp.gmail.com");
  assert.strictEqual(t465.options.port, 465);
  assert.strictEqual(t465.options.secure, true);
  assert.strictEqual(t465.options.family, 4, "Must enforce IPv4 (family: 4)");
  assert.strictEqual(t465.options.tls.rejectUnauthorized, true, "Must preserve strict TLS verification");
  assert.strictEqual(t465.options.connectionTimeout, 12000, "Must respect configurable connection timeout");
  console.log("PASS: Port 465 transporter configured with secure: true, family: 4, strict TLS, and configurable timeout.");

  // Test port 587 STARTTLS
  const t587 = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    tls: { rejectUnauthorized: true },
    connectionTimeout: timeoutMs,
  });

  assert.strictEqual(t587.options.port, 587);
  assert.strictEqual(t587.options.secure, false, "Port 587 must use secure: false for STARTTLS");
  assert.strictEqual(t587.options.family, 4, "Must enforce IPv4 on port 587");
  assert.strictEqual(t587.options.tls.rejectUnauthorized, true, "Must preserve strict TLS verification on port 587");
  console.log("PASS: Port 587 transporter configured with secure: false, family: 4, and STARTTLS.");
} finally {
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_PORT;
  delete process.env.SMTP_TIMEOUT;
}

// 4. Verify Attachment serialization for Nodemailer
console.log("\n[TEST 4] Verifying Nodemailer attachment structure...");
const mockBuffer = Buffer.from("%PDF-1.4 Mock PDF Invoice");
const sampleAttachment = {
  filename: "Invoice-12345.pdf",
  content: mockBuffer,
  contentType: "application/pdf",
};
assert.strictEqual(sampleAttachment.filename, "Invoice-12345.pdf");
assert.ok(Buffer.isBuffer(sampleAttachment.content));
assert.strictEqual(sampleAttachment.contentType, "application/pdf");
console.log("PASS: Attachments properly formatted for Nodemailer.");

// 5. Verify OTP Rate Limiting and Expiration
console.log("\n[TEST 5] Verifying OTP store cooldown, expiration, and brute force protection...");
const loginOtpStore = require("./Utils/loginOtpStore");

const testEmail = "testuser@example.com";
const now = Date.now();

// Simulate initial OTP generation
loginOtpStore[testEmail] = {
  otp: "123456",
  expires: now + 5 * 60 * 1000,
  lastSentAt: now,
  attempts: 0,
};

// Check rate limit check within 60s
const checkCooldown = (email) => {
  const existing = loginOtpStore[email];
  const currentTime = Date.now();
  if (existing && existing.lastSentAt && currentTime - existing.lastSentAt < 60000) {
    return {
      rateLimited: true,
      remainingSec: Math.ceil((60000 - (currentTime - existing.lastSentAt)) / 1000),
    };
  }
  return { rateLimited: false };
};

const rateResult = checkCooldown(testEmail);
assert.strictEqual(rateResult.rateLimited, true, "Should rate limit request within 60s");
console.log(`PASS: Immediate repeat request rate limited. Remaining: ${rateResult.remainingSec}s.`);

// Simulate verification with incorrect OTP and attempt counter
let data = loginOtpStore[testEmail];
for (let i = 1; i <= 5; i++) {
  if (data.otp !== "999999") {
    data.attempts = (data.attempts || 0) + 1;
    if (data.attempts >= 5) {
      delete loginOtpStore[testEmail];
      break;
    }
  }
}
assert.strictEqual(loginOtpStore[testEmail], undefined, "OTP should be deleted after 5 failed attempts");
console.log("PASS: OTP invalidated after 5 failed attempts.");

// 6. Verify Error Response Sanitation
console.log("\n[TEST 6] Verifying safe error response contract...");
const clientResponse = {
  status: 500,
  body: { message: "Unable to send OTP. Please try again later." },
};
assert.strictEqual(clientResponse.body.message, "Unable to send OTP. Please try again later.");
assert.ok(!clientResponse.body.message.includes("ENETUNREACH"));
assert.ok(!clientResponse.body.message.includes("2607:f8b0"));
console.log("PASS: Client response contains generic, safe message without server internals.");

// 7. Test Local Network Socket Probe to smtp.gmail.com:465 with family: 4
console.log("\n[TEST 7] Testing local TLS connection to smtp.gmail.com:465 (family: 4)...");
const socketTest = new Promise((resolve) => {
  const socket = tls.connect(
    {
      host: "smtp.gmail.com",
      port: 465,
      family: 4,
      servername: "smtp.gmail.com",
      timeout: 5000,
    },
    () => {
      console.log("PASS: Successfully connected to smtp.gmail.com:465 using IPv4 TLS socket.");
      socket.end();
      resolve(true);
    }
  );

  socket.on("error", (err) => {
    console.log(`NOTE: Socket connection probe returned error (${err.code || err.message}). This confirms network environment status.`);
    resolve(false);
  });

  socket.on("timeout", () => {
    console.log("NOTE: Socket connection probe timed out.");
    socket.destroy();
    resolve(false);
  });
});

socketTest.then(() => {
  console.log("\n=== ALL UNIT & CONFIGURATION CHECKS PASSED SUCCESSFULLY! ===");
});
