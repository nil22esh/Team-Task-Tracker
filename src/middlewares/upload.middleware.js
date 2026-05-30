import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import ApiError from "../utils/ApiError.js";

// Allowed file types
const ALLOWED_MIME_TYPES = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
};

const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".pdf", ".doc", ".docx"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || "uploads";
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const ext = path.extname(file.originalname).toLowerCase();
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// Validate uploaded file
const fileFilter = (req, file, cb) => {
  // Check MIME type
  if (!ALLOWED_MIME_TYPES[file.mimetype]) {
    return cb(
      new ApiError(
        400,
        "INVALID_FILE_TYPE",
        `File type ${file.mimetype} is not supported. Allowed types: ${Object.keys(ALLOWED_MIME_TYPES).join(", ")}`,
      ),
      false,
    );
  }

  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(
      new ApiError(
        400,
        "INVALID_FILE_EXTENSION",
        `File extension ${ext} is not allowed`,
      ),
      false,
    );
  }

  cb(null, true);
};

// Configure multer upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

// Custom error handler for multer
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        error: {
          code: "FILE_TOO_LARGE",
          message: `File size exceeds limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        },
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        error: {
          code: "TOO_MANY_FILES",
          message: `Maximum ${MAX_FILES} files allowed`,
        },
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        error: {
          code: "UNEXPECTED_FILE",
          message: "Unexpected file field",
        },
      });
    }
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  next(err);
};
