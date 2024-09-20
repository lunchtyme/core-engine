import { Queue } from 'bullmq';
import { queueConnection } from './connect';

export const processAtQueue = new Queue('processedAtQueue', {
  connection: queueConnection,
});
