import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JsonWebTokenError } from 'jsonwebtoken';
import { UnAuthenticatedError } from '../utils';
import { AuthUserClaim } from '../typings/user';

export const resolveAuthContext = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnAuthenticatedError('Access token is missing');
    }
    // Extract auth token at array index 1, "Bearer jwt_token"
    const jwtToken = authHeader.split(' ')[1];
    const jwtClaim = jwt.verify(jwtToken, process.env.JWT_SECRET!) as AuthUserClaim;
    if (!jwtClaim) {
      throw new UnAuthenticatedError('Session expired, please login to continue');
    }
    req.user = jwtClaim;
    // Pass control to the next middleware on-chain
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      next(new UnAuthenticatedError('Session expired, please login to continue'));
    }
    // re-throw error
    next(error);
  }
};
