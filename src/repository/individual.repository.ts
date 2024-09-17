import mongoose from 'mongoose';
import { CreateIndividualAccountDTO } from '../services/dtos/request.dto';
import { IndividualModel } from '../infrastructure';
import { getEmployeesLunchTime2hoursFromNowQuery } from '../services/queries/getEmployeeLunchTime.query';
import logger from '../utils/logger';

export class IndividualRepository {
  async create(params: CreateIndividualAccountDTO, session?: mongoose.ClientSession | null) {
    try {
      const result = new IndividualModel(params);
      return await result.save({ session });
    } catch (error) {
      logger.error('Error storing individual user to db:', error);
      throw error;
    }
  }

  async update(
    params: Partial<CreateIndividualAccountDTO>,
    session?: mongoose.ClientSession | null,
  ) {
    try {
      const updateQuery = { ...params };
      const options: any = {};
      if (session) {
        options.session = session;
      }
      const result = await IndividualModel.updateOne({ user: params.user }, updateQuery, options);
      return result.acknowledged;
    } catch (error) {
      logger.error('Error updating individual user in db:', error);
      throw error;
    }
  }

  async getSpendBalance(userId: mongoose.Types.ObjectId) {
    try {
      const result = await IndividualModel.findOne({ user: userId }, 'spend_balance').lean().exec();
      return result?.spend_balance ? result.spend_balance.toString() : '0.00';
    } catch (error) {
      logger.error('Error fetching employee spend balance from db:', { error, userId });
      throw error;
    }
  }

  async countCompanyEmployees(companyId: mongoose.Types.ObjectId) {
    try {
      // Get all employees belonging to this company
      return await IndividualModel.countDocuments({ company: { $in: companyId } }).exec();
    } catch (error) {
      throw error;
    }
  }

  async topupSpendBalance(
    params: { userId: mongoose.Types.ObjectId; amount: mongoose.Types.Decimal128 },
    session?: mongoose.ClientSession | null,
  ) {
    const { userId, amount } = params;
    const updateQuery = { $inc: { spend_balance: amount } };
    const options: any = {};
    if (session) {
      options.session = session;
    }
    try {
      const result = await IndividualModel.updateOne({ user: userId }, updateQuery, options);
      return result.acknowledged;
    } catch (error) {
      logger.error('Error incrementing employee spend balance in db:', { error, params });
      throw error;
    }
  }

  async decreaseSpendBalance(
    params: { userId: mongoose.Types.ObjectId; amount: mongoose.Types.Decimal128 },
    session?: mongoose.ClientSession | null,
  ) {
    const { userId, amount } = params;
    const updateQuery = { $inc: { spend_balance: `-${amount}` } };
    const options: any = {};
    if (session) {
      options.session = session;
    }
    try {
      const result = await IndividualModel.updateOne({ user: userId }, updateQuery, options);
      return result.acknowledged;
    } catch (error: any) {
      logger.error('Error decreasing employee spend balance in db:', { error, params });
      throw error;
    }
  }

  async getOneByUserId(userId: mongoose.Types.ObjectId) {
    try {
      return await IndividualModel.findOne({ user: userId }).exec();
    } catch (error) {
      throw error;
    }
  }

  async getLunchTimeRecords() {
    try {
      return await IndividualModel.find({}).populate('user').exec();
    } catch (error) {
      logger.error('Error fetching employee lunch times', { error });
      throw error;
    }
  }
}
