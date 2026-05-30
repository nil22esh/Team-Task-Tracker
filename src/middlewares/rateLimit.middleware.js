import rateLimit from "express-rate-limit";

// global api rate limiter
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    status: 429,
    code: "TOO_MANY_REQUESTS",
    message: "too many requests from this ip, please try again later",
  },
});

// strict auth route limiter
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    status: 429,
    code: "AUTH_RATE_LIMIT_EXCEEDED",
    message: "too many authentication attempts, please try again later",
  },
});
