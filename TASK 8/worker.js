require('dotenv').config();
const { Worker } = require('bullmq');
const { redisConnectionOptions } = require('./lib/redisClient');

const queueName = 'background-tasks';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const worker = new Worker(
  queueName,
  async job => {
    console.log(`Processing job ${job.id} [type=${job.data.taskType}]`);

    await delay(2000);

    const result = {
      processedAt: new Date().toISOString(),
      taskType: job.data.taskType,
      payload: job.data.payload,
      note: 'Job completed successfully'
    };

    console.log(`Completed job ${job.id}`);
    return result;
  },
  redisConnectionOptions
);

worker.on('completed', job => {
  console.log(`Job completed: ${job.id}`);
});

worker.on('failed', (job, err) => {
  console.error(`Job failed: ${job?.id} error=${err.message}`);
});

worker.on('error', err => {
  console.error('Worker error:', err);
});

console.log(`Worker listening for jobs on '${queueName}'`);
