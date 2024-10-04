import { NextFunction, Request, Response } from 'express';
import { Helper } from '../utils';
import { authCreateService, authReadService } from '../services';
import { AuthUserClaim } from '../typings/user';

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authCreateService.register(req.body);
    Helper.formatAPIResponse(res, 'Account created successfully', result, 201);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authCreateService.authenticate(req.body);
    Helper.formatAPIResponse(res, 'User logged in successfully', result);
  } catch (error) {
    next(error);
  }
};

export const verifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authCreateService.confirmEmail(req.body);
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
    const result = await authCreateService.resendEmailVerificationCode(req.body);
    Helper.formatAPIResponse(res, 'Email verification code resent', result);
  } catch (error) {
    next(error);
  }
};

export const meController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract userId from session claim
    const userId = req.user?.sub;
    const result = await authReadService.me(userId as string);
    Helper.formatAPIResponse(res, 'Profile fetched', result);
  } catch (error) {
    next(error);
  }
};

export const onboardingController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract userId from session claim
    const user = req.user as AuthUserClaim;
    const result = await authCreateService.processUserOnboarding({ ...req.body, user });
    Helper.formatAPIResponse(res, 'Onboarding completed', result);
  } catch (error) {
    next(error);
  }
};

export const initatePasswordResetController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authCreateService.initatePasswordReset({ ...req.body });
    Helper.formatAPIResponse(res, 'Password reset flow initiated', result);
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authCreateService.resetPassword({ ...req.body });
    Helper.formatAPIResponse(res, 'Password resetted', result);
  } catch (error) {
    next(error);
  }
};
