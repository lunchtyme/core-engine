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
exports.getRecommendedMealsQuery = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const getRecommendedMealsQuery = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, category, userId, risk_health } = filter;
    const aggregationPipeline = [];
    if (!risk_health) {
        // If user ID is provided, we fetch their health info first
        if (userId) {
            const userHealthInfo = yield mongoose_1.default.model('HealthInfo').findOne({ user: userId });
            if (userHealthInfo) {
                // Extract health preferences (allergies, medical conditions, and dietary preferences)
                const { allergies = [], medical_conditions = [], dietary_preferences = [], } = userHealthInfo;
                const conditions = [];
                // Match menus suitable for user's medical conditions
                if (medical_conditions.length > 0) {
                    conditions.push({
                        suitable_for_conditions: { $in: medical_conditions }, // Match menus suitable for user's conditions
                    });
                }
                // Match menus suitable for user's dietary preferences
                if (dietary_preferences.length > 0) {
                    conditions.push({
                        suitable_for_diet: { $in: dietary_preferences }, // Match menus suitable for user's dietary preferences
                    });
                }
                // Exclude menus containing allergens
                if (allergies.length > 0) {
                    conditions.push({
                        allergens: { $nin: allergies }, // Exclude menus containing user allergens
                    });
                }
                // Apply the combined conditions in $and
                if (conditions.length > 0) {
                    aggregationPipeline.push({
                        $match: {
                            $and: conditions,
                        },
                    });
                }
            }
        }
    }
    // Apply text search query if available
    if (query) {
        aggregationPipeline.push({
            $match: { $text: { $search: query } },
        });
        aggregationPipeline.push({
            $addFields: { score: { $meta: 'textScore' } },
        });
        aggregationPipeline.push({
            $sort: { score: { $meta: 'textScore' } },
        });
    }
    // Apply category filter if available
    if (category) {
        aggregationPipeline.push({
            $match: { categories: { $in: [category] } },
        });
    }
    // Convert price to string
    aggregationPipeline.push({
        $addFields: {
            price: { $toString: '$price' },
        },
    });
    return aggregationPipeline;
});
exports.getRecommendedMealsQuery = getRecommendedMealsQuery;
