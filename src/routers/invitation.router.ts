import { Router } from 'express';
import { resolveAuthContext } from '../middlewares';
import {
  fetchInvitationsController,
  fetchMyInvitationsController,
  sendInvitationController,
} from '../controllers';

export const invitationRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Invitations
 *   description: Invitations section
 */

/**
 * @swagger
 * tags:
 *   name: Invitations
 *   description: Invitations section
 */

/**
 * @swagger
 * /invitations:
 *   post:
 *     summary: Send an invitation
 *     tags: [Invitations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employee_work_email:
 *                 type: string
 *                 format: email
 *                 example: "example@company.com"
 *     responses:
 *       201:
 *         description: Invitation sent successfully
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
 *                   example: Invitation sent successfully
 *                 data:
 *                   type: boolean
 *                   example: true
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
 *                     example: "Employee work email is required"
 */
invitationRouter.post('/', resolveAuthContext, sendInvitationController);

/**
 * @swagger
 * /invitations:
 *   get:
 *     summary: Fetch all invitations
 *     tags: [Invitations]
 *     responses:
 *       200:
 *         description: List of invitations
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
 *                   example: Invitations fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       employee_work_email:
 *                         type: string
 *                         format: email
 *                         example: "example@company.com"
 *       400:
 *         description: Invalid input or unauthorized
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
 *                   example: Invalid request or unauthorized
 */
invitationRouter.get('/', resolveAuthContext, fetchInvitationsController);

/**
 * @swagger
 * /invitations/list:
 *   get:
 *     summary: Fetch company-specific invitations
 *     tags: [Invitations]
 *     responses:
 *       200:
 *         description: List of company-specific invitations
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
 *                   example: Invitations fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       employee_work_email:
 *                         type: string
 *                         format: email
 *                         example: "example@company.com"
 *       400:
 *         description: Invalid input or unauthorized
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
 *                   example: Invalid request or unauthorized
 */
invitationRouter.get('/list', resolveAuthContext, fetchMyInvitationsController);
