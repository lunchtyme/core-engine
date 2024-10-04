"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mealSuggestionRouter = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
exports.mealSuggestionRouter = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Meal Suggestion
 *   description: Meal suggestion section
 */
/**
 * @swagger
 * /meal/suggest:
 *   post:
 *     summary: Submit a meal suggestion
 *     description: Allows customers to suggest new meals to the platform
 *     tags: [Meal Suggestion]
 *     security:
 *       - bearerAuth: []  # Assuming your API uses Bearer token authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the suggested meal
 *                 example: "Vegetable Stir-Fry"
 *               description:
 *                 type: string
 *                 description: A brief description of the suggested meal
 *                 example: "A delicious mix of seasonal vegetables stir-fried with soy sauce."
 *               reason_for_suggestion:
 *                 type: string
 *                 description: Optional reason for the meal suggestion
 *                 example: "It's a family favorite and very healthy."
 *     responses:
 *       201:
 *         description: Meal suggestion submitted successfully
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
 *                   example: "Meal suggestion submitted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the newly submitted suggestion
 *                       example: "64b123f93478a6e9d0e12345"
 *                     name:
 *                       type: string
 *                       description: The name of the suggested meal
 *                       example: "Vegetable Stir-Fry"
 *                     description:
 *                       type: string
 *                       description: The description of the suggested meal
 *                       example: "A delicious mix of seasonal vegetables stir-fried with soy sauce."
 *                     reason_for_suggestion:
 *                       type: string
 *                       description: Reason for suggesting the meal
 *                       example: "It's a family favorite."
 *       400:
 *         description: Invalid request data
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
 *       401:
 *         description: Unauthorized access
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
 *                   example: "Unauthorized"
 */
exports.mealSuggestionRouter.post('/suggest', middlewares_1.resolveAuthContext, controllers_1.addMealSuggestionController);
/**
 * @swagger
 * /meal/suggestions:
 *   get:
 *     summary: Fetch meal suggestions with optional filters and pagination
 *     tags:
 *       - Meal Suggestion
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of meal suggestions to fetch
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: lastId
 *         in: query
 *         description: The ID of the last suggestion from the previous fetch (used for cursor pagination)
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched meal suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully fetched meal suggestions
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The name of the suggested meal
 *                         example: "Vegetable Stir-Fry"
 *                       description:
 *                         type: string
 *                         description: A brief description of the suggested meal
 *                         example: "A mix of vegetables stir-fried with soy sauce."
 *                       reason_for_suggestion:
 *                         type: string
 *                         description: The reason the user suggested the meal
 *                         example: "It's a family favorite."
 *                       user:
 *                         type: string
 *                         description: The ID of the user who suggested the meal
 *                         example: "603dcd417997db243b3c7a6d"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date when the suggestion was submitted
 *                         example: "2024-10-04T12:34:56.789Z"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching meal suggestions"
 */
exports.mealSuggestionRouter.get('/suggestions', middlewares_1.resolveAuthContext, controllers_1.getMealSuggestionsController);
