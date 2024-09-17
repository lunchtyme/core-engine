import { NextFunction, Request, Response } from 'express';

export const globalErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(err);
  const errStatusCode = err.statusCode ?? 500;
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
