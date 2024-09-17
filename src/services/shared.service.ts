import moment from 'moment-timezone';
import { emailQueue } from '../infrastructure';
import { GetUserParams, IndividualRepository, UserRepository } from '../repository';
import { CLIENT_BASE_URL, EMAIL_DATA, NotFoundError, SendEmailParams } from '../utils';
import logger from '../utils/logger';

export class SharedServices {
  constructor(
    private readonly _userRepo: UserRepository,
    private readonly _individualRepo: IndividualRepository,
    private readonly _emailQueue: typeof emailQueue,
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
      // const emailPayload: SendEmailParams = {
      //   receiver: '',
      //   subject: EMAIL_DATA.subject.dailyNotification,
      //   template: EMAIL_DATA.template.dailyNotification,
      //   context: {
      //     menuURL: `${CLIENT_BASE_URL}/menu`,
      //     email: '',
      //   },
      // };

      // // Use Promise.all for mapping
      // this._emailQueue.add('mailer', emailPayload, {
      //   attempts: 5,
      //   removeOnComplete: true,
      //   delay: 2000,
      // });

      const records = await this._individualRepo.getLunchTimeRecords();
      const list = await this.filterLunchRecords(records);
      console.log(list);
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
      const targetTime = now.clone().add(10, 'minutes');
      const bufferMinutes = 5;
      const startTime = targetTime.clone().subtract(bufferMinutes, 'minutes');
      const endTime = targetTime.clone().add(bufferMinutes, 'minutes');

      // Check if lunch time is within the target window
      return lunchMoment.isBetween(startTime, endTime);
    });
  }
}
