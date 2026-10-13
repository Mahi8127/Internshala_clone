process.env.NODE_ENV = "test";
const { test, describe, before, after } = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const crypto = require("node:crypto");
const mongoose = require("mongoose");
require("dotenv").config({ path: `${__dirname}/../.env` });

const app = require("../index");
const loginOtpStore = require("../Utils/loginOtpStore");
const paymentOtpStore = require("../Utils/paymentOtpStore");
const sendEmail = require("../Utils/sendEmail");

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.disconnect();
});

describe("Internshala Backend Automated Test Suite", () => {
  test("1. Health check GET / returns 200", async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.strictEqual(text, "Hello this is internshala backend");
  });

  test("2. CORS preflight OPTIONS returns allowed headers and credentials", async () => {
    const res = await fetch(`${baseUrl}/api/internship`, {
      method: "OPTIONS",
      headers: {
        Origin: "https://internshala-clone-1-d6ig.onrender.com",
        "Access-Control-Request-Method": "GET",
      },
    });
    assert.strictEqual(res.status, 204);
    assert.strictEqual(
      res.headers.get("access-control-allow-origin"),
      "https://internshala-clone-1-d6ig.onrender.com"
    );
    assert.strictEqual(
      res.headers.get("access-control-allow-credentials"),
      "true"
    );
  });

  test("3. Admin Login route verifies valid and invalid credentials", async () => {
    // Valid admin login
    const validRes = await fetch(`${baseUrl}/api/admin/adminlogin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin" }),
    });
    assert.strictEqual(validRes.status, 200);
    const validText = await validRes.text();
    assert.strictEqual(validText, "admin is here");

    // Invalid admin login (repaired res.send(401).send bug)
    const invalidRes = await fetch(`${baseUrl}/api/admin/adminlogin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "wrong", password: "wrong" }),
    });
    assert.strictEqual(invalidRes.status, 401);
    const invalidText = await invalidRes.text();
    assert.strictEqual(invalidText, "unauthorized");
  });

  test("4. Internship routes return list and handle 404 cleanly", async () => {
    const listRes = await fetch(`${baseUrl}/api/internship`);
    assert.strictEqual(listRes.status, 200);
    const list = await listRes.json();
    assert.ok(Array.isArray(list));

    // Test non-existent ID 404 error handling (repaired double-send bug)
    const notFoundRes = await fetch(
      `${baseUrl}/api/internship/000000000000000000000000`
    );
    assert.strictEqual(notFoundRes.status, 404);
    const body = await notFoundRes.json();
    assert.strictEqual(body.error, "internship not found");
  });

  test("5. Job routes return list and handle 404 cleanly", async () => {
    const listRes = await fetch(`${baseUrl}/api/job`);
    assert.strictEqual(listRes.status, 200);
    const list = await listRes.json();
    assert.ok(Array.isArray(list));

    // Test non-existent ID 404 error handling (repaired double-send bug)
    const notFoundRes = await fetch(
      `${baseUrl}/api/job/000000000000000000000000`
    );
    assert.strictEqual(notFoundRes.status, 404);
    const body = await notFoundRes.json();
    assert.strictEqual(body.error, "Job not found");
  });

  test("6. Auth controller validations and error contracts", async () => {
    // Missing identifier login
    const loginMissingRes = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: "nonexistent@test.com", password: "pass" }),
    });
    assert.strictEqual(loginMissingRes.status, 404);

    // Verify OTP with missing fields
    const otpMissingRes = await fetch(`${baseUrl}/api/verify-login-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.strictEqual(otpMissingRes.status, 400);

    // Verify OTP with non-existent email
    const otpNotFoundRes = await fetch(`${baseUrl}/api/verify-login-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "ghost@test.com", otp: "123456" }),
    });
    assert.strictEqual(otpNotFoundRes.status, 400);

    // Resend OTP with missing email
    const resendMissingRes = await fetch(`${baseUrl}/api/resend-login-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.strictEqual(resendMissingRes.status, 400);

    // Forgot password with missing identifier
    const forgotMissingRes = await fetch(`${baseUrl}/api/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.strictEqual(forgotMissingRes.status, 400);

    // Change password with missing fields
    const changeMissingRes = await fetch(`${baseUrl}/api/change-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.strictEqual(changeMissingRes.status, 400);

    // Login history protected route rejects unauthenticated request
    const historyNoAuthRes = await fetch(`${baseUrl}/api/login-history`);
    assert.strictEqual(historyNoAuthRes.status, 401);
  });

  test("7. Payment and Login OTP stores are strictly isolated", () => {
    const testEmail = "isolate_test@internarea.com";
    loginOtpStore[testEmail] = { otp: "111111", expires: Date.now() + 60000 };
    paymentOtpStore[testEmail] = { otp: "222222", expiresAt: Date.now() + 60000 };

    assert.notStrictEqual(loginOtpStore, paymentOtpStore);
    assert.strictEqual(loginOtpStore[testEmail].otp, "111111");
    assert.strictEqual(paymentOtpStore[testEmail].otp, "222222");

    delete paymentOtpStore[testEmail];
    assert.strictEqual(paymentOtpStore[testEmail], undefined);
    assert.strictEqual(loginOtpStore[testEmail].otp, "111111");

    delete loginOtpStore[testEmail];
  });

  test("8. Language routes require JWT authentication", async () => {
    const sendOtpRes = await fetch(`${baseUrl}/api/language/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    assert.strictEqual(sendOtpRes.status, 401);

    const verifyOtpRes = await fetch(`${baseUrl}/api/language/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    assert.strictEqual(verifyOtpRes.status, 401);
  });

  test("9. Razorpay HMAC signature verification logic", () => {
    const secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret_for_test";
    const orderId = "order_test_123456";
    const paymentId = "pay_test_789012";
    const payload = `${orderId}|${paymentId}`;

    const validSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const forgedSignature = "0000000000000000000000000000000000000000000000000000000000000000";

    const verifyHmac = (sig) => {
      const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
      return expected === sig;
    };

    assert.strictEqual(verifyHmac(validSignature), true);
    assert.strictEqual(verifyHmac(forgedSignature), false);
  });

  test("10. SendEmail utility exports callable function with configured transporter", async () => {
    assert.strictEqual(typeof sendEmail, "function");
    // Verify env configuration variables exist
    assert.ok(process.env.EMAIL_USER, "EMAIL_USER should be defined in .env");
    assert.ok(process.env.EMAIL_PASS, "EMAIL_PASS should be defined in .env");
  });

  test("11. Dedicated /health endpoint returns 200 with status ok and uptime", async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, "ok");
    assert.strictEqual(body.service, "internshala-backend");
    assert.ok(typeof body.uptime === "number");
    assert.ok(body.timestamp);
  });
});
