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
exports.scheduleTaskHandler = void 0;
const bullmq_1 = require("bullmq");
const connect_1 = require("../connect");
const logger_1 = __importDefault(require("../../../utils/logger"));
const services_1 = require("../../../services");
exports.scheduleTaskHandler = new bullmq_1.Worker('processedAtQueue', (job) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('Updating processed at:', job.id);
    try {
        yield services_1.individualRepository.updateProcessedAt(job.data);
    }
    catch (error) {
        logger_1.default.error('Error updating processed at', error);
        throw error;
    }
}), {
    connection: connect_1.queueConnection,
});
exports.scheduleTaskHandler.on('completed', (job) => {
    logger_1.default.info(`processed_at worker done processing job ${job.id}`);
    console.log(`processed_at worker done processing job ${job.id}`);
});
exports.scheduleTaskHandler.on('error', (err) => {
    logger_1.default.error('processed_at worker error:', err);
    console.error('processed_at worker error:', err.message);
});
