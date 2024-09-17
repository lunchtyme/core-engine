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
exports.getBillingHistoryController = exports.processPaystackWebhookController = exports.topUpWalletBalanceController = void 0;
const utils_1 = require("../utils");
const services_1 = require("../services");
const logger_1 = __importDefault(require("../utils/logger"));
const topUpWalletBalanceController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createBillingDTO = {
            amount: req.body.amount,
            user: req.user,
        };
        const result = yield services_1.billingCreateService.topupWalletBalance(createBillingDTO);
        utils_1.Helper.formatAPIResponse(res, 'Billing process in progress', result, 201);
    }
    catch (error) {
        next(error);
    }
});
exports.topUpWalletBalanceController = topUpWalletBalanceController;
const processPaystackWebhookController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield services_1.billingCreateService.processWebhook({
            body: req.body,
            signature: req.headers['x-paystack-signature'],
        });
        return res.sendStatus(200);
    }
    catch (error) {
        logger_1.default.error('Error processing webhook event', { error });
        return res.sendStatus(500);
    }
});
exports.processPaystackWebhookController = processPaystackWebhookController;
const getBillingHistoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, lastId } = req.query;
        const getBillingHistoryDTO = {
            user: req.user,
            limit: limit ? parseInt(limit, 10) : 10,
            lastId: lastId || undefined,
        };
        const result = yield services_1.billingReadService.getBillingHistory(getBillingHistoryDTO);
        utils_1.Helper.formatAPIResponse(res, 'Billing data fetched', result);
    }
    catch (error) {
        next(error);
    }
});
exports.getBillingHistoryController = getBillingHistoryController;
