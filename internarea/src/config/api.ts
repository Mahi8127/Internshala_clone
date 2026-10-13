const rawApiUrl = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://internshala-backend-5ycp.onrender.com"
)
  .trim()
  .replace(/\/+$/, "");

// Normalize BACKEND_URL without trailing /api
export const BACKEND_URL = rawApiUrl.endsWith("/api")
  ? rawApiUrl.slice(0, -4)
  : rawApiUrl;

// Normalize API_URL ensuring it ends with /api
export const API_URL = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl}/api`;

export const RAZORPAY_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_THGu4hzb5NO39H";
