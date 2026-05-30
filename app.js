import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import logger from "./src/utils/logger.js";
import errorHandler from "./src/middlewares/error.middleware.js";
import router from "./src/routes/index.js";
import { ensureUploadDirectory } from "./src/modules/uploads/uploads.service.js";

const app = express();

// ensure upload directory exists
ensureUploadDirectory();

// enable security headers
app.use(helmet());

// enable cors
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  }),
);

// app level middlewares -> compress response payloads
app.use(compression());
// parse incoming json
app.use(express.json());
// parse url encoded payloads
app.use(express.urlencoded({ extended: true }));
// parse cookies
app.use(cookieParser());
// log incoming requests
app.use(pinoHttp({ logger }));

// serve uploaded files statically (read-only)
app.use("/uploads", express.static(process.env.UPLOAD_DIR || "uploads"));

// register application routes
app.use("/api/v1", router);

// handle global errors
app.use(errorHandler);

export default app;
