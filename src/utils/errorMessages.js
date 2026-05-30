// authentication errors
export const AUTH_ERRORS = {
  ACCESS_TOKEN_REQUIRED: {
    status: 401,
    code: "UNAUTHORIZED",
    message: "access token is required",
  },

  INVALID_ACCESS_TOKEN: {
    status: 401,
    code: "UNAUTHORIZED",
    message: "invalid or expired access token",
  },

  INVALID_REFRESH_TOKEN: {
    status: 401,
    code: "INVALID_REFRESH_TOKEN",
    message: "invalid or expired refresh token",
  },

  USER_NOT_FOUND: {
    status: 404,
    code: "USER_NOT_FOUND",
    message: "user does not exist",
  },

  INVALID_CREDENTIALS: {
    status: 401,
    code: "INVALID_CREDENTIALS",
    message: "invalid email or password",
  },

  AUTHENTICATION_REQUIRED: {
    status: 401,
    code: "UNAUTHORIZED",
    message: "authentication required",
  },
};

// authorization errors
export const AUTHORIZATION_ERRORS = {
  FORBIDDEN: {
    status: 403,
    code: "FORBIDDEN",
    message: "you do not have permission to access this resource",
  },

  TASK_ACCESS_DENIED: {
    status: 403,
    code: "FORBIDDEN",
    message: "you are not allowed to access this task",
  },

  STATUS_UPDATE_DENIED: {
    status: 403,
    code: "FORBIDDEN",
    message: "only assignee or manager can update task status",
  },
};

// validation errors
export const VALIDATION_ERRORS = {
  INVALID_INPUT: {
    status: 400,
    code: "VALIDATION_ERROR",
    message: "invalid request payload",
  },

  INVALID_STATUS_TRANSITION: {
    status: 400,
    code: "INVALID_STATUS_TRANSITION",
    message: "invalid task status transition",
  },

  INVALID_DUE_DATE: {
    status: 400,
    code: "VALIDATION_ERROR",
    message: "due date must be a future date",
  },

  INVALID_FILE_TYPE: {
    status: 400,
    code: "INVALID_FILE_TYPE",
    message: "unsupported file format",
  },
};

// resource errors
export const RESOURCE_ERRORS = {
  USER_NOT_FOUND: {
    status: 404,
    code: "USER_NOT_FOUND",
    message: "user does not exist",
  },

  TASK_NOT_FOUND: {
    status: 404,
    code: "TASK_NOT_FOUND",
    message: "task does not exist",
  },

  PROJECT_NOT_FOUND: {
    status: 404,
    code: "PROJECT_NOT_FOUND",
    message: "project does not exist",
  },

  ORGANIZATION_NOT_FOUND: {
    status: 404,
    code: "ORGANIZATION_NOT_FOUND",
    message: "organization does not exist",
  },

  ROUTE_NOT_FOUND: {
    status: 404,
    code: "ROUTE_NOT_FOUND",
    message: "requested route does not exist",
  },
};

// database errors
export const DATABASE_ERRORS = {
  DUPLICATE_RESOURCE: {
    status: 409,
    code: "DUPLICATE_RESOURCE",
    message: "resource already exists",
  },

  DATABASE_ERROR: {
    status: 500,
    code: "DATABASE_ERROR",
    message: "database operation failed",
  },
};

// server errors
export const SERVER_ERRORS = {
  INTERNAL_SERVER_ERROR: {
    status: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: "something went wrong",
  },

  SERVICE_UNAVAILABLE: {
    status: 503,
    code: "SERVICE_UNAVAILABLE",
    message: "service temporarily unavailable",
  },
};

// rate limit errors
export const RATE_LIMIT_ERRORS = {
  TOO_MANY_REQUESTS: {
    status: 429,
    code: "TOO_MANY_REQUESTS",
    message: "too many requests from this ip, please try again later",
  },

  AUTH_RATE_LIMIT_EXCEEDED: {
    status: 429,
    code: "AUTH_RATE_LIMIT_EXCEEDED",
    message: "too many authentication attempts, please try again later",
  },
};
