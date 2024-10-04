"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.foodMenuRouter = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const multer_1 = __importDefault(require("multer"));
const multerUploader = (0, multer_1.default)({
    limits: {
        fileSize: 1024 * 1024 * 200, // 2 GB (adjust the size limit as needed)
    },
    dest: 'uploads/',
});
exports.foodMenuRouter = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: FoodMenu
 *   description: Operations related to food menu management
 */
/**
 * @swagger
 * /food-menu/new:
 *   post:
 *     summary: Add a new food item to the menu
 *     tags: [FoodMenu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - categories
 *               - food_image
 *               - health_benefits
 *               - allergens
 *               - suitable_for_conditions
 *               - suitable_for_diet
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the food item
 *                 example: "Chicken Sandwich"
 *               description:
 *                 type: string
 *                 description: A brief description of the food item
 *                 example: "Grilled chicken sandwich with lettuce and mayo"
 *               price:
 *                 type: string
 *                 description: The price of the food item
 *                 example: "12.99"
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: One or more categories the food item belongs to
 *                 example: ["Appetizer", "Main Course"]
 *               food_image:
 *                 type: string
 *                 format: binary
 *                 description: The image of the food item
 *               health_benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of health benefits
 *                 example: ["Boosts immunity", "Aids digestion"]
 *               allergens:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of allergens present in the food
 *                 example: ["Nuts", "Dairy"]
 *               suitable_for_conditions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of medical conditions suitable for this food
 *                 example: ["Diabetes", "Hypertension"]
 *               suitable_for_diet:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of dietary preferences suitable for this food
 *                 example: ["Vegan", "Gluten-Free"]
 *     responses:
 *       201:
 *         description: Food item added to the menu successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Food item added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID of the newly added food item
 *                       example: "64a0f59c75e5f8abdbc12345"
 *                     name:
 *                       type: string
 *                       description: Name of the food item
 *                       example: "Chicken Sandwich"
 *                     description:
 *                       type: string
 *                       description: Brief description of the food item
 *                       example: "Grilled chicken sandwich with lettuce and mayo"
 *                     price:
 *                       type: string
 *                       description: Price of the food item
 *                       example: "12.99"
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: One or more categories the food item belongs to
 *                       example: ["Appetizer", "Main Course"]
 *                     health_benefits:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of health benefits
 *                       example: ["Boosts immunity", "Aids digestion"]
 *                     allergens:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of allergens present in the food
 *                       example: ["Nuts", "Dairy"]
 *                     suitable_for_conditions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of medical conditions suitable for this food
 *                       example: ["Diabetes", "Hypertension"]
 *                     suitable_for_diet:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of dietary preferences suitable for this food
 *                       example: ["Vegan", "Gluten-Free"]
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid request data"
 */
exports.foodMenuRouter.post('/new', multerUploader.single('food_image'), middlewares_1.resolveAuthContext, controllers_1.addFoodToMenuController);
/**
 * @swagger
 * /food-menu:
 *   get:
 *     summary: Fetch food menu with optional filters and pagination
 *     tags:
 *       - FoodMenu
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of items to fetch
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: lastScore
 *         in: query
 *         description: The score of the last item from the previous fetch (used for cursor pagination)
 *         required: false
 *         schema:
 *           type: number
 *       - name: lastId
 *         in: query
 *         description: The ID of the last item from the previous fetch (used for cursor pagination)
 *         required: false
 *         schema:
 *           type: string
 *       - name: category
 *         in: query
 *         description: Filter food menu by category
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Appetizer, Main Course, Dessert, Beverage, Salad, Soup, Pasta, Pizza, Seafood, Vegetarian, Vegan, Gluten-Free, Sandwich, Grill, Steak, Burger, Sides, Breakfast, Brunch, Smoothie, Coffee, Tea, Juice, Snack, Specials]
 *       - name: query
 *         in: query
 *         description: Text search on the food menu
 *         required: false
 *         schema:
 *           type: string
 *       - name: risk_health
 *         in: query
 *         description: Flag to allow fetching menus that may not be suitable for the user's health
 *         required: false
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Successfully fetched the food menu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fetched food menu successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FoodMenu'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
exports.foodMenuRouter.get('/', middlewares_1.resolveAuthContext, controllers_1.fetchMenuController);
/**
 * @swagger
 * /food-menu:
 *   patch:
 *     summary: Update the availability of a food menu item
 *     tags: [FoodMenu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               foodMenuId:
 *                 type: string
 *                 description: Unique identifier of the food menu item
 *               available:
 *                 type: boolean
 *                 description: Whether the food menu item is available or not
 *     responses:
 *       200:
 *         description: Food menu availability updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     foodMenuId:
 *                       type: string
 *                       description: Unique identifier of the updated food menu item
 *                     available:
 *                       type: boolean
 *                       description: Updated availability status of the food menu item
 */
exports.foodMenuRouter.patch('/', middlewares_1.resolveAuthContext, controllers_1.updateFoodMenuAvaliabilityController);
/**
 * @swagger
 * /food-menu/{menuId}:
 *   get:
 *     summary: Fetch a specific food menu item by its ID
 *     tags:
 *       - FoodMenu
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: menuId
 *         in: path
 *         description: The ID of the food menu item to fetch
 *         required: true
 *         schema:
 *           type: string
 *           example: "64a0f59c75e5f8abdbc12345"
 *     responses:
 *       200:
 *         description: Successfully fetched the food menu item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully fetched the food menu
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the food item
 *                       example: "Grilled Chicken Salad"
 *                     description:
 *                       type: string
 *                       description: A brief description of the food item
 *                       example: "A healthy grilled chicken salad with fresh greens"
 *                     price:
 *                       type: string
 *                       description: The price of the food item
 *                       example: "15.99"
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: The categories the food item belongs to
 *                       example: ["Salad", "Grill"]
 *                     health_benefits:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Health benefits of the food item
 *                       example: ["Boosts immunity", "Rich in vitamins"]
 *                     allergens:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Allergens present in the food item
 *                       example: ["Dairy", "Peanuts"]
 *                     suitable_for_conditions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Medical conditions the food item is suitable for
 *                       example: ["Diabetes", "Hypertension"]
 *                     suitable_for_diet:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Dietary preferences the food item is suitable for
 *                       example: ["Vegan", "Gluten-Free"]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The creation date of the food menu item
 *                       example: "2024-10-04T12:34:56.789Z"
 *       400:
 *         description: Bad request, invalid menuId parameter
 *       404:
 *         description: Food menu item not found
 *       500:
 *         description: Internal server error
 */
exports.foodMenuRouter.get('/:menuId', middlewares_1.resolveAuthContext, controllers_1.fetchOneMenuController);
