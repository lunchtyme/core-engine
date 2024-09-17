"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedServices = void 0;
const utils_1 = require("../utils");
class SharedServices {
    constructor(_userRepo, _individualRepo, _emailQueue, _logger) {
        this._userRepo = _userRepo;
        this._individualRepo = _individualRepo;
        this._emailQueue = _emailQueue;
        this._logger = _logger;
    }
    getUserWithDetails(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepo.getUserWithDetails(params);
            if (!user) {
                throw new utils_1.NotFoundError('User not found');
            }
            return user;
        });
    }
    getUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepo.getUser(params);
            if (!user) {
                throw new utils_1.NotFoundError('User not found');
            }
            return user;
        });
    }
    checkUserExist(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRepo.checkUserExist(params);
        });
    }
    sendPeriodicEmailNotificationsForLunchReminder() {
        return __awaiter(this, void 0, void 0, function* () {
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
                const records = yield this._individualRepo.getLunchTimeRecords();
                console.log(records);
                if (records.length) {
                    for (const record of records) {
                        console.log(record);
                    }
                }
            }
            catch (error) {
                this._logger.error('Error fetching and sending email to employees whose their lunch time is 2 hours from now', { error });
                throw error;
            }
        });
    }
}
exports.SharedServices = SharedServices;
