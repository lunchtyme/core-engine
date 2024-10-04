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
exports.getMealSuggestionsController = exports.addMealSuggestionController = void 0;
const utils_1 = require("../utils");
const services_1 = require("../services");
const addMealSuggestionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield services_1.mealSuggestionCreateService.addMealSuggestion({
            user: req.user,
            description: req.body.description,
            name: req.body.name,
            reason_for_suggestion: req.body.reason_for_suggestion,
        });
        utils_1.Helper.formatAPIResponse(res, 'Meal suggestion submitted successfully', result);
    }
    catch (error) {
        next(error);
    }
});
exports.addMealSuggestionController = addMealSuggestionController;
const getMealSuggestionsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, lastId } = req.query;
        const getMealSuggestionsDTO = {
            user: req.user,
            limit: limit ? parseInt(limit, 10) : 10,
            lastId: lastId || undefined,
        };
        const result = yield services_1.mealSuggestionReadService.getAll(getMealSuggestionsDTO);
        utils_1.Helper.formatAPIResponse(res, 'Meal suggestions fetched', result);
    }
    catch (error) {
        next(error);
    }
});
exports.getMealSuggestionsController = getMealSuggestionsController;
