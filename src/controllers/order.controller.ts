import { NextFunction, Request, Response } from 'express';
import { Helper } from '../utils';
import { AuthUserClaim } from '../typings/user';
import { CreateOrderDTO, FetchOrderssDTO, orderCreateService, orderReadService } from '../services';

export const createOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params: CreateOrderDTO = {
      foodItems: req.body.foodItems,
      user: req.user as AuthUserClaim,
    };

    const result = await orderCreateService.createOrder(params);
    Helper.formatAPIResponse(res, 'Order enqueue for processing', result);
  } catch (error) {
    next(error);
  }
};

export const fetchOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, lastId } = req.query;

    const getOrderHistoryDTO: FetchOrderssDTO = {
      user: req.user as AuthUserClaim,
      limit: limit ? parseInt(limit as string, 10) : 10,
      lastId: (lastId as string) || undefined,
    };
    const result = await orderReadService.getOrderHistory(getOrderHistoryDTO);
    Helper.formatAPIResponse(res, 'Order data fetched', result);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await orderCreateService.updateOrderStatus({
      newStatus: req.body.newStatus,
      orderId: req.body.orderId,
    });
    Helper.formatAPIResponse(res, 'Order status updated', result);
  } catch (error) {
    next(error);
  }
};
