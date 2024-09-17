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
exports.InvitationReadService = void 0;
const utils_1 = require("../utils");
const infrastructure_1 = require("../infrastructure");
class InvitationReadService {
    constructor(_invitationRepo, _sharedService, _redisService, _logger) {
        this._invitationRepo = _invitationRepo;
        this._sharedService = _sharedService;
        this._redisService = _redisService;
        this._logger = _logger;
    }
    //Todo: Fetch invitations for companys, allow them to filter and paginate efficiently
    fetchMyInvitations(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = params;
                const userDetails = yield this._sharedService.getUserWithDetails({
                    identifier: 'id',
                    value: user,
                });
                // RBAC check
                utils_1.Helper.checkUserType(userDetails.account_type, [infrastructure_1.UserAccountType.COMPANY], 'view their sent invitations');
                // const cacheKey = `my:${user}:invitations`;
                // const cacheResults = await this._redisService.get(cacheKey);
                // if (cacheResults) {
                //   return JSON.parse(cacheResults);
                // }
                const results = yield this._invitationRepo.fetchMyInvitations(user);
                // await this._redisService.set(cacheKey, JSON.stringify(results), true, 600);
                return results;
            }
            catch (error) {
                this._logger.error('Failed to fetch invitations', error);
                throw error;
            }
        });
    }
    fetchAllInvitations(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = params;
                const userDetails = yield this._sharedService.getUserWithDetails({
                    identifier: 'id',
                    value: user,
                });
                // RBAC check
                utils_1.Helper.checkUserType(userDetails.account_type, [infrastructure_1.UserAccountType.ADMIN], 'view all sent invitations');
                const cacheKey = `all:invitations`;
                const cacheResults = yield this._redisService.get(cacheKey);
                if (cacheResults) {
                    return JSON.parse(cacheResults);
                }
                const results = yield this._invitationRepo.fetchInvitations();
                yield this._redisService.set(cacheKey, JSON.stringify(results), true, 600);
                return results;
            }
            catch (error) {
                this._logger.error('Failed to fetch invitations', error);
                throw error;
            }
        });
    }
}
exports.InvitationReadService = InvitationReadService;
