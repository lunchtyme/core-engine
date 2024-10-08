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
exports.companyAnalyticsController = exports.employeeAnalyticsController = exports.adminAnalyticsController = void 0;
const utils_1 = require("../utils");
const services_1 = require("../services");
const adminAnalyticsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield services_1.adminReadService.getOverviewAnalytics(req.user);
        utils_1.Helper.formatAPIResponse(res, 'Analytics data fetched', result);
    }
    catch (error) {
        next(error);
    }
});
exports.adminAnalyticsController = adminAnalyticsController;
const employeeAnalyticsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield services_1.userReadService.getEmployeeOverviewAnalytics(req.user);
        utils_1.Helper.formatAPIResponse(res, 'Analytics data fetched', result);
    }
    catch (error) {
        next(error);
    }
});
exports.employeeAnalyticsController = employeeAnalyticsController;
const companyAnalyticsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield services_1.userReadService.getCompanyOverviewAnalytics(req.user);
        utils_1.Helper.formatAPIResponse(res, 'Analytics data fetched', result);
    }
    catch (error) {
        next(error);
    }
});
exports.companyAnalyticsController = companyAnalyticsController;
