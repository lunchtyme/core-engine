import { NextFunction, Request, Response } from 'express';
import { Helper } from '../utils';
import { userReadService } from '../services';
import { FetchUsersDTO } from '../services/dtos/request.dto';
import { AuthUserClaim } from '../typings/user';

export const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, lastScore, lastId, query } = req.query;
    const fetchAllUsersDTO: FetchUsersDTO = {
      limit: limit ? parseInt(limit as string, 10) : 10,
      lastScore: lastScore ? parseFloat(lastScore as string) : undefined,
      lastId: (lastId as string) || undefined,
      query: (query as string) || undefined,
      user: req.user as AuthUserClaim,
    };
    const data = await userReadService.allUsers(fetchAllUsersDTO);
    const result = Helper.hydrateUsers(data);
    Helper.formatAPIResponse(res, 'All users fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getAllEmployeesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { limit, lastScore, lastId, query } = req.query;
    const fetchAllEmployeesDTO: FetchUsersDTO = {
      limit: limit ? parseInt(limit as string, 10) : 10,
      lastScore: lastScore ? parseFloat(lastScore as string) : undefined,
      lastId: (lastId as string) || undefined,
      query: (query as string) || undefined,
      user: req.user as AuthUserClaim,
    };
    const data = await userReadService.allEmployeesForCompany(fetchAllEmployeesDTO);
    const result = Helper.hydrateUsers(data);
    Helper.formatAPIResponse(res, 'All employees fetched successfully', result);
  } catch (error) {
    next(error);
  }
};
