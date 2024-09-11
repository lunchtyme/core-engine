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
exports.FoodMenuCreateService = void 0;
const user_1 = require("../typings/user");
const utils_1 = require("../utils");
const validators_1 = require("./dtos/validators");
class FoodMenuCreateService {
    constructor(_foodMenuRepo, _logger) {
        this._foodMenuRepo = _foodMenuRepo;
        this._logger = _logger;
    }
    addFoodToMenu(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { value, error } = validators_1.AddFoodToMenuDTOValidator.validate(params);
                if (error) {
                    this._logger.error('Validation error', error);
                    throw new utils_1.BadRequestError(error.message);
                }
                const { user, price, description, name, categories } = value;
                utils_1.Helper.checkUserType(user.account_type, [user_1.UserAccountType.ADMIN], 'add food menus');
                const addFoodMenuParams = {
                    name,
                    description,
                    price: parseFloat(price).toFixed(2), // Ensure price has two decimal places
                    categories,
                    user: user.sub,
                };
                const result = yield this._foodMenuRepo.create(addFoodMenuParams);
                return result.id;
            }
            catch (error) {
                this._logger.error('Error adding food menu', error);
                throw error;
            }
        });
    }
}
exports.FoodMenuCreateService = FoodMenuCreateService;
