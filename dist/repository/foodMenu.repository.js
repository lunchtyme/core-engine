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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodMenuRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const infrastructure_1 = require("../infrastructure");
const utils_1 = require("../utils");
class FoodMenuRepository {
    create(params, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, price, categories, user, description } = params;
                const result = new infrastructure_1.FoodMenuModel({
                    name,
                    price: new mongoose_1.default.Types.Decimal128(price),
                    categories,
                    description,
                    added_by: user,
                });
                return yield result.save({ session });
            }
            catch (error) {
                utils_1.logger.error('Error saving food menu:', error);
                throw error;
            }
        });
    }
}
exports.FoodMenuRepository = FoodMenuRepository;
