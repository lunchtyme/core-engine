import { Agenda } from '@hokify/agenda';
import { loadEnv } from '../../utils';
import { sharedServices } from '../../services';
import logger from '../../utils/logger';

// Load environment variables
loadEnv(process.env.NODE_ENV!);

const mongoURI = process.env.AGENDA_MONGO_URI;

if (!mongoURI) {
  throw new Error('AGENDA_MONGO_URI is not defined.');
}

export const agenda = new Agenda({
  db: { address: mongoURI, collection: 'agendaJobs' },
  processEvery: '30 seconds', // Ensures jobs are processed frequently
});

agenda.define(
  'sendPeriodicLunchReminderNotification',
  async (job) => {
    try {
      await sharedServices.sendPeriodicEmailNotificationsForLunchReminder();
    } catch (error) {
      logger.error(`Error running schedule: 'sendPeriodicLunchReminderNotification'`, {
        error,
        job,
      });
      throw error;
    }
  },
  { priority: 'high' },
);

agenda.every('1 minutes', 'sendPeriodicLunchReminderNotification');

// Schedule event tracking
// Event: Job started
agenda.on('start', (job) => {
  logger.info(`Job ${job.attrs.name} starting`, { jobId: job.attrs._id });
});

// Event: Job completed
agenda.on('complete', (job) => {
  logger.info(`Job ${job.attrs.name} completed`, { jobId: job.attrs._id });
});

// Event: Job succeeded
agenda.on('success:sendPeriodicLunchReminderNotification', (job) => {
  logger.info(`Job ${job.attrs.name} succeeded`, { jobId: job.attrs._id });
});

// Event: Job failed
agenda.on(
  'fail:sendPeriodicLunchReminderNotification',
  (err: Error, job: { attrs: { name: any; _id: any } }) => {
    logger.error(`Job ${job.attrs.name} failed with error: ${err.message}`, {
      jobId: job.attrs._id,
      error: err,
    });
  },
);
