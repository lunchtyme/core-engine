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
exports.FoodMenuReadService = void 0;
const infrastructure_1 = require("../infrastructure");
const utils_1 = require("../utils");
const getRecommendedMeals_query_1 = require("./queries/getRecommendedMeals.query");
class FoodMenuReadService {
    constructor(_foodMenuRepo, _redisService, _logger) {
        this._foodMenuRepo = _foodMenuRepo;
        this._redisService = _redisService;
        this._logger = _logger;
    }
    getAllMenu(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_1.Helper.checkUserType(params.user.account_type, [infrastructure_1.UserAccountType.INDIVIDUAL, infrastructure_1.UserAccountType.ADMIN], 'fetch food menus');
                const { query, category, risk_health } = params, filters = __rest(params, ["query", "category", "risk_health"]);
                // Ensure risk_health is treated as a boolean
                const isRiskHealth = typeof risk_health === 'boolean' ? risk_health : false;
                // Get the aggregation pipeline with the adjusted risk_health parameter
                const fetchPipeline = yield (0, getRecommendedMeals_query_1.getRecommendedMealsQuery)({
                    query,
                    category,
                    userId: params.user.sub,
                    risk_health: isRiskHealth,
                });
                const result = yield this._foodMenuRepo.paginateAndAggregateCursor(fetchPipeline, filters);
                this._logger.info('Fetching food menu from database');
                return result;
            }
            catch (error) {
                this._logger.error('Error fetching food list menu:', error);
                throw error;
            }
        });
    }
    getOneMenu(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_1.Helper.checkUserType(params.user.account_type, [infrastructure_1.UserAccountType.INDIVIDUAL, infrastructure_1.UserAccountType.ADMIN], 'fetch food menu by id');
                const result = yield this._foodMenuRepo.getOne(params.menuId);
                if (!result) {
                    throw new utils_1.NotFoundError('Food menu not found');
                }
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.FoodMenuReadService = FoodMenuReadService;
