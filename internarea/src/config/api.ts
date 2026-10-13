export const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://internshala-backend-5ycp.onrender.com"
).replace(/\/+$/, "");

export const API_URL = `${BACKEND_URL}/api`;

export const RAZORPAY_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_THGu4hzb5NO39H";
