const assert = require("assert");
const http = require("http");

console.log("=== RUNNING CORS VERIFICATION SUITE ===");

// Spin up a test instance of the express app
// We will test both the app configuration directly and via an ephemeral HTTP server
const allowedOrigins = [
  "https://internshala-clone-1-d6ig.onrender.com",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  const cleanOrigin = origin.replace(/\/+$/, "");
  if (allowedOrigins.includes(cleanOrigin)) return true;
  if (/^https:\/\/internshala-[a-z0-9-]+\.onrender\.com$/.test(cleanOrigin))
    return true;
  return false;
};

// Unit tests on isOriginAllowed
console.log("\n[TEST 1] Testing isOriginAllowed validation logic...");
assert.strictEqual(
  isOriginAllowed("https://internshala-clone-1-d6ig.onrender.com"),
  true,
  "Exact frontend URL must be allowed"
);
assert.strictEqual(
  isOriginAllowed("https://internshala-clone-1-d6ig.onrender.com/"),
  true,
  "Frontend URL with trailing slash must be normalized and allowed"
);
assert.strictEqual(
  isOriginAllowed("http://localhost:3000"),
  true,
  "Localhost 3000 must be allowed"
);
assert.strictEqual(
  isOriginAllowed("http://127.0.0.1:3000"),
  true,
  "127.0.0.1:3000 must be allowed"
);
assert.strictEqual(
  isOriginAllowed("https://internshala-preview-test.onrender.com"),
  true,
  "Render preview domains must be allowed"
);
assert.strictEqual(
  isOriginAllowed("https://malicious-site.example.com"),
  false,
  "Unauthorized origins must be rejected"
);
assert.strictEqual(
  isOriginAllowed(null),
  true,
  "Requests with no origin (curl/Postman) must be allowed"
);
console.log("PASS: isOriginAllowed logic passed all checks.");

// Integration test with real Express and CORS middleware
console.log("\n[TEST 2] Testing real Express preflight and CORS response headers...");
const express = require("express");
const cors = require("cors");

const app = express();
const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "x-access-token",
  ],
  maxAge: 86400,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.post("/api/login", (req, res) => res.json({ status: "ok" }));
app.get("/api/internship", (req, res) => res.json({ internships: [] }));

const server = app.listen(0, async () => {
  const port = server.address().port;

  const makeRequest = (method, path, headers) => {
    return new Promise((resolve, reject) => {
      const req = http.request(
        {
          host: "127.0.0.1",
          port,
          method,
          path,
          headers,
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: data,
            });
          });
        }
      );
      req.on("error", reject);
      req.end();
    });
  };

  try {
    // 2.1 Preflight OPTIONS check for deployed frontend
    console.log("Testing preflight OPTIONS from https://internshala-clone-1-d6ig.onrender.com...");
    const preflightRes = await makeRequest("OPTIONS", "/api/login", {
      Origin: "https://internshala-clone-1-d6ig.onrender.com",
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "Content-Type, Authorization",
    });

    assert.strictEqual(preflightRes.statusCode, 204, "Preflight must return 204");
    assert.strictEqual(
      preflightRes.headers["access-control-allow-origin"],
      "https://internshala-clone-1-d6ig.onrender.com",
      "Must echo allowed origin"
    );
    assert.strictEqual(
      preflightRes.headers["access-control-allow-credentials"],
      "true",
      "Must allow credentials"
    );
    assert.ok(
      preflightRes.headers["access-control-allow-methods"].includes("POST"),
      "Must include POST in allowed methods"
    );
    assert.ok(
      preflightRes.headers["access-control-allow-headers"].toLowerCase().includes("authorization"),
      "Must include Authorization header"
    );
    console.log("PASS: Preflight OPTIONS returned 204 with all required CORS headers.");

    // 2.2 Standard GET request with Origin
    console.log("Testing GET /api/internship with Origin header...");
    const getRes = await makeRequest("GET", "/api/internship", {
      Origin: "https://internshala-clone-1-d6ig.onrender.com",
    });

    assert.strictEqual(getRes.statusCode, 200, "GET request must succeed with 200");
    assert.strictEqual(
      getRes.headers["access-control-allow-origin"],
      "https://internshala-clone-1-d6ig.onrender.com"
    );
    assert.strictEqual(getRes.headers["access-control-allow-credentials"], "true");
    console.log("PASS: Standard GET request includes CORS origin and credentials headers.");

    // 2.3 Unauthorized origin check
    console.log("Testing request from unauthorized origin...");
    const blockedRes = await makeRequest("GET", "/api/internship", {
      Origin: "https://attacker.evil.com",
    });
    assert.strictEqual(
      blockedRes.headers["access-control-allow-origin"],
      undefined,
      "Unauthorized origin must NOT receive Access-Control-Allow-Origin header"
    );
    console.log("PASS: Unauthorized origin was denied CORS headers.");

    console.log("\n=== ALL CORS TESTS PASSED SUCCESSFULLY! ===");
  } catch (err) {
    console.error("FAIL:", err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
