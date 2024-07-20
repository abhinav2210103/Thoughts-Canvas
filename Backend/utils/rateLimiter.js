const redis = require("./redis");

async function rateLimiter(ip, maxRequests, windowSeconds) {
  try {
    const requests = await redis.incr(ip);
    if (requests === 1) {
      await redis.expire(ip, windowSeconds);
    }
    if (requests > maxRequests) {
      return { allowed: false, requests };
    }
    return { allowed: true, requests };
  } catch (error) {
    console.error('Error in rateLimiter:', error);
    return { allowed: false, error: 'Internal Server Error' };
  }
}

module.exports = rateLimiter;