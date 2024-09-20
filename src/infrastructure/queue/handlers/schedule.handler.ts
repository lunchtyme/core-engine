import { Worker as TaskHandler } from 'bullmq';
import { queueConnection } from '../connect';
import logger from '../../../utils/logger';
import { individualRepository } from '../../../services';

export const scheduleTaskHandler = new TaskHandler(
  'processedAtQueue',
  async (job) => {
    logger.info('Updating processed at:', job.id);
    try {
      await individualRepository.updateProcessedAt(job.data);
    } catch (error) {
      logger.error('Error updating processed at', error);
      throw error;
    }
  },
  {
    connection: queueConnection,
  },
);

scheduleTaskHandler.on('completed', (job) => {
  logger.info(`processed_at worker done processing job ${job.id}`);
  console.log(`processed_at worker done processing job ${job.id}`);
});

scheduleTaskHandler.on('error', (err) => {
  logger.error('processed_at worker error:', err);
  console.error('processed_at worker error:', err.message);
});
