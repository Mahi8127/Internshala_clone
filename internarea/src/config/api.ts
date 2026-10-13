/**
 * Centralized API configuration for InternArea frontend.
 * Supports environment variables with production fallback to the active Render backend.
 */

const DEFAULT_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://internshala-clone-1-d6ig.onrender.com";

export const BACKEND_URL = DEFAULT_BACKEND_URL.replace(/\/+$/, "");

export const API_URL = `${BACKEND_URL}/api`;

export const RAZORPAY_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_THGu4hzb5NO39H";

export default {
  BACKEND_URL,
  API_URL,
  RAZORPAY_KEY_ID,
};
