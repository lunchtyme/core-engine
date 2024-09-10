import { Router } from 'express';
import { resolveAuthContext } from '../middlewares';
import { addFoodToMenuController } from '../controllers';

export const foodMenuRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Food-Menu
 *   description: Operations related to food menu management
 */

/**
 * @swagger
 * /food-menu/new:
 *   post:
 *     summary: Add a new food item to the menu
 *     tags: [Food-Menu]
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
