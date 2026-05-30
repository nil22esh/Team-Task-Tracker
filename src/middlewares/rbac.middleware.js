import ApiError from "../utils/ApiError.js";

// authorize user roles
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // validate authenticated user
    if (!req.user) {
      return next(new ApiError(401, "UNAUTHORIZED", "authentication required"));
    }

    // validate user role access
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          "FORBIDDEN",
          "you do not have permission to access this resource",
        ),
      );
    }

    next();
  };
};
