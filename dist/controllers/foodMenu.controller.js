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
exports.updateFoodMenuAvaliabilityController = exports.fetchMenuController = exports.addFoodToMenuController = void 0;
const utils_1 = require("../utils");
const services_1 = require("../services");
const infrastructure_1 = require("../infrastructure");
const addFoodToMenuController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parse the categories string into an array
        let categories;
        if (Array.isArray(req.body.categories)) {
            categories = req.body.categories;
        }
        else if (typeof req.body.categories === 'string') {
            categories = req.body.categories.split(',') || [];
        }
        else {
            throw new utils_1.BadRequestError('Invalid categories provided');
        }
        const result = yield services_1.foodMenuCreateService.addFoodToMenu(Object.assign(Object.assign({}, req.body), { categories, user: req.user, food_image: req.file }));
        utils_1.Helper.formatAPIResponse(res, 'New food added to menu', result);
    }
    catch (error) {
        next(error);
    }
});
exports.addFoodToMenuController = addFoodToMenuController;
const fetchMenuController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, lastScore, lastId, category, query } = req.query;
        // Convert category string to FoodCategory enum if provided
        const categoryEnum = category && Object.values(infrastructure_1.FoodCategory).includes(category)
            ? category
            : undefined;
        const fetchFoodMenuDTO = {
            limit: limit ? parseInt(limit, 10) : 10,
            lastScore: lastScore ? parseFloat(lastScore) : undefined,
            lastId: lastId || undefined,
            category: categoryEnum,
            query: query || undefined,
            user: req.user,
        };
        const result = yield services_1.foodMenuReadService.getAllMenu(fetchFoodMenuDTO);
        utils_1.Helper.formatAPIResponse(res, 'Fetched food menu successfully', result);
    }
    catch (error) {
        next(error);
    }
});
exports.fetchMenuController = fetchMenuController;
const updateFoodMenuAvaliabilityController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield services_1.foodMenuCreateService.updateFoodAvalibility({
            foodMenuId: req.body.foodMenuId,
            available: req.body.available,
            user: req.user,
        });
        utils_1.Helper.formatAPIResponse(res, 'Food menu availability updated', result);
    }
    catch (error) {
        next(error);
    }
});
exports.updateFoodMenuAvaliabilityController = updateFoodMenuAvaliabilityController;
