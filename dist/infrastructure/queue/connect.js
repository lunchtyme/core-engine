"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueConnection = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const utils_1 = require("../../utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV);
exports.queueConnection = new ioredis_1.default(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});
exports.queueConnection.on('connect', () => {
    console.log('Queue connection is active');
});
exports.queueConnection.on('error', (err) => {
    console.error('Queue failed to connect:', err);
    process.exit(0);
});
