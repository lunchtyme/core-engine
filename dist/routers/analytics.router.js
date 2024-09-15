"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRouter = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const analytics_controller_1 = require("../controllers/analytics.controller");
exports.analyticsRouter = (0, express_1.Router)();
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
exports.analyticsRouter.get('/admin', middlewares_1.resolveAuthContext, analytics_controller_1.adminAnalyticsController);
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
exports.analyticsRouter.get('/employee', middlewares_1.resolveAuthContext, analytics_controller_1.employeeAnalyticsController);
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
exports.analyticsRouter.get('/company', middlewares_1.resolveAuthContext, analytics_controller_1.companyAnalyticsController);
