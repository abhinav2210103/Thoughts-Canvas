require('dotenv').config();
const Redis = require('ioredis');

const client = new Redis(process.env.REDIS_URL);

client.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = client;