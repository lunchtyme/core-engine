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
exports.MealSuggestionCreateService = void 0;
const utils_1 = require("../utils");
const validators_1 = require("./dtos/validators");
const infrastructure_1 = require("../infrastructure");
class MealSuggestionCreateService {
    constructor(_mealSuggestionRepo, _logger) {
        this._mealSuggestionRepo = _mealSuggestionRepo;
        this._logger = _logger;
    }
    addMealSuggestion(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_1.Helper.checkUserType(params.user.account_type, [infrastructure_1.UserAccountType.INDIVIDUAL, infrastructure_1.UserAccountType.COMPANY], 'suggest meals');
                const { value, error } = validators_1.AddMealSuggestionDTOValidator.validate(params);
                if (error) {
                    this._logger.error('Validation error', error);
                    throw new utils_1.BadRequestError(error.message);
                }
                const { user, name, description, reason_for_suggestion } = value;
                const mealSuggestionParams = {
                    user: user,
                    name,
                    description,
                    reason_for_suggestion,
                };
                const result = yield this._mealSuggestionRepo.create(mealSuggestionParams, session);
                return result.id;
            }
            catch (error) {
                this._logger.error('Error storing user health info', { error });
                throw error;
            }
        });
    }
}
exports.MealSuggestionCreateService = MealSuggestionCreateService;
