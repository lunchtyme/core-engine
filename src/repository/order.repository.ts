import mongoose from 'mongoose';
import { IndividualModel, OrderDocument, OrderModel, OrderStatus } from '../infrastructure';
import { BaseRepository } from './base.repository';
import logger from '../utils/logger';

export class OrderRepository extends BaseRepository<OrderDocument> {
  constructor() {
    super(OrderModel);
  }

  async create(
    customerId: string,
    foodItems: { food_menu: mongoose.Types.ObjectId; quantity: number }[],
    totalAmount: mongoose.Types.Decimal128,
    orderId: string,
    session?: mongoose.ClientSession | null,
  ) {
    try {
      const result = new OrderModel({
        customer_id: customerId,
        food_items: foodItems,
        order_id: orderId,
        total_amount: totalAmount,
      });

      return await result.save({ session });
    } catch (error) {
      throw error;
    }
  }

  // get all orders
  async getAllOrderCount() {
    try {
      return await OrderModel.countDocuments().exec();
    } catch (error) {
      throw error;
    }
  }

  // Get all employee order count
  async countEmployeeOrders(employeeId: mongoose.Types.ObjectId) {
    try {
      return await OrderModel.countDocuments({ customer_id: employeeId }).exec();
    } catch (error) {
      throw error;
    }
  }

  // Get company employees orders count
  async countCompanyEmployeeOrders(companyId: mongoose.Types.ObjectId) {
    try {
      // Get all employees belonging to this company
      const employeeIds = await IndividualModel.distinct('_id', { company: companyId });
      return await OrderModel.countDocuments({ user: { $in: employeeIds } }).exec(); // Company: Orders where user is one of the employees
    } catch (error) {
      throw error;
    }
  }

  async updateOrderStatus(orderId: mongoose.Types.ObjectId, newStatus: OrderStatus) {
    try {
      const order = await OrderModel.findByIdAndUpdate(
        orderId,
        { status: newStatus },
        { new: true }, // Return the updated document
      );

      if (!order) {
        throw new Error('Order not found');
      }

      logger.info('Order status updated successfully');
      return order;
    } catch (error) {
      logger.error('Error updating order status availability', { error, orderId });
      throw error;
    }
  }
}
