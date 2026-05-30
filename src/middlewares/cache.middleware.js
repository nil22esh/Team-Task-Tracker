import { getCache, setCache } from "../utils/cache.js";

// cache task list response
export const cacheTaskList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, priority, assignee } = req.query;
    // generate unique cache key
    const cacheKey = `tasks:assignee:${assignee || "all"}:page:${page}:limit:${limit}:status:${status || "all"}:priority:${priority || "all"}`;
    // fetch cached response
    const cachedData = await getCache(cacheKey);
    // return cached response
    if (cachedData) {
      return res.status(200).json(cachedData);
    }
    // preserve original response
    const originalJson = res.json.bind(res);
    // override response json
    res.json = async (body) => {
      // cache successful responses
      if (res.statusCode === 200) {
        await setCache(cacheKey, body, 300);
      }
      return originalJson(body);
    };
    next();
  } catch (error) {
    next(error);
  }
};
