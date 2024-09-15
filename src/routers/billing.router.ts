import { Router } from 'express';
import { resolveAuthContext } from '../middlewares';
import {
  getBillingHistoryController,
  processPaystackWebhookController,
  topUpWalletBalanceController,
} from '../controllers';

export const billingRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Billing
 *   description: Billing session
 */

/**
 * @swagger
 * /billings/topup:
 *   post:
 *     summary: Topup company wallet balance
 *     tags:
 *       - Billing
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet topup in progress
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wallet topup in progress
 *                 data:
 *
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

billingRouter.post('/topup', resolveAuthContext, topUpWalletBalanceController);

billingRouter.post('/webhook', processPaystackWebhookController);

/**
 * @swagger
 * /billings:
 *   get:
 *     summary: Fetch all billings with optional filters and pagination
 *     tags:
 *       - Billing
 *     security:
 *      - bearerAuth: []
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
 *         description: Successfully fetched billings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully fetched billings
 *                 data:
 *                   type: array
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
billingRouter.get('/', resolveAuthContext, getBillingHistoryController);
