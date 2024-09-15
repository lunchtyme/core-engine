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
exports.AdminReadService = void 0;
const utils_1 = require("../utils");
const user_1 = require("../typings/user");
class AdminReadService {
    constructor(_userRepo, _orderRepo, _logger) {
        this._userRepo = _userRepo;
        this._orderRepo = _orderRepo;
        this._logger = _logger;
    }
    getOverviewAnalytics(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_1.Helper.checkUserType(user.account_type, [user_1.UserAccountType.ADMIN], 'access this resource');
                const [users, orders, employees, companies] = yield Promise.all([
                    this._userRepo.getAllUserCount(),
                    this._orderRepo.getAllOrderCount(),
                    this._userRepo.getAllEmployeeCount(),
                    this._userRepo.getAllCompanyCount(),
                ]);
                return {
                    users,
                    orders,
                    employees,
                    companies,
                };
            }
            catch (error) {
                console.log(error);
                this._logger.error('Error fetching admin overview analytics', { error, user });
                throw error;
            }
        });
    }
}
exports.AdminReadService = AdminReadService;
