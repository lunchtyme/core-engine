"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAtQueue = void 0;
const bullmq_1 = require("bullmq");
const connect_1 = require("./connect");
exports.processAtQueue = new bullmq_1.Queue('processedAtQueue', {
    connection: connect_1.queueConnection,
});
