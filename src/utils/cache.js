import redisClient from "../config/redis.js";

import logger from "./logger.js";

// get cache value
export const getCache = async (key) => {
  try {
    if (!redisClient.status || redisClient.status === "reconnecting") {
      return null;
    }
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`Cache GET error for key ${key}:`, error.message);
    return null;
  }
};

// set cache value
export const setCache = async (key, value, ttl = 300) => {
  try {
    if (!redisClient.status || redisClient.status === "reconnecting") {
      return;
    }
    await redisClient.set(key, JSON.stringify(value), "EX", ttl);
  } catch (error) {
    logger.error(`Cache SET error for key ${key}:`, error.message);
  }
};

// delete cache value
export const deleteCache = async (key) => {
  try {
    if (!redisClient.status || redisClient.status === "reconnecting") {
      return;
    }
    await redisClient.del(key);
  } catch (error) {
    logger.error(`Cache DELETE error for key ${key}:`, error.message);
  }
};

// delete cache using pattern
export const deleteCachePattern = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length) {
      await redisClient.del(...keys);
    }
  } catch (error) {
    logger.error(error.message);
  }
};
