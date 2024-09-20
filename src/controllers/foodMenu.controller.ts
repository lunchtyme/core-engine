import { NextFunction, Request, Response } from 'express';
import { BadRequestError, Helper } from '../utils';
import { foodMenuCreateService, foodMenuReadService, userReadService } from '../services';

import { FetchFoodMenuDTO } from '../services/dtos/request.dto';
import { FoodCategory } from '../infrastructure';
import { AuthUserClaim } from '../typings/user';

export const addFoodToMenuController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Parse the categories string into an array
    let categories;
    if (Array.isArray(req.body.categories)) {
      categories = req.body.categories;
    } else if (typeof req.body.categories === 'string') {
      categories = req.body.categories.split(',') || [];
    } else {
      throw new BadRequestError('Invalid categories provided');
    }

    const result = await foodMenuCreateService.addFoodToMenu({
      ...req.body,
      categories, // Pass the parsed array
      user: req.user as AuthUserClaim,
      food_image: req.file, // Handle the file
    });

    Helper.formatAPIResponse(res, 'New food added to menu', result);
  } catch (error) {
    next(error);
  }
};

export const fetchMenuController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, lastScore, lastId, category, query } = req.query;

    // Convert category string to FoodCategory enum if provided
    const categoryEnum =
      category && Object.values(FoodCategory).includes(category as FoodCategory)
        ? (category as FoodCategory)
        : undefined;

    const fetchFoodMenuDTO: FetchFoodMenuDTO = {
      limit: limit ? parseInt(limit as string, 10) : 10,
      lastScore: lastScore ? parseFloat(lastScore as string) : undefined,
      lastId: (lastId as string) || undefined,
      category: categoryEnum,
      query: (query as string) || undefined,
      user: req.user as AuthUserClaim,
    };
    const result = await foodMenuReadService.getAllMenu(fetchFoodMenuDTO);
    Helper.formatAPIResponse(res, 'Fetched food menu successfully', result);
  } catch (error) {
    next(error);
  }
};

export const updateFoodMenuAvaliabilityController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await foodMenuCreateService.updateFoodAvalibility({
      foodMenuId: req.body.foodMenuId,
      available: req.body.available,
      user: req.user as AuthUserClaim,
    });

    Helper.formatAPIResponse(res, 'Food menu availability updated', result);
  } catch (error) {
    next(error);
  }
};
