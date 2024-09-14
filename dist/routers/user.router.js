"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
exports.userRouter = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users
 */
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Fetch all users with optional filters and pagination
 *     tags:
 *       - Users
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
 *       - name: query
 *         in: query
 *         description: Text search on users
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fetched users successfully
 *                 data:
 *                   type: array
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
exports.userRouter.get('/', middlewares_1.resolveAuthContext, controllers_1.getAllUsersController);
/**
 * @swagger
 * /users/employees:
 *   get:
 *     summary: Fetch all employees belonging to your compaay with optional filters and pagination
 *     tags:
 *       - Users
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
 *       - name: query
 *         in: query
 *         description: Text search on employees
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched employees
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fetched users successfully
 *                 data:
 *                   type: array
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
exports.userRouter.get('/employees', middlewares_1.resolveAuthContext, controllers_1.getAllEmployeesController);
