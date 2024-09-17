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
exports.mailTaskHandler = void 0;
const bullmq_1 = require("bullmq");
const connect_1 = require("../connect");
const utils_1 = require("../../../utils");
const logger_1 = __importDefault(require("../../../utils/logger"));
exports.mailTaskHandler = new bullmq_1.Worker('emailQueue', (job) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('Processing email job:', job.id);
    try {
        yield (0, utils_1.sendEmail)(job.data);
    }
    catch (error) {
        logger_1.default.error('Error processing email job', error);
        throw error;
    }
}), {
    connection: connect_1.queueConnection,
});
exports.mailTaskHandler.on('completed', (job) => {
    logger_1.default.info(`Email worker done processing job ${job.id}`);
    console.log(`Email worker done processing job ${job.id}`);
});
exports.mailTaskHandler.on('error', (err) => {
    logger_1.default.error('Email worker error:', err);
    console.error('Email worker error:', err.message);
});
