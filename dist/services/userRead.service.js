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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserReadService = void 0;
const utils_1 = require("../utils");
const getAllUsers_query_1 = require("./queries/getAllUsers.query");
const getEmployeeByCompany_query_1 = require("./queries/getEmployeeByCompany.query");
const enums_1 = require("../infrastructure/database/models/enums");
class UserReadService {
    constructor(_userRepo, _companyRepo, _orderRepo, _billingRepo, _individualRepo, _redisService, _logger) {
        this._userRepo = _userRepo;
        this._companyRepo = _companyRepo;
        this._orderRepo = _orderRepo;
        this._billingRepo = _billingRepo;
        this._individualRepo = _individualRepo;
        this._redisService = _redisService;
        this._logger = _logger;
    }
    // Admin
    allUsers(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_1.Helper.checkUserType(params.user.account_type, [enums_1.UserAccountType.ADMIN], 'fetch all user datas');
                // const cacheKey = `get:All:users`;
                // const cachedResult = await this._redisService.get(cacheKey);
                // if (cachedResult) {
                //   this._logger.info('Users fetched from cache');
                //   return JSON.parse(cachedResult);
                // }
                const { query } = params, filters = __rest(params, ["query"]);
                const getAllUsersPipeline = (0, getAllUsers_query_1.getAllUserQuery)({ query });
                const result = yield this._userRepo.paginateAndAggregateCursor(getAllUsersPipeline, filters);
                // await this._redisService.set(
                //   cacheKey,
                //   JSON.stringify(result),
                //   true,
                //   DEFAULT_CACHE_EXPIRY_IN_SECS,
                // );
                return result;
            }
            catch (error) {
                this._logger.error('Error fetching users lists', error);
                throw error;
            }
        });
    }
    // Company
    allEmployeesForCompany(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_1.Helper.checkUserType(params.user.account_type, [enums_1.UserAccountType.COMPANY], 'fetch all their employee data');
                // const cacheKey = `get:All:employees`;
                // const cachedResult = await this._redisService.get(cacheKey);
                // if (cachedResult) {
                //   this._logger.info('Employees fetched from cache');
                //   return JSON.parse(cachedResult);
                // }
                const { query, user } = params, filters = __rest(params, ["query", "user"]);
                const company = yield this._companyRepo.getCompanyByUserId(user.sub);
                if (!company) {
                    throw new utils_1.NotFoundError('Failed to fetch employees, company not found');
                }
                const getAllUsersPipeline = (0, getEmployeeByCompany_query_1.getEmployeeAccountsByCompany)({
                    query,
                    companyId: company._id,
                });
                const result = yield this._userRepo.paginateAndAggregateCursor(getAllUsersPipeline, filters);
                // await this._redisService.set(
                //   cacheKey,
                //   JSON.stringify(result),
                //   true,
                //   DEFAULT_CACHE_EXPIRY_IN_SECS,
                // );
                return result;
            }
            catch (error) {
                this._logger.error('Error fetching employee lists', error);
                throw error;
            }
        });
    }
    // Employee overview analytics
    getEmployeeOverviewAnalytics(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_1.Helper.checkUserType(user.account_type, [enums_1.UserAccountType.INDIVIDUAL], 'access this resource');
                const [orders, balance] = yield Promise.all([
                    this._orderRepo.countEmployeeOrders(user.sub),
                    this._individualRepo.getSpendBalance(user.sub),
                ]);
                return {
                    orders,
                    balance,
                };
            }
            catch (error) {
                this._logger.error('Error fetching employee overview analytics', { error, user });
                throw error;
            }
        });
    }
    // Company overview analytics
    getCompanyOverviewAnalytics(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_1.Helper.checkUserType(user.account_type, [enums_1.UserAccountType.COMPANY], 'access this resource');
                const companyInfo = yield this._companyRepo.getCompanyByUserId(user.sub);
                const [orders, balance, amountSpent, employees] = yield Promise.all([
                    this._orderRepo.countCompanyEmployeeOrders(companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo._id),
                    this._companyRepo.getSpendBalance(user.sub),
                    this._billingRepo.getTotalAmountSpentByMe(user.sub),
                    this._individualRepo.countCompanyEmployees(companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo._id),
                ]);
                return {
                    orders,
                    balance,
                    employees,
                    amount_spent: amountSpent,
                };
            }
            catch (error) {
                this._logger.error('Error fetching employee overview analytics', { error, user });
                throw error;
            }
        });
    }
}
exports.UserReadService = UserReadService;
