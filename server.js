import dotenv from "dotenv";
// configure env variables
dotenv.config();

import http from "http";
import app from "./app.js";
import pool from "./src/config/db.js";
import logger from "./src/utils/logger.js";
// import redisClient from "./src/config/redis.js";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// start server function
const startServer = async () => {
  try {
    // connect postgres database
    await pool.connect();
    logger.info("database connected successfully");
    // connect redis server
    await redisClient.connect();
    logger.info("redis connected successfully");
    // start express server
    server.listen(PORT, () => {
      logger.info(`server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

// graceful shutdown handler
const gracefulShutdown = async () => {
  try {
    logger.warn("shutting down server gracefully");
    // disconnect postgres forcefully
    await pool.end();
    // disconnect redis gracefuly
    await redisClient.quit();
    // close http server
    server.close(() => {
      logger.info("server closed successfully");
      process.exit(0);
    });
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

// handle termination signals
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

// start application
startServer();
