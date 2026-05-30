import { findUserById } from "../modules/auth/auth.repository.js";
import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";

// authenticate incoming request
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // validate authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new ApiError(401, "UNAUTHORIZED", "access token is required"),
      );
    }

    // extract bearer token
    const token = authHeader.split(" ")[1];
    // verify jwt token
    const decoded = verifyAccessToken(token);

    // fetch authenticated user
    const user = await findUserById(decoded.userId);
    // validate user existence
    if (!user) {
      return next(new ApiError(401, "UNAUTHORIZED", "user does not exist"));
    }

    // attach user to request
    req.user = user;
    next();
  } catch (error) {
    return next(
      new ApiError(401, "UNAUTHORIZED", "invalid or expired access token"),
    );
  }
};
