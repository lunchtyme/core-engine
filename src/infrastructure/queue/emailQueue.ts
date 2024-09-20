import { Queue } from 'bullmq';
import { queueConnection } from './connect';

export const emailQueue = new Queue('emailQueue', {
  connection: queueConnection,
});
