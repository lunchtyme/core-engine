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
exports.OrderReadService = void 0;
const utils_1 = require("../utils");
const getOrderHistory_query_1 = require("./queries/getOrderHistory.query");
const enums_1 = require("../infrastructure/database/models/enums");
class OrderReadService {
    constructor(_orderRepo, _logger) {
        this._orderRepo = _orderRepo;
        this._logger = _logger;
    }
    getOrderHistory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = params, filters = __rest(params, ["user"]);
                utils_1.Helper.checkUserType(user.account_type, [enums_1.UserAccountType.INDIVIDUAL, enums_1.UserAccountType.ADMIN], 'fetch order history');
                let getBillingQuery = user.account_type === enums_1.UserAccountType.INDIVIDUAL
                    ? (0, getOrderHistory_query_1.getOrderHistoryQuery)({
                        employeeId: user.sub,
                    })
                    : (0, getOrderHistory_query_1.getOrderHistoryQuery)({});
                const result = yield this._orderRepo.paginateAndAggregateCursor(getBillingQuery, filters);
                return result;
            }
            catch (error) {
                this._logger.error('Error billings data', error);
                throw error;
            }
        });
    }
}
exports.OrderReadService = OrderReadService;
