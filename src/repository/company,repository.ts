import mongoose from 'mongoose';
import { CreateCompanyAccountDTO } from '../services/dtos/request.dto';
import { CompanyModel } from '../infrastructure';
import logger from '../utils/logger';

export class CompanyRepository {
  async create(params: CreateCompanyAccountDTO, session?: mongoose.ClientSession | null) {
    try {
      const result = new CompanyModel(params);
      return await result.save({ session });
    } catch (error) {
      logger.error('Error storing company to db:', error);
      throw error;
    }
  }

  async update(params: Partial<CreateCompanyAccountDTO>, session?: mongoose.ClientSession | null) {
    try {
      const updateQuery = { ...params };
      const options: any = {};
      if (session) {
        options.session = session;
      }
      const result = await CompanyModel.updateOne({ user: params.user }, updateQuery, options);
      return result.acknowledged;
    } catch (error) {
      logger.error('Error updating company user in db:', error);
      throw error;
    }
  }

  async getCompanyByUserId(userId: mongoose.Types.ObjectId) {
    try {
      return await CompanyModel.findOne({ user: userId }).exec();
    } catch (error) {
      throw error;
    }
  }

  async getCompanyById(companyId: mongoose.Types.ObjectId) {
    try {
      return await CompanyModel.findOne({ _id: companyId }).exec();
    } catch (error) {
      throw error;
    }
  }

  async topupSpendBalance(
    params: { companyUserId: mongoose.Types.ObjectId; spend_balance: mongoose.Types.Decimal128 },
    session?: mongoose.ClientSession | null,
  ) {
    const { companyUserId, spend_balance } = params;
    const updateQuery = { $inc: { spend_balance: spend_balance } };
    const options: any = {};
    if (session) {
      options.session = session;
    }
    try {
      const result = await CompanyModel.updateOne({ user: companyUserId }, updateQuery, options);
      return result.acknowledged;
    } catch (error) {
      logger.error('Error incrementing company spend balance in db:', { error, params });
      throw error;
    }
  }

  async decreaseSpendBalance(
    params: { companyUserId: mongoose.Types.ObjectId; spend_balance: mongoose.Types.Decimal128 },
    session?: mongoose.ClientSession | null,
  ) {
    const { companyUserId, spend_balance } = params;
    const updateQuery = { $inc: { spend_balance: `-${spend_balance}` } };
    const options: any = {};
    if (session) {
      options.session = session;
    }
    try {
      const result = await CompanyModel.updateOne({ user: companyUserId }, updateQuery, options);
      return result.acknowledged;
    } catch (error: any) {
      logger.error('Error decreasing company spend balance in db:', { error, params });
      throw error;
    }
  }

  async getSpendBalance(companyUserId: mongoose.Types.ObjectId) {
    try {
      const result = await CompanyModel.findOne({ user: companyUserId }, 'spend_balance')
        .lean()
        .exec();

      return result?.spend_balance ? result.spend_balance.toString() : '0.00';
    } catch (error) {
      logger.error('Error fetching company spend balance from db:', { error, companyUserId });
      throw error;
    }
  }
}
