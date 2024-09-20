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
exports.BillingReadService = void 0;
const getBillings_query_1 = require("./queries/getBillings.query");
const enums_1 = require("../infrastructure/database/models/enums");
const utils_1 = require("../utils");
class BillingReadService {
    constructor(_userRepo, _companyRepo, _adminRepo, _individualRepo, _billingRepo, _sharedService, _redisService, _logger) {
        this._userRepo = _userRepo;
        this._companyRepo = _companyRepo;
        this._adminRepo = _adminRepo;
        this._individualRepo = _individualRepo;
        this._billingRepo = _billingRepo;
        this._sharedService = _sharedService;
        this._redisService = _redisService;
        this._logger = _logger;
    }
    // Company&Admin
    getBillingHistory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = params, filters = __rest(params, ["user"]);
                utils_1.Helper.checkUserType(user.account_type, [enums_1.UserAccountType.COMPANY, enums_1.UserAccountType.ADMIN], 'fetch billings data');
                let getBillingQuery = user.account_type === enums_1.UserAccountType.COMPANY
                    ? (0, getBillings_query_1.getBillingHistoryQuery)({
                        companyUserId: user.sub,
                    })
                    : (0, getBillings_query_1.getBillingHistoryQuery)({});
                const result = yield this._billingRepo.paginateAndAggregateCursor(getBillingQuery, filters);
                return result;
            }
            catch (error) {
                this._logger.error('Error billings data', error);
                throw error;
            }
        });
    }
    getCompanySpendBalance(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._companyRepo.getSpendBalance(user.sub);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getIndividualSpendBalance(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._individualRepo.getSpendBalance(user.sub);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.BillingReadService = BillingReadService;
