import { Worker as TaskHandler } from 'bullmq';
import { queueConnection } from '../connect';
import { logger, sendEmail } from '../../../utils';

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
    connection: queueConnection,
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
