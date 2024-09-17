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
      // const lunchTime = '16:00 PM';
      // const timeZone = 'Africa/Lagos';

      // // Parse the lunch_time in a specific time zone
      // const lunchMoment = moment.tz(lunchTime, 'hh:mm A', timeZone);

      // // Get the current time in the same time zone
      // const currentMoment = moment().tz(timeZone);

      // // Check if it's 2 hours before lunch time
      // const timeDiff = lunchMoment.diff(currentMoment, 'hours');

      // console.log(`Lunch is in ${timeDiff} hours`);

      // if (currentMoment.isSame(lunchMoment.subtract(2, 'hours'))) {
      //   console.log('It is 2 hours before lunch time');
      // }
      // console.log('Hello World Agendas');

      const records = await this._individualRepo.getLunchTimeRecords();

      console.log(records);
      if (records.length) {
        for (const record of records) {
          console.log(record);
        }
      }
    } catch (error) {
      this._logger.error(
        'Error fetching and sending email to employees whose their lunch time is 2 hours from now',
        { error },
      );
      throw error;
    }
  }
}
