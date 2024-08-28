"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisCache = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const utils_1 = require("../../utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV);
exports.redisCache = new ioredis_1.default(process.env.REDIS_URL, {});
