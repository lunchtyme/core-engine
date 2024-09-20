import { Router } from 'express';
import { createOrderController, fetchOrders, updateOrderStatusController } from '../controllers';
import { resolveAuthContext } from '../middlewares';

export const orderRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Orders section
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               foodItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     food_menu:
 *                       type: string
 *                       description: ID of the food item from the menu
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the desired food item
 *     responses:
 *       200:
 *         description: Successful order creation
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
 *                     orderId:
 *                       type: string
 *                       description: Unique identifier of the created order
 *                     # ... other properties returned by the service
 */
orderRouter.post('/', resolveAuthContext, createOrderController);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get order history for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of items to fetch
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: lastId
 *         in: query
 *         description: The ID of the last item from the previous fetch (used for cursor pagination)
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fetched order history
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     # ... properties representing individual order details
 */
orderRouter.get('/', resolveAuthContext, fetchOrders);

/**
 * @swagger
 * /orders/update-status:
 *   patch:
 *     summary: Update the status of an existing order (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: Unique identifier of the order to update
 *               newStatus:
 *                 type: string
 *                 description: New status for the order (e.g., PENDING, CONFIRMED, DELIVERED, CANCELLED)
 *     responses:
 *       200:
 *         description: Order status updated successfully
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
 *                   # ... properties representing the updated order details
 */
orderRouter.patch('/update-status', resolveAuthContext, updateOrderStatusController);