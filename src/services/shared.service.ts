import moment from 'moment-timezone';
import { GetUserParams, IndividualRepository, UserRepository } from '../repository';
import { EMAIL_DATA, NotFoundError, SendEmailParams } from '../utils';
import logger from '../utils/logger';
import { processAtQueue } from '../infrastructure/queue/processAtQueue';
import { emailQueue } from '../infrastructure/queue/emailQueue';

export class SharedServices {
  constructor(
    private readonly _userRepo: UserRepository,
    private readonly _individualRepo: IndividualRepository,
    private readonly _emailQueue: typeof emailQueue,
    private readonly _processAtQueue: typeof processAtQueue,
    private readonly _logger: typeof logger,
  ) {}

  async getUserWithDetails(params: GetUserParams) {
    const user = await this._userRepo.getUserWithDetails(params);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async getUser(params: GetUserParams) {
    const user = await this._userRepo.getUser(params);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async checkUserExist(params: GetUserParams) {
    return await this._userRepo.checkUserExist(params);
  }

  async sendPeriodicEmailNotificationsForLunchReminder() {
    try {
      const records = await this._individualRepo.getLunchTimeRecords();
      const list = await this.filterLunchRecords(records);
      if (!list.length) {
        return;
      }
      for (const record of list) {
        const user = record.user;
        const emailPayload: SendEmailParams = {
          receiver: user.email,
          subject: EMAIL_DATA.subject.dailyNotification,
          template: EMAIL_DATA.template.dailyNotification,
          from: 'Lunchtyme Notifications <notifications@lunchtyme.store>',
          context: {
            name: `${record.first_name} ${record.last_name}`,
            email: user.email,
          },
        };
        // Send reminder email 2hr before their lunchtyme
        await this._emailQueue.add('mailer', emailPayload, {
          attempts: 5,
          removeOnComplete: true,
          delay: 1000,
        });

        // Set update the time the record was processed for daily notifications
        await this._processAtQueue.add(
          'processor',
          { record },
          {
            attempts: 5,
            removeOnComplete: true,
            delay: 2000,
          },
        );
      }
      this._logger.info('Daily menu notification reminder sent to user');
    } catch (error) {
      this._logger.error(
        'Error fetching and sending email to employees whose their lunch time is 2 hours from now',
        { error },
      );
      throw error;
    }
  }

  // Function to filter records
  private async filterLunchRecords(records: any) {
    return records.filter((record: any) => {
      const userTimeZone = record.user.time_zone;
      // Parse lunch_time in the user's time zone
      const [hour, minutePart] = record.lunch_time.split(':');
      const [minute, period] = minutePart.split(' '); // Handle AM/PM
      const hour24 = period === 'PM' ? (parseInt(hour) % 12) + 12 : parseInt(hour) % 12;
      const lunchMoment = moment.tz({ hour: hour24, minute: parseInt(minute) }, userTimeZone);
      // Get current time and target window in the user's time zone
      const now = moment().tz(userTimeZone);
      const targetTime = now.clone().add(2, 'hours');
      const bufferMinutes = 5;
      const startTime = targetTime.clone().subtract(bufferMinutes, 'minutes');
      const endTime = targetTime.clone().add(bufferMinutes, 'minutes');
      // Skip records that were already processed within this window
      if (record.processed_at) {
        const processedAt = moment(record.processed_at).tz(userTimeZone);
        const startOfToday = moment().tz(userTimeZone).startOf('day');
        const endOfToday = moment().tz(userTimeZone).endOf('day');
        // Check if it was already processed today and is within the time window
        if (processedAt.isBetween(startOfToday, endOfToday)) {
          return false; // Already processed today, skip
        }
      }
      // Check if lunch time is within the target window
      return lunchMoment.isBetween(startTime, endTime);
    });
  }
}
