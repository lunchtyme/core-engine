"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailQueue = void 0;
const bullmq_1 = require("bullmq");
const connect_1 = require("./connect");
exports.emailQueue = new bullmq_1.Queue('emailQueue', {
    connection: connect_1.queueConnection,
});
