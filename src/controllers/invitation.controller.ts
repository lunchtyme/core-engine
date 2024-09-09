import { NextFunction, Request, Response } from 'express';
import { Helper } from '../utils';
import { invitationCreateService, invitationReadService } from '../services';

export const sendInvitationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await invitationCreateService.createOrResendInvitation(req.body);
    Helper.formatAPIResponse(res, 'Invitation sent', result);
  } catch (error) {
    next(error);
  }
};

export const fetchMyInvitationsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await invitationReadService.fetchMyInvitations({ user: req.user?.sub });
    Helper.formatAPIResponse(res, 'Invitations fetched', result);
  } catch (error) {
    next(error);
  }
};

export const fetchInvitationsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await invitationReadService.fetchAllInvitations({ user: req.user?.sub });
    Helper.formatAPIResponse(res, 'Invitations Fetched', result);
  } catch (error) {
    next(error);
  }
};
