import { Router } from 'express';
import { resolveAuthContext } from '../middlewares';
import { addFoodToMenuController, fetchMenuController } from '../controllers';

export const foodMenuRouter = Router();

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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - categories
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
foodMenuRouter.post('/new', resolveAuthContext, addFoodToMenuController);

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
foodMenuRouter.get('/', resolveAuthContext, fetchMenuController);