import { Worker as TaskHandler } from 'bullmq';
import { queueConnection } from '../connect';
import { sendEmail } from '../../../utils';

export const mailTaskHandler = new TaskHandler(
  'emailQueue',
  async (job) => {
    console.log('Processing email job:', job.id);
    try {
      await sendEmail(job.data);
    } catch (error) {
      console.error('Error processing email job:', error);
      throw error;
    }
  },
  {
    connection: queueConnection,
  },
);

mailTaskHandler.on('completed', (job) => {
  console.log(`Email worker done processing job ${job.id}`);
});

mailTaskHandler.on('error', (err) => {
  console.error('Email worker error:', err.message);
});
