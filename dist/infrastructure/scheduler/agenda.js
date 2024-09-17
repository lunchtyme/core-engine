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
exports.agenda = void 0;
const agenda_1 = require("@hokify/agenda");
const utils_1 = require("../../utils");
const services_1 = require("../../services");
const logger_1 = __importDefault(require("../../utils/logger"));
// Load environment variables
(0, utils_1.loadEnv)(process.env.NODE_ENV);
const mongoURI = process.env.AGENDA_MONGO_URI;
if (!mongoURI) {
    throw new Error('AGENDA_MONGO_URI is not defined.');
}
exports.agenda = new agenda_1.Agenda({
    db: { address: mongoURI, collection: 'agendaJobs' },
    processEvery: '30 seconds', // Ensures jobs are processed frequently
});
exports.agenda.define('sendPeriodicLunchReminderNotification', (job) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield services_1.sharedServices.sendPeriodicEmailNotificationsForLunchReminder();
    }
    catch (error) {
        logger_1.default.error(`Error running schedule: 'sendPeriodicLunchReminderNotification'`, {
            error,
            job,
        });
        throw error;
    }
}), { priority: 'high' });
exports.agenda.every('1 minutes', 'sendPeriodicLunchReminderNotification');
// Schedule event tracking
// Event: Job started
exports.agenda.on('start', (job) => {
    logger_1.default.info(`Job ${job.attrs.name} starting`, { jobId: job.attrs._id });
});
// Event: Job completed
exports.agenda.on('complete', (job) => {
    logger_1.default.info(`Job ${job.attrs.name} completed`, { jobId: job.attrs._id });
});
// Event: Job succeeded
exports.agenda.on('success:sendPeriodicLunchReminderNotification', (job) => {
    logger_1.default.info(`Job ${job.attrs.name} succeeded`, { jobId: job.attrs._id });
});
// Event: Job failed
exports.agenda.on('fail:sendPeriodicLunchReminderNotification', (err, job) => {
    logger_1.default.error(`Job ${job.attrs.name} failed with error: ${err.message}`, {
        jobId: job.attrs._id,
        error: err,
    });
});
