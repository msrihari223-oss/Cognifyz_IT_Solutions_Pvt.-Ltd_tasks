const Redis = require('ioredis');
require('dotenv').config();

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const url = new URL(redisUrl);
const redisOptions = {
  maxRetriesPerRequest: null,
  tls: url.protocol === 'rediss:' ? {} : undefined
};

const redis = new Redis(redisUrl, redisOptions);

redis.on('error', err => {
  console.error('Redis connection error:', err.message || err);
});

redis.on('connect', () => {
  console.log('Connected to Redis at', redisUrl);
});

module.exports = {
  redis,
  redisConnectionOptions: {
    connection: {
      host: url.hostname,
      port: Number(url.port) || 6379,
      username: url.username || undefined,
      password: url.password || undefined,
      db: url.pathname && url.pathname.length > 1 ? Number(url.pathname.slice(1)) : undefined,
      maxRetriesPerRequest: null,
      tls: url.protocol === 'rediss:' ? {} : undefined
    }
  }
};
