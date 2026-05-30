import { Router } from "express";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "./auth.validation.js";
import {
  loginUser,
  logoutUser,
  refreshTokenForUser,
  registerUser,
} from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { apiRateLimiter } from "../../middlewares/rateLimit.middleware.js";

const authRouter = Router();

// register first organization admin
authRouter.post(
  "/register",
  apiRateLimiter,
  validate(registerSchema),
  registerUser,
);

// login existing user
authRouter.post("/login", apiRateLimiter, validate(loginSchema), loginUser);

// rotate refresh token
authRouter.post("/refresh-token", refreshTokenForUser);

// logout current user
authRouter.post("/logout", authenticate, logoutUser);

export default authRouter;
