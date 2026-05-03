const { Queue } = require('bullmq');
const { redisConnectionOptions } = require('./redisClient');

const queueName = 'background-tasks';
const taskQueue = new Queue(queueName, redisConnectionOptions);

module.exports = {
  taskQueue,
  queueName
};
