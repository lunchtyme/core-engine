import { NextFunction, Request, Response } from 'express';
import { Helper } from '../utils';
import { CreateBillingDTO, FetchBillingsDTO } from '../services/dtos/request.dto';

import { billingCreateService, billingReadService } from '../services';
import { AuthUserClaim } from '../typings/user';
import logger from '../utils/logger';

export const topUpWalletBalanceController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const createBillingDTO: CreateBillingDTO = {
      amount: req.body.amount,
      user: req.user as AuthUserClaim,
    };
    const result = await billingCreateService.topupWalletBalance(createBillingDTO);
    Helper.formatAPIResponse(res, 'Billing process in progress', result, 201);
  } catch (error) {
    next(error);
  }
};

export const processPaystackWebhookController = async (req: Request, res: Response) => {
  try {
    await billingCreateService.processWebhook({
      body: req.body,
      signature: req.headers['x-paystack-signature'] as string,
    });
    return res.sendStatus(200);
  } catch (error) {
    logger.error('Error processing webhook event', { error });
    return res.sendStatus(500);
  }
};

export const getBillingHistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { limit, lastId } = req.query;

    const getBillingHistoryDTO: FetchBillingsDTO = {
      user: req.user as AuthUserClaim,
      limit: limit ? parseInt(limit as string, 10) : 10,
      lastId: (lastId as string) || undefined,
    };
    const result = await billingReadService.getBillingHistory(getBillingHistoryDTO);
    Helper.formatAPIResponse(res, 'Billing data fetched', result);
  } catch (error) {
    next(error);
  }
};
