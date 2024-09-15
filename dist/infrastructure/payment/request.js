"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaystackRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../../utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV);
exports.PaystackRequest = axios_1.default.create({
    baseURL: process.env.PAYSTACK_URL,
    headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});
