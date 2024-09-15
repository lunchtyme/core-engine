import { NextFunction, Request, Response } from 'express';
import { Helper } from '../utils';
import { AuthUserClaim } from '../typings/user';
import { adminReadService, userReadService } from '../services';

export const adminAnalyticsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminReadService.getOverviewAnalytics(req.user as AuthUserClaim);
    Helper.formatAPIResponse(res, 'Analytics data fetched', result);
  } catch (error) {
    next(error);
  }
};

export const employeeAnalyticsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await userReadService.getEmployeeOverviewAnalytics(req.user as AuthUserClaim);
    Helper.formatAPIResponse(res, 'Analytics data fetched', result);
  } catch (error) {
    next(error);
  }
};

export const companyAnalyticsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await userReadService.getCompanyOverviewAnalytics(req.user as AuthUserClaim);
    Helper.formatAPIResponse(res, 'Analytics data fetched', result);
  } catch (error) {
    next(error);
  }
};
