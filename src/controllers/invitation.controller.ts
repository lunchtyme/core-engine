import { NextFunction, Request, Response } from 'express';
import { Helper } from '../utils';
import { invitationCreateService } from '../services';

export const sendInvitationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await invitationCreateService.createOrResendInvitation(req.body);
    Helper.formatAPIResponse(res, 'Invitation sent', result);
  } catch (error) {
    next(error);
  }
};
