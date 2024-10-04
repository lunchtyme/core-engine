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
const utils_1 = require("../utils");
const validators_1 = require("./dtos/validators");
const infrastructure_1 = require("../infrastructure");
class FoodMenuCreateService {
    constructor(_foodMenuRepo, _logger) {
        this._foodMenuRepo = _foodMenuRepo;
        this._logger = _logger;
    }
    addFoodToMenu(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_1.Helper.checkUserType(params.user.account_type, [infrastructure_1.UserAccountType.ADMIN], 'add food menus');
                const { value, error } = validators_1.AddFoodToMenuDTOValidator.validate(params);
                if (error) {
                    this._logger.error('Validation error', error);
                    throw new utils_1.BadRequestError(error.message);
                }
                const { user, price, description, name, categories, allergens, suitable_for_conditions, suitable_for_diet, health_benefits, } = value;
                // Only accept certain text file e.g (jpeg, webp, png e.t.c)
                const allowedMimeTypes = ['image/jpeg', 'image/webp', 'image/png'];
                const file = params.food_image;
                if (!file) {
                    throw new utils_1.BadRequestError('Please select a file to upload');
                }
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    // Handle case where file has incorrect mime type
                    throw new utils_1.BadRequestError('Only JPEG, PNG, and WebP images are allowed');
                }
                // Upload image and store the url
                const filePath = file.path;
                const photo = yield utils_1.Helper.uploadImageToCloudinary(filePath);
                const addFoodMenuParams = {
                    name,
                    description,
                    price: parseFloat(price).toFixed(2), // Ensure price has two decimal places
                    categories,
                    user: user.sub,
                    food_image: photo,
                    health_benefits,
                    allergens,
                    suitable_for_conditions,
                    suitable_for_diet,
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
    updateFoodAvalibility(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                utils_1.Helper.checkUserType(params.user.account_type, [infrastructure_1.UserAccountType.ADMIN], 'update food menu availability');
                return yield this._foodMenuRepo.updateFoodAvailability(params.foodMenuId, params.available);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.FoodMenuCreateService = FoodMenuCreateService;
