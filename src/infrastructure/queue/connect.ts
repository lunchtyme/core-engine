import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { loadEnv } from '../../utils';

loadEnv(process.env.NODE_ENV!);
export const queueConnection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

queueConnection.on('connect', () => {
  console.log('Queue connection is active');
});

queueConnection.on('error', (err) => {
  console.error('Queue failed to connect:', err);
  process.exit(0);
});

export const emailQueue = new Queue('emailQueue', {
  connection: queueConnection,
});
