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
exports.mailTaskHandler = void 0;
const bullmq_1 = require("bullmq");
const connect_1 = require("../connect");
const utils_1 = require("../../../utils");
exports.mailTaskHandler = new bullmq_1.Worker('emailQueue', (job) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Processing email job:', job.id);
    try {
        yield (0, utils_1.sendEmail)(job.data);
    }
    catch (error) {
        console.error('Error processing email job:', error);
        throw error;
    }
}), {
    connection: connect_1.queueConnection,
});
exports.mailTaskHandler.on('completed', (job) => {
    console.log(`Email worker done processing job ${job.id}`);
});
exports.mailTaskHandler.on('error', (err) => {
    console.error('Email worker error:', err.message);
});
