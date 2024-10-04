import { NextFunction, Request, Response } from 'express';
import { BadRequestError, Helper } from '../utils';
import { foodMenuCreateService, foodMenuReadService, userReadService } from '../services';

import { FetchFoodMenuDTO } from '../services/dtos/request.dto';
import { FoodCategory } from '../infrastructure';
import { AuthUserClaim } from '../typings/user';
import mongoose from 'mongoose';

export const addFoodToMenuController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Parse the categories string into an array
    let categories;
    if (Array.isArray(req.body.categories)) {
      categories = req.body.categories;
    } else if (typeof req.body.categories === 'string') {
      categories = req.body.categories.split(',').map((item: any) => item.trim()) || [];
    } else {
      throw new BadRequestError('Invalid categories provided');
    }

    // Parse suitable_for_diet into an array
    let suitable_for_diet;
    if (Array.isArray(req.body.suitable_for_diet)) {
      suitable_for_diet = req.body.suitable_for_diet;
    } else if (typeof req.body.suitable_for_diet === 'string') {
      suitable_for_diet =
        req.body.suitable_for_diet.split(',').map((item: any) => item.trim()) || [];
    } else {
      throw new BadRequestError('Invalid suitable_for_diet provided');
    }

    // Parse suitable_for_conditions into an array
    let suitable_for_conditions;
    if (Array.isArray(req.body.suitable_for_conditions)) {
      suitable_for_conditions = req.body.suitable_for_conditions;
    } else if (typeof req.body.suitable_for_conditions === 'string') {
      suitable_for_conditions =
        req.body.suitable_for_conditions.split(',').map((item: any) => item.trim()) || [];
    } else {
      throw new BadRequestError('Invalid suitable_for_conditions provided');
    }

    // Parse allergens into an array
    let allergens;
    if (Array.isArray(req.body.allergens)) {
      allergens = req.body.allergens;
    } else if (typeof req.body.allergens === 'string') {
      allergens = req.body.allergens.split(',').map((item: any) => item.trim()) || [];
    } else {
      throw new BadRequestError('Invalid allergens provided');
    }

    // Parse health_benefits into an array
    let health_benefits;
    if (Array.isArray(req.body.health_benefits)) {
      health_benefits = req.body.health_benefits;
    } else if (typeof req.body.health_benefits === 'string') {
      health_benefits = req.body.health_benefits.split(',').map((item: any) => item.trim()) || [];
    } else {
      throw new BadRequestError('Invalid health_benefits provided');
    }

    const result = await foodMenuCreateService.addFoodToMenu({
      ...req.body,
      categories, // Pass the parsed array
      suitable_for_diet, // Pass the parsed array
      suitable_for_conditions, // Pass the parsed array
      allergens, // Pass the parsed array
      health_benefits, // Pass the parsed array
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
    const { limit, lastScore, lastId, category, query, risk_health } = req.query;

    // Convert category string to FoodCategory enum if provided
    const categoryEnum =
      category && Object.values(FoodCategory).includes(category as FoodCategory)
        ? (category as FoodCategory)
        : undefined;

    // Ensure risk_health is treated as a boolean
    const isRiskHealth = risk_health === 'true'; // Convert the string to a boolean

    const fetchFoodMenuDTO: FetchFoodMenuDTO = {
      limit: limit ? parseInt(limit as string, 10) : 10,
      lastScore: lastScore ? parseFloat(lastScore as string) : undefined,
      lastId: (lastId as string) || undefined,
      category: categoryEnum,
      query: (query as string) || undefined,
      user: req.user as AuthUserClaim,
      risk_health: isRiskHealth, // Correctly assign the boolean value
    };

    const result = await foodMenuReadService.getAllMenu(fetchFoodMenuDTO);
    Helper.formatAPIResponse(res, 'Fetched food menu successfully', result);
  } catch (error) {
    next(error);
  }
};

export const fetchOneMenuController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { menuId } = req.params;

    const result = await foodMenuReadService.getOneMenu({
      menuId: new mongoose.Types.ObjectId(menuId),
      user: req.user as AuthUserClaim,
    });
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
