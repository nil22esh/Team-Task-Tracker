import redis from "../../config/redis.js";

const TASK_ASSIGNEE_CACHE_PREFIX = "tasks:assignee";

export const getTaskCacheKey = ({
  assignee_id,
  page,
  limit,
  status,
  priority,
}) => {
  return [
    "tasks",
    assignee_id || "all",
    page,
    limit,
    status || "all",
    priority || "all",
  ].join(":");
};

export const getCachedTasks = async (filters) => {
  const key = getTaskCacheKey(filters);
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const setCachedTasks = async (filters, data, ttl = 300) => {
  const key = getTaskCacheKey(filters);
  await redis.set(key, JSON.stringify(data), "EX", ttl);
};

export const invalidateTaskCache = async (assignee_id = null) => {
  try {
    if (assignee_id) {
      // Invalidate cache for specific assignee
      const pattern = `tasks:${assignee_id}:*`;
      const keys = await redis.keys(pattern);
      if (keys.length) {
        await redis.del(...keys);
      }
    } else {
      // Invalidate all task caches
      const keys = await redis.keys("tasks:*");
      if (keys.length) {
        await redis.del(...keys);
      }
    }
  } catch (error) {
    console.error("Error invalidating task cache:", error.message);
  }
};
