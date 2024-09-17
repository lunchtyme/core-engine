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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodMenuReadService = void 0;
const infrastructure_1 = require("../infrastructure");
const utils_1 = require("../utils");
const logger_1 = __importDefault(require("../utils/logger"));
const getAllMenu_query_1 = require("./queries/getAllMenu.query");
class FoodMenuReadService {
    constructor(_foodMenuRepo, _redisService, _logger) {
        this._foodMenuRepo = _foodMenuRepo;
        this._redisService = _redisService;
        this._logger = _logger;
    }
    getAllMenu(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_1.Helper.checkUserType(params.user.account_type, [infrastructure_1.UserAccountType.COMPANY, infrastructure_1.UserAccountType.INDIVIDUAL], 'fetch food menus');
                // const cacheKey = Helper.generateCacheKey(params);
                // const cachedResult = await this._redisService.get(cacheKey);
                // if (cachedResult) {
                //   this._logger.info('Returned cached food menu');
                //   return JSON.parse(cachedResult);
                // }
                const { query, category } = params, filters = __rest(params, ["query", "category"]);
                const fetchPipeline = (0, getAllMenu_query_1.getFoodMenuQuery)({ query, category });
                const result = yield this._foodMenuRepo.paginateAndAggregateCursor(fetchPipeline, filters);
                // await this._redisService.set(
                //   cacheKey,
                //   JSON.stringify(result),
                //   true,
                //   DEFAULT_CACHE_EXPIRY_IN_SECS,
                // );
                this._logger.info('Fetching food menu from database');
                return result;
            }
            catch (error) {
                logger_1.default.error('Error fetching food list menu:', error);
                throw error;
            }
        });
    }
}
exports.FoodMenuReadService = FoodMenuReadService;
