import { NextFunction, Request, Response } from 'express';
import { Helper } from '../utils';
import { AuthUserClaim } from '../typings/user';
import {
  FetchMealSuggestionsDTO,
  mealSuggestionCreateService,
  mealSuggestionReadService,
} from '../services';

export const addMealSuggestionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await mealSuggestionCreateService.addMealSuggestion({
      user: req.user as AuthUserClaim,
      description: req.body.description,
      name: req.body.name,
      reason_for_suggestion: req.body.reason_for_suggestion,
    });

    Helper.formatAPIResponse(res, 'Meal suggestion submitted successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getMealSuggestionsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { limit, lastId } = req.query;

    const getMealSuggestionsDTO: FetchMealSuggestionsDTO = {
      user: req.user as AuthUserClaim,
      limit: limit ? parseInt(limit as string, 10) : 10,
      lastId: (lastId as string) || undefined,
    };
    const result = await mealSuggestionReadService.getAll(getMealSuggestionsDTO);
    Helper.formatAPIResponse(res, 'Meal suggestions fetched', result);
  } catch (error) {
    next(error);
  }
};
