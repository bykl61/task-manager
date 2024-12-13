import redisClient from '../config/redis.js';

export const clearCache = async (pattern) => {
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
    console.log(`Deleted ${keys.length} cache keys for pattern: ${pattern}`);
  }
};