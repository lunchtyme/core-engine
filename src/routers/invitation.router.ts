import { Router } from 'express';
import { resolveAuthContext } from '../middlewares';
import { sendInvitationController } from '../controllers';

export const invitationRouter = Router();

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
 */
invitationRouter.post('/', resolveAuthContext, sendInvitationController);
