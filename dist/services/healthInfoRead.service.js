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
exports.HealthInfoReadService = void 0;
const utils_1 = require("../utils");
const infrastructure_1 = require("../infrastructure");
class HealthInfoReadService {
    constructor(_healthInfoRepo, _logger) {
        this._healthInfoRepo = _healthInfoRepo;
        this._logger = _logger;
    }
    getUserHealthInfo(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_1.Helper.checkUserType(params.user.account_type, [infrastructure_1.UserAccountType.INDIVIDUAL, infrastructure_1.UserAccountType.ADMIN], 'can view health information');
                return yield this._healthInfoRepo.getOne({
                    user_id: params.user.sub,
                });
            }
            catch (error) {
                this._logger.error('Error getting user health info', { error });
                throw error;
            }
        });
    }
}
exports.HealthInfoReadService = HealthInfoReadService;
