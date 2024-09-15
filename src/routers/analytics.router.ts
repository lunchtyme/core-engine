import { Router } from 'express';
import {} from '../controllers';
import { resolveAuthContext } from '../middlewares';
import {
  adminAnalyticsController,
  companyAnalyticsController,
  employeeAnalyticsController,
} from '../controllers/analytics.controller';

export const analyticsRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics section
 */

/**
 * @swagger
 * /analytics/admin:
 *   get:
 *     summary: Get admin analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
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
 */

analyticsRouter.get('/admin', resolveAuthContext, adminAnalyticsController);

/**
 * @swagger
 * /analytics/employee:
 *   get:
 *     summary: Get employee analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
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
 */
analyticsRouter.get('/employee', resolveAuthContext, employeeAnalyticsController);

/**
 * @swagger
 * /analytics/company:
 *   get:
 *     summary: Get company analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
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
 */
analyticsRouter.get('/company', resolveAuthContext, companyAnalyticsController);
