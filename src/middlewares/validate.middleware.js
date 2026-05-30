import ApiError from "../utils/ApiError.js";

// validate incoming request payload
export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      // validate request body only
      await schema.parseAsync(req.body);

      next();
    } catch (error) {
      // Handle Zod validation errors
      if (error.issues) {
        const validationErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        }));

        return next(
          new ApiError({
            status: 400,
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            details: validationErrors,
          }),
        );
      }

      next(error);
    }
  };
};
