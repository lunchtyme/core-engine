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
exports.updateFoodMenuAvaliabilityController = exports.fetchOneMenuController = exports.fetchMenuController = exports.addFoodToMenuController = void 0;
const utils_1 = require("../utils");
const services_1 = require("../services");
const infrastructure_1 = require("../infrastructure");
const mongoose_1 = __importDefault(require("mongoose"));
const addFoodToMenuController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parse the categories string into an array
        let categories;
        if (Array.isArray(req.body.categories)) {
            categories = req.body.categories;
        }
        else if (typeof req.body.categories === 'string') {
            categories = req.body.categories.split(',').map((item) => item.trim()) || [];
        }
        else {
            throw new utils_1.BadRequestError('Invalid categories provided');
        }
        // Parse suitable_for_diet into an array
        let suitable_for_diet;
        if (Array.isArray(req.body.suitable_for_diet)) {
            suitable_for_diet = req.body.suitable_for_diet;
        }
        else if (typeof req.body.suitable_for_diet === 'string') {
            suitable_for_diet =
                req.body.suitable_for_diet.split(',').map((item) => item.trim()) || [];
        }
        else {
            throw new utils_1.BadRequestError('Invalid suitable_for_diet provided');
        }
        // Parse suitable_for_conditions into an array
        let suitable_for_conditions;
        if (Array.isArray(req.body.suitable_for_conditions)) {
            suitable_for_conditions = req.body.suitable_for_conditions;
        }
        else if (typeof req.body.suitable_for_conditions === 'string') {
            suitable_for_conditions =
                req.body.suitable_for_conditions.split(',').map((item) => item.trim()) || [];
        }
        else {
            throw new utils_1.BadRequestError('Invalid suitable_for_conditions provided');
        }
        // Parse allergens into an array
        let allergens;
        if (Array.isArray(req.body.allergens)) {
            allergens = req.body.allergens;
        }
        else if (typeof req.body.allergens === 'string') {
            allergens = req.body.allergens.split(',').map((item) => item.trim()) || [];
        }
        else {
            throw new utils_1.BadRequestError('Invalid allergens provided');
        }
        // Parse health_benefits into an array
        let health_benefits;
        if (Array.isArray(req.body.health_benefits)) {
            health_benefits = req.body.health_benefits;
        }
        else if (typeof req.body.health_benefits === 'string') {
            health_benefits = req.body.health_benefits.split(',').map((item) => item.trim()) || [];
        }
        else {
            throw new utils_1.BadRequestError('Invalid health_benefits provided');
        }
        const result = yield services_1.foodMenuCreateService.addFoodToMenu(Object.assign(Object.assign({}, req.body), { categories, // Pass the parsed array
            suitable_for_diet, // Pass the parsed array
            suitable_for_conditions, // Pass the parsed array
            allergens, // Pass the parsed array
            health_benefits, user: req.user, food_image: req.file }));
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
const fetchOneMenuController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { menuId } = req.params;
        const result = yield services_1.foodMenuReadService.getOneMenu({
            menuId: new mongoose_1.default.Types.ObjectId(menuId),
            user: req.user,
        });
        utils_1.Helper.formatAPIResponse(res, 'Fetched food menu successfully', result);
    }
    catch (error) {
        next(error);
    }
});
exports.fetchOneMenuController = fetchOneMenuController;
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
