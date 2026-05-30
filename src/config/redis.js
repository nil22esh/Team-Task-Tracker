import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
  enableOfflineQueue: true,
  retryStrategy(times) {
    const delay = Math.min(times * 100, 3000);
    return delay;
  },
  reconnectOnError(err) {
    const targetError = "READONLY";
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
});

// handle successful connection
redisClient.on("connect", () => {
  console.log("redis connected");
});

// handle redis ready state
redisClient.on("ready", () => {
  console.log("redis ready");
});

// handle redis errors
redisClient.on("error", (error) => {
  console.error("redis error:", error.message);
});

// handle redis reconnection
redisClient.on("reconnecting", () => {
  console.log("redis reconnecting");
});

export default redisClient;
