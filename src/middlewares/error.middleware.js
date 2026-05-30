const errorHandler = (err, req, res, next) => {
  // if no status code on error, use 500
  const statusCode =
    err.status || (res.statusCode !== 200 ? res.statusCode : 500);

  const response = {
    success: false,
    message: err.message || "Internal Server Error",
  };

  // include code if available
  if (err.code) {
    response.code = err.code;
  }

  // include details if available (for validation errors)
  if (err.details) {
    response.details = err.details;
  }

  // include stack trace only in development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
