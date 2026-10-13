// Lightweight in-memory rate limiting middleware
const createRateLimiter = ({
  windowMs = 15 * 60 * 1000, // 15 minutes
  max = 100, // max requests per window
  message = "Too many requests from this IP, please try again later."
} = {}) => {
  const hits = new Map();

  // Periodic cleanup of expired records every 5 minutes
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      if (now > record.resetTime) {
        hits.delete(key);
      }
    }
  }, 5 * 60 * 1000);
  
  // Unref cleanup so it does not block node process exit
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return (req, res, next) => {
    if (process.env.NODE_ENV === "test") {
      return next();
    }

    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || "unknown";
    const now = Date.now();
    let record = hits.get(ip);

    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      hits.set(ip, record);
      return next();
    }

    record.count += 1;
    if (record.count > max) {
      const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
      res.set("Retry-After", String(retryAfterSec));
      return res.status(429).json({
        message,
        retryAfter: retryAfterSec
      });
    }

    next();
  };
};

module.exports = { createRateLimiter };
