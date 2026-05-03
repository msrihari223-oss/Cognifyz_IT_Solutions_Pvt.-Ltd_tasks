require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { redis } = require('./lib/redisClient');
const { taskQueue } = require('./lib/taskQueue');

const app = express();
const port = process.env.PORT || 4000;
const cacheTTL = Number(process.env.CACHE_TTL_SECONDS || 60);

// Middleware: body parsing and logging
app.use(express.json());
app.use(morgan('tiny'));
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'Express middleware + Redis background jobs + caching is running' });
});

app.get('/data', async (req, res) => {
  const key = req.query.key || 'default';
  const cacheKey = `cache:${key}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ key, value: JSON.parse(cached), source: 'cache' });
    }

    const value = {
      key,
      generatedAt: new Date().toISOString(),
      info: `This response was generated for ${key}`
    };

    await redis.set(cacheKey, JSON.stringify(value), 'EX', cacheTTL);
    return res.json({ key, value, source: 'origin' });
  } catch (error) {
    console.error('Cache error:', error);
    return res.status(500).json({ error: 'Unable to fetch cached data' });
  }
});

app.post('/task', async (req, res) => {
  const { taskType = 'default', payload = {} } = req.body;

  if (!taskType) {
    return res.status(400).json({ error: 'taskType is required' });
  }

  try {
    const job = await taskQueue.add('task', {
      taskType,
      payload,
      createdAt: new Date().toISOString()
    });

    return res.status(202).json({ jobId: job.id, status: 'queued' });
  } catch (error) {
    console.error('Queue error:', error);
    return res.status(500).json({ error: 'Unable to enqueue task' });
  }
});

app.get('/task/:id', async (req, res) => {
  try {
    const job = await taskQueue.getJob(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const state = await job.getState();
    return res.json({ id: job.id, state, data: job.data, attemptsMade: job.attemptsMade });
  } catch (error) {
    console.error('Job lookup error:', error);
    return res.status(500).json({ error: 'Unable to fetch job status' });
  }
});

app.post('/cache/clear', async (req, res) => {
  try {
    const keys = await redis.keys('cache:*');
    if (keys.length > 0) {
      await redis.del(keys);
    }
    return res.json({ cleared: keys.length });
  } catch (error) {
    console.error('Cache clear error:', error);
    return res.status(500).json({ error: 'Unable to clear cache' });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});