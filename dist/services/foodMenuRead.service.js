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
const utils_1 = require("../utils");
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
                const cacheKey = utils_1.Helper.generateCacheKey(params);
                const cachedResult = yield this._redisService.get(cacheKey);
                if (cachedResult) {
                    this._logger.info('Returned cached food menu');
                    return JSON.parse(cachedResult);
                }
                const { query, category } = params, filters = __rest(params, ["query", "category"]);
                const excludeFields = ['__v', 'updated_at'];
                const options = Object.assign(Object.assign({}, filters), { excludeFields });
                const fetchPipeline = (0, getAllMenu_query_1.getFoodMenuQuery)({ query, category });
                this._logger.info('Fetching food menu from database');
                const result = yield this._foodMenuRepo.paginateAndAggregateCursor(fetchPipeline, options);
                yield this._redisService.set(cacheKey, JSON.stringify(result), true, utils_1.DEFAULT_CACHE_EXPIRY_IN_SECS);
                return result;
            }
            catch (error) {
                utils_1.logger.error('Error fetching food list menu:', error);
                throw error;
            }
        });
    }
}
exports.FoodMenuReadService = FoodMenuReadService;
