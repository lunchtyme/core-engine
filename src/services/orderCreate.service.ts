import mongoose from 'mongoose';
import {
  CompanyRepository,
  FoodMenuRepository,
  IndividualRepository,
  OrderRepository,
} from '../repository';
import { UserAccountType } from '../typings/user';
import { BadRequestError, EMAIL_DATA, Helper, logger, SendEmailParams } from '../utils';
import { CreateOrderDTO } from './dtos/request.dto';
import { emailQueue, OrderStatus } from '../infrastructure';
import { BillingCreateService } from './billingCreate.service';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { SharedServices } from './shared.service';

dayjs.extend(calendar);

export class OrderCreateService {
  constructor(
    private readonly _orderRepo: OrderRepository,
    private readonly _foodMenuRepo: FoodMenuRepository,
    private readonly _individualRepo: IndividualRepository,
    private readonly _companyRepo: CompanyRepository,
    private readonly _billingCreateService: BillingCreateService,
    private readonly _emailQueue: typeof emailQueue,
    private readonly _sharedService: SharedServices,
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
      let items: { name: string; quantity: number; price: string }[] = [];
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

        items.push({
          name: foodMenu.name,
          quantity: item.quantity,
          price: foodMenu.price.toString(),
        });

        // Calculate the price for the item
        const itemTotal = parseFloat(foodMenu.price.toString()) * item.quantity;
        totalAmount += itemTotal;
      }

      totalAmount = parseFloat(totalAmount).toFixed(2);

      const [employeeInfo, employeeData] = await Promise.all([
        this._individualRepo.getOneByUserId(user.sub),
        this._sharedService.getUser({ identifier: 'id', value: user.sub }),
      ]);

      const companyInfo = await this._companyRepo.getCompanyById(
        employeeInfo?.company as mongoose.Types.ObjectId,
      );

      // Charge company wallet
      await this._billingCreateService.chargeCompanyWallet(
        {
          amount: totalAmount,
          companyUserId: companyInfo?.user as mongoose.Types.ObjectId,
          email: employeeData.email,
        },
        session,
      );

      // Store order deets
      const orderId = `lunch:${Helper.generateRandomToken(7)}`;
      const result = await this._orderRepo.create(
        user.sub,
        foodItems,
        new mongoose.Types.Decimal128(totalAmount),
        orderId,
        session,
      );

      await session.commitTransaction();

      // Format the time using calendar
      const formattedDate = dayjs(new Date()).calendar(null, {
        sameDay: '[today at] h:mm A',
        nextDay: '[tomorrow at] h:mm A',
        nextWeek: 'dddd [at] h:mm A',
        lastDay: '[yesterday at] h:mm A',
        lastWeek: '[last] dddd [at] h:mm A',
        sameElse: 'MMMM D, YYYY [at] h:mm A',
      });

      // Send charge email to company
      const companyEmailPayload: SendEmailParams = {
        receiver: companyInfo?.email as string,
        subject: EMAIL_DATA.subject.walletCharge,
        template: EMAIL_DATA.template.walletCharge,
        context: {
          items,
          email: companyInfo?.email,
          amount: totalAmount,
          name: companyInfo?.name,
          when: formattedDate,
        },
      };

      // Send order comfirmation email to employee
      const orderConfirmationEmailPayload: SendEmailParams = {
        receiver: employeeData?.email as string,
        subject: EMAIL_DATA.subject.orderReciept(orderId),
        template: EMAIL_DATA.template.orderReceipt,
        context: {
          items,
          orderId,
          email: employeeData?.email,
          amount: totalAmount,
          name: `${employeeInfo?.first_name} ${employeeInfo?.last_name}`,
          when: formattedDate,
        },
      };

      this._emailQueue.add('mailer', companyEmailPayload, {
        delay: 2000,
        attempts: 5,
        removeOnComplete: true,
      });

      this._emailQueue.add('mailer', orderConfirmationEmailPayload, {
        delay: 2000,
        attempts: 5,
        removeOnComplete: true,
      });

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
      const order = await this._orderRepo.updateOrderStatus(params.orderId, params.newStatus);

      const [employeeData, employeeInfo] = await Promise.all([
        this._sharedService.getUser({
          identifier: 'id',
          value: order.customer_id as any,
        }),
        this._individualRepo.getOneByUserId(order.customer_id as any),
      ]);

      // Use switch to choose right subject
      let msg = `has been updated`;
      switch (status) {
        case OrderStatus.CONFIRMED:
          msg = ' has been confirmed for delivery';
          break;
        case OrderStatus.CANCELLED:
          msg = 'has been cancelled';
          break;
        case OrderStatus.DELIVERED:
          msg = 'is on it way to you';
          break;
        default:
          msg = msg;
          break;
      }

      // Send emails for order status
      const emailPayload: SendEmailParams = {
        receiver: employeeData?.email as string,
        subject: EMAIL_DATA.subject.orderUpdated(order.order_id, order.status),
        template: EMAIL_DATA.template.orderUpdated,
        context: {
          msg,
          orderId: order.order_id,
          email: employeeData?.email,
          name: `${employeeInfo?.first_name} ${employeeInfo?.last_name}`,
          orderStatus: order.status,
        },
      };

      this._emailQueue.add('mailer', emailPayload, {
        delay: 2000,
        attempts: 5,
        removeOnComplete: true,
      });

      return order._id;
    } catch (error) {
      throw error;
    }
  }
}
