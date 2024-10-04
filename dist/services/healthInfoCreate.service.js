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
exports.HealthInfoCreateService = void 0;
const utils_1 = require("../utils");
const validators_1 = require("./dtos/validators");
const infrastructure_1 = require("../infrastructure");
class HealthInfoCreateService {
    constructor(_healthInfoRepo, _logger) {
        this._healthInfoRepo = _healthInfoRepo;
        this._logger = _logger;
    }
    addUserHealthInfo(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_1.Helper.checkUserType(params.user.account_type, [infrastructure_1.UserAccountType.INDIVIDUAL], 'can provide their health information');
                const { value, error } = validators_1.AddUserHealthInfoDTOValidator.validate(params);
                if (error) {
                    this._logger.error('Validation error', error);
                    throw new utils_1.BadRequestError(error.message);
                }
                const { user, allergies, medical_conditions, dietary_preferences } = value;
                const healthInfoParams = {
                    user: user.sub,
                    allergies,
                    medical_conditions,
                    dietary_preferences,
                };
                const result = yield this._healthInfoRepo.create(healthInfoParams, session);
                return result.id;
            }
            catch (error) {
                this._logger.error('Error storing user health info', { error });
                throw error;
            }
        });
    }
}
exports.HealthInfoCreateService = HealthInfoCreateService;
