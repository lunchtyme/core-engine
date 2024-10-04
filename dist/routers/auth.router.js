"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
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
 *         - time_zone
 *       properties:
 *         email:
 *           type: string
 *           example: "company@example.com"
 *         password:
 *           type: string
 *           example: "securePassword123!"
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
 *         time_zone:
 *           type: string
 *           example: "Africa/Lagos"
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
 *         - time_zone
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
 *         time_zone:
 *           type: string
 *           example: "Africa/Lagos"
 *     CreateAdminAccountDTO:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - account_type
 *         - first_name
 *         - last_name
 *         - time_zone
 *       properties:
 *         email:
 *           type: string
 *           example: "admin@example.com"
 *         password:
 *           type: string
 *           example: "securePassword123?"
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
 *         time_zone:
 *           type: string
 *           example: "Africa/Lagos"
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
 *                     onboarded:
 *                       type: boolean
 *                       example: false
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
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Fetch sessioned user's hydrated data
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data fetched successfully
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
 *                   example: Profile fetched
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "66da18efe3e4db49ec4be929"
 *                     account_type:
 *                       type: string
 *                       example: Company
 *                     account_state:
 *                       type: string
 *                       example: ACTIVE
 *                     email:
 *                       type: string
 *                       example: "tobi@lunch.store"
 *                     email_verified:
 *                       type: boolean
 *                       example: false
 *                     verified:
 *                       type: boolean
 *                       example: false
 *                     dial_code:
 *                       type: string
 *                       example: "+1"
 *                     phone_number:
 *                       type: string
 *                       example: "1234567890"
 *                     time_zone:
 *                       type: string
 *                       example: "Africa/Lagos"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-09-05T20:47:43.508Z"
 *                     onboarded:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: Unauthorized - Session expired, please login to continue.
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
 *                   example: Unauthorized
 *                 data:
 *                   type: object
 *                   example: null
 */
exports.authRouter.get('/me', middlewares_1.resolveAuthContext, controllers_1.meController);
/**
 * @swagger
 * /auth/onboard:
 *   post:
 *     summary: Onboard a user (Company or Employee)
 *     description: This endpoint handles the onboarding process for users, either as a company or an employee.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/EmployeeOnboardingDTO'
 *               - $ref: '#/components/schemas/CompanyOnboardingDTO'
 *     responses:
 *       200:
 *         description: User successfully onboarded
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
 *                   example: User onboarded successfully
 *                 data:
 *                   type: string
 *                   description: User ID of the onboarded user
 *                   example: "64d9f5c3c394bb73b5b5c681"
 *       400:
 *         description: Invalid input or validation error
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Internal server error
 * components:
 *   schemas:
 *     CreateAddressDTO:
 *       type: object
 *       properties:
 *         address_line_1:
 *           type: string
 *           example: "123 Main St"
 *         address_line_2:
 *           type: string
 *           example: "Apt 4B"
 *         city:
 *           type: string
 *           example: "New York"
 *         state:
 *           type: string
 *           example: "NY"
 *         country:
 *           type: string
 *           example: "USA"
 *         zip_code:
 *           type: string
 *           example: "10001"
 *
 *     EmployeeOnboardingDTO:
 *       allOf:
 *         - $ref: '#/components/schemas/CreateAddressDTO'
 *         - type: object
 *           properties:
 *             lunch_time:
 *               type: string
 *               example: "12:00 PM"
 *
 *     CompanyOnboardingDTO:
 *       allOf:
 *         - $ref: '#/components/schemas/CreateAddressDTO'
 *         - type: object
 *           properties:
 *             max_spend_amount_per_employee:
 *               type: string
 *               example: "100"
 *             size:
 *               type: string
 *               example: "50-100"
 */
exports.authRouter.post('/onboard', middlewares_1.resolveAuthContext, controllers_1.onboardingController);
/**
 * @swagger
 * /auth/request-password-reset:
 *   post:
 *     summary: Request a password reset link
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
 *                 format: email
 *                 description: The email address to send the password reset link.
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset link sent successfully.
 *       400:
 *         description: Invalid email or other validation error.
 */
exports.authRouter.post('/request-password-reset', controllers_1.initatePasswordResetController);
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset the user's password
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
 *                 format: email
 *                 description: The email of the user resetting the password.
 *                 example: "user@example.com"
 *               otp:
 *                 type: string
 *                 description: OTP sent to the user's email.
 *                 example: "123456"
 *               password:
 *                 type: string
 *                 description: New password for the user.
 *                 example: "P@ssw0rd!"
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of the new password.
 *                 example: "P@ssw0rd!"
 *     responses:
 *       200:
 *         description: Password reset successful.
 *       400:
 *         description: Invalid input or password mismatch.
 */
exports.authRouter.post('/reset-password', controllers_1.resetPasswordController);
