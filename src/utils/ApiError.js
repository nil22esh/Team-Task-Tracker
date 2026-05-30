class ApiError extends Error {
  constructor(
    statusOrError = 500,
    code = "INTERNAL_SERVER_ERROR",
    message = "something went wrong",
  ) {
    // handle both object and positional parameters
    let status, errorCode, errorMessage, details;

    if (typeof statusOrError === "object" && statusOrError !== null) {
      // object format: { status, code, message, details }
      status = statusOrError.status || 500;
      errorCode = statusOrError.code || "INTERNAL_SERVER_ERROR";
      errorMessage = statusOrError.message || "something went wrong";
      details = statusOrError.details;
    } else {
      // positional parameters format
      status = statusOrError;
      errorCode = code;
      errorMessage = message;
    }

    // calls parent constructor
    super(errorMessage);
    // assign properties
    this.status = status;
    this.code = errorCode;
    if (details) {
      this.details = details;
    }
    // creates clean stack traces
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
