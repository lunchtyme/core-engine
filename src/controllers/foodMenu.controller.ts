import { NextFunction, Request, Response } from 'express';
import { Helper } from '../utils';
import { foodMenuCreateService, foodMenuReadService } from '../services';
import { AuthUserClaim } from '../typings/user';

export const addFoodToMenuController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await foodMenuCreateService.addFoodToMenu({
      ...req.body,
      user: req.user as AuthUserClaim,
    });
    Helper.formatAPIResponse(res, 'New food added to menu', result);
  } catch (error) {
    next(error);
  }
};
