import { NextFunction, Request, Response } from 'express';
import { Helper } from '../utils';
import { authService } from '../services';

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    Helper.formatAPIResponse(res, 'Account created successfully', result, 201);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.authenticate(req.body);
    Helper.formatAPIResponse(res, 'User logged in successfully', result);
  } catch (error) {
    next(error);
  }
};

export const verifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.confirmEmail(req.body);
    Helper.formatAPIResponse(res, 'Email confirmed successfully', result);
  } catch (error) {
    next(error);
  }
};

export const resendVerificationCodeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.resendEmailVerificationCode(req.body);
    Helper.formatAPIResponse(res, 'Email verification code resent', result);
  } catch (error) {
    next(error);
  }
};

export const meController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract userId from session claim
    const userId = req.user?.sub;
    const result = await authService.me(userId as string);
    Helper.formatAPIResponse(res, 'Profile fetched', result);
  } catch (error) {
    next(error);
  }
};
