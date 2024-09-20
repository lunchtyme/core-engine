import { Worker as TaskHandler } from 'bullmq';
import { queueConnection } from '../connect';
import { sendEmail } from '../../../utils';
import logger from '../../../utils/logger';

export const mailTaskHandler = new TaskHandler(
  'emailQueue',
  async (job) => {
    logger.info('Processing email job:', job.id);
    try {
      await sendEmail(job.data);
    } catch (error) {
      logger.error('Error processing email job', error);
      throw error;
    }
  },
  {
    connection: queueConnection, // New connection instance
  },
);

mailTaskHandler.on('completed', (job) => {
  logger.info(`Email worker done processing job ${job.id}`);
  console.log(`Email worker done processing job ${job.id}`);
});

mailTaskHandler.on('error', (err) => {
  logger.error('Email worker error:', err);
  console.error('Email worker error:', err.message);
});
