import redisClient from './redis.js';

export const sessionManager = {
  async store(userId, token) {
    await redisClient.setEx(`auth:${userId}`, 86400, token); // 24 hours
  },

  async validate(userId, token) {
    const storedToken = await redisClient.get(`auth:${userId}`);
    return token === storedToken;
  },

  async remove(userId) {
    await redisClient.del(`auth:${userId}`);
  }
};