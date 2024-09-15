import mongoose from 'mongoose';
import {
  CompanyRepository,
  FoodMenuRepository,
  IndividualRepository,
  OrderRepository,
} from '../repository';
import { UserAccountType } from '../typings/user';
import { BadRequestError, Helper, logger } from '../utils';
import { CreateOrderDTO } from './dtos/request.dto';
import { OrderStatus } from '../infrastructure';

export class OrderCreateService {
  constructor(
    private readonly _orderRepo: OrderRepository,
    private readonly _foodMenuRepo: FoodMenuRepository,
    private readonly _individualRepo: IndividualRepository,
    private readonly _companyRepo: CompanyRepository,
    private readonly _logger: typeof logger,
  ) {}

  async createOrder(params: CreateOrderDTO) {
    const session = await mongoose.startSession();
    try {
      const { foodItems, user } = params;
      Helper.checkUserType(user.account_type, [UserAccountType.INDIVIDUAL], 'create an order');
      if (!user.sub || !mongoose.Types.ObjectId.isValid(user.sub)) {
        throw new BadRequestError('Invalid customer ID');
      }

      if (!foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
        throw new BadRequestError('At least one food item must be provided');
      }

      // Step 2: Calculate the total amount
      let totalAmount: any = 0;

      await session.startTransaction();
      for (const item of foodItems) {
        if (!item.food_menu || !mongoose.Types.ObjectId.isValid(item.food_menu)) {
          throw new BadRequestError('Invalid food menu ID');
        }

        // Find the food menu item from the database
        const foodMenu = await this._foodMenuRepo.getOne(item.food_menu);
        if (!foodMenu) {
          throw new BadRequestError(`Food menu item not found for ID: ${item.food_menu}`);
        }

        // Calculate the price for the item
        const itemTotal = parseFloat(foodMenu.price.toString()) * item.quantity;
        totalAmount += itemTotal;
      }

      totalAmount = new mongoose.Types.Decimal128(totalAmount.toString());

      const result = await this._orderRepo.create(user.sub, foodItems, totalAmount, session);

      const data = await this._individualRepo.getCompanyId(user.sub);
      const companyInfo = await this._companyRepo.getCompanyById(
        data?.company as mongoose.Types.ObjectId,
      );

      // Update by deducting the spend balances for both company alone for now
      await this._companyRepo.decreaseSpendBalance(
        {
          companyUserId: companyInfo?.user as mongoose.Types.ObjectId,
          spend_balance: totalAmount,
        },
        session,
      );
      await session.commitTransaction();
      return result._id;
    } catch (error) {
      this._logger.error('Error creating order', { error });
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async updateOrderStatus(params: { orderId: mongoose.Types.ObjectId; newStatus: OrderStatus }) {
    try {
      return await this._orderRepo.updateOrderStatus(params.orderId, params.newStatus);
      // Send emails for order status
    } catch (error) {
      throw error;
    }
  }
}
