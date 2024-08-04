const redis = require("./redis");

async function rateLimiterEmail(email, maxRequests, windowSeconds) {
  const key = `rate_limit:${email}`;
  try {
    const requests = await redis.incr(key);
    if (requests === 1) {
      await redis.expire(key, windowSeconds);
    }
    if (requests > maxRequests) {
      return { allowed: false, requests };
    }
    return { allowed: true, requests };
  } catch (error) {
    console.error('Error in rateLimiterEmail:', error);
    return { allowed: false, error: 'Internal Server Error' };
  }
}

module.exports = rateLimiterEmail;