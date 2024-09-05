import { NextFunction, Request, Response } from 'express';

export const globalErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errStatusCode = err.errStatusCode ?? 500;
  const errMessage =
    err instanceof Error
      ? err.message
      : 'An internal server error occurred. Please try again later.';

  res.status(errStatusCode).json({
    success: false,
    message: errMessage,
    data: null,
  });
};
