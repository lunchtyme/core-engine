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
exports.AuthReadservice = void 0;
const utils_1 = require("../utils");
class AuthReadservice {
    constructor(_userRepo, _companyRepo, _adminRepo, _individualRepo, _sharedService, _redisService, _logger) {
        this._userRepo = _userRepo;
        this._companyRepo = _companyRepo;
        this._adminRepo = _adminRepo;
        this._individualRepo = _individualRepo;
        this._sharedService = _sharedService;
        this._redisService = _redisService;
        this._logger = _logger;
    }
    me(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //check cache for data
                const meCacheKey = `me:${user_id}`;
                const cacheLookupResult = yield this._redisService.get(meCacheKey);
                if (cacheLookupResult) {
                    return JSON.parse(cacheLookupResult);
                }
                const user = yield this._userRepo.getUser({ identifier: 'id', value: user_id });
                const hydratedUser = {
                    id: user === null || user === void 0 ? void 0 : user._id,
                    account_type: user === null || user === void 0 ? void 0 : user.account_type,
                    account_state: user === null || user === void 0 ? void 0 : user.account_state,
                    email: user === null || user === void 0 ? void 0 : user.email,
                    email_verified: user === null || user === void 0 ? void 0 : user.email_verified,
                    verified: user === null || user === void 0 ? void 0 : user.verified,
                    dial_code: user === null || user === void 0 ? void 0 : user.dial_code,
                    phone_number: user === null || user === void 0 ? void 0 : user.phone_number,
                    time_zone: user === null || user === void 0 ? void 0 : user.time_zone,
                    created_at: user === null || user === void 0 ? void 0 : user.created_at,
                    onboarded: user === null || user === void 0 ? void 0 : user.has_completed_onboarding,
                };
                // cache for 3 minutes
                yield this._redisService.set(meCacheKey, JSON.stringify(hydratedUser), true, utils_1.DEFAULT_CACHE_EXPIRY_IN_SECS);
                return hydratedUser;
            }
            catch (error) {
                this._logger.error('Error fetching user profile data', error);
                throw error;
            }
        });
    }
}
exports.AuthReadservice = AuthReadservice;
