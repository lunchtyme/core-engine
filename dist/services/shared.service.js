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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedServices = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const utils_1 = require("../utils");
class SharedServices {
    constructor(_userRepo, _individualRepo, _emailQueue, _processAtQueue, _logger) {
        this._userRepo = _userRepo;
        this._individualRepo = _individualRepo;
        this._emailQueue = _emailQueue;
        this._processAtQueue = _processAtQueue;
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
                const records = yield this._individualRepo.getLunchTimeRecords();
                const list = yield this.filterLunchRecords(records);
                if (!list.length) {
                    return;
                }
                for (const record of list) {
                    const user = record.user;
                    const emailPayload = {
                        receiver: user.email,
                        subject: utils_1.EMAIL_DATA.subject.dailyNotification,
                        template: utils_1.EMAIL_DATA.template.dailyNotification,
                        from: 'Lunchtyme Notifications <notifications@lunchtyme.store>',
                        context: {
                            name: `${record.first_name} ${record.last_name}`,
                            email: user.email,
                        },
                    };
                    // Send reminder email 2hr before their lunchtyme
                    yield this._emailQueue.add('mailer', emailPayload, {
                        attempts: 5,
                        removeOnComplete: true,
                        delay: 1000,
                    });
                    // Set update the time the record was processed for daily notifications
                    yield this._processAtQueue.add('processor', { record }, {
                        attempts: 5,
                        removeOnComplete: true,
                        delay: 2000,
                    });
                }
                this._logger.info('Daily menu notification reminder sent to user');
            }
            catch (error) {
                this._logger.error('Error fetching and sending email to employees whose their lunch time is 2 hours from now', { error });
                throw error;
            }
        });
    }
    // Function to filter records
    filterLunchRecords(records) {
        return __awaiter(this, void 0, void 0, function* () {
            return records.filter((record) => {
                const userTimeZone = record.user.time_zone;
                // Parse lunch_time in the user's time zone
                const [hour, minutePart] = record.lunch_time.split(':');
                const [minute, period] = minutePart.split(' '); // Handle AM/PM
                const hour24 = period === 'PM' ? (parseInt(hour) % 12) + 12 : parseInt(hour) % 12;
                const lunchMoment = moment_timezone_1.default.tz({ hour: hour24, minute: parseInt(minute) }, userTimeZone);
                // Get current time and target window in the user's time zone
                const now = (0, moment_timezone_1.default)().tz(userTimeZone);
                const targetTime = now.clone().add(2, 'hours');
                const bufferMinutes = 5;
                const startTime = targetTime.clone().subtract(bufferMinutes, 'minutes');
                const endTime = targetTime.clone().add(bufferMinutes, 'minutes');
                // Skip records that were already processed within this window
                if (record.processed_at) {
                    const processedAt = (0, moment_timezone_1.default)(record.processed_at).tz(userTimeZone);
                    const startOfToday = (0, moment_timezone_1.default)().tz(userTimeZone).startOf('day');
                    const endOfToday = (0, moment_timezone_1.default)().tz(userTimeZone).endOf('day');
                    // Check if it was already processed today and is within the time window
                    if (processedAt.isBetween(startOfToday, endOfToday)) {
                        return false; // Already processed today, skip
                    }
                }
                // Check if lunch time is within the target window
                return lunchMoment.isBetween(startTime, endTime);
            });
        });
    }
}
exports.SharedServices = SharedServices;
