"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
exports.authRouter = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication section
 */
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/CreateCompanyAccountDTO'
 *               - $ref: '#/components/schemas/CreateIndividualAccountDTO'
 *               - $ref: '#/components/schemas/CreateAdminAccountDTO'
 *     responses:
 *       201:
 *         description: Account created successfully
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
 *                   example: Account created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       example: "64d9f5c3c394bb73b5b5c681"
 *       400:
 *         description: Invalid input
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
 *                   example: Invalid request parameters
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Email is required"
 * components:
 *   schemas:
 *     CreateCompanyAccountDTO:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - account_type
 *         - name
 *         - website
 *         - size
 *       properties:
 *         email:
 *           type: string
 *           example: "company@example.com"
 *         password:
 *           type: string
 *           example: "securePassword123"
 *         account_type:
 *           type: string
 *           enum: [Company]
 *           example: "Company"
 *         name:
 *           type: string
 *           example: "Example Company"
 *         website:
 *           type: string
 *           example: "https://www.example.com"
 *         size:
 *           type: string
 *           example: "100-500"
 *         max_spend_amount_per_employee:
 *           type: number
 *           example: 1000
 *         dial_code:
 *           type: string
 *           example: "+1"
 *         phone_number:
 *           type: string
 *           example: "1234567890"
 *     CreateIndividualAccountDTO:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - account_type
 *         - first_name
 *         - last_name
 *       properties:
 *         email:
 *           type: string
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           example: "securePassword123"
 *         account_type:
 *           type: string
 *           enum: [Individual]
 *           example: "Individual"
 *         first_name:
 *           type: string
 *           example: "John"
 *         last_name:
 *           type: string
 *           example: "Doe"
 *         dial_code:
 *           type: string
 *           example: "+1"
 *         phone_number:
 *           type: string
 *           example: "1234567890"
 *         invitation_code:
 *           type: string
 *           example: "INV12345"
 *         lunch_time:
 *           type: string
 *           example: "12:30 PM"
 *     CreateAdminAccountDTO:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - account_type
 *         - first_name
 *         - last_name
 *       properties:
 *         email:
 *           type: string
 *           example: "admin@example.com"
 *         password:
 *           type: string
 *           example: "securePassword123"
 *         account_type:
 *           type: string
 *           enum: [Admin]
 *           example: "Admin"
 *         first_name:
 *           type: string
 *           example: "Admin"
 *         last_name:
 *           type: string
 *           example: "User"
 *         dial_code:
 *           type: string
 *           example: "+1"
 *         phone_number:
 *           type: string
 *           example: "1234567890"
 */
exports.authRouter.post('/signup', controllers_1.registerController);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login into Lunchtyme
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: User logged in successfully
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
 *                   example: User logged in successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
exports.authRouter.post('/login', controllers_1.loginController);
/**
 * @swagger
 * /auth/confirm-email:
 *   post:
 *     summary: Confirm email address
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email confirmed successfully
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
 *                   example: Email confirmed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       example: "64d9f5c3c394bb73b5b5c681"
 */
exports.authRouter.post('/confirm-email', controllers_1.verifyEmailController);
/**
 * @swagger
 * /auth/resend-verify-email:
 *   post:
 *     summary: Resend email verification code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Email verification code resent
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
 *                   example: Email verification code resent
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       example: "64d9f5c3c394bb73b5b5c681"
 */
exports.authRouter.post('/resend-verify-email', controllers_1.resendVerificationCodeController);
