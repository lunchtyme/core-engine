import mongoose from 'mongoose';
import { CreateAccountDTO } from '../services/dtos/request.dto';
import { BaseRepository } from './base.repository';
import { UserModel, UserModelDocument } from '../infrastructure';
import { UserAccountType } from '../infrastructure/database/models/enums';
import logger from '../utils/logger';

export type GetUserParams = {
  identifier: 'email' | 'id' | 'phone_number';
  value: string | mongoose.Types.ObjectId;
};

export class UserRepository extends BaseRepository<UserModelDocument> {
  constructor() {
    super(UserModel);
  }

  async create(params: CreateAccountDTO, session?: mongoose.ClientSession | null) {
    try {
      const result = new UserModel(params);
      return await result.save({ session });
    } catch (error) {
      logger.error('Error storing user to db:', error);
      throw error;
    }
  }

  async getUser(params: GetUserParams) {
    try {
      const { identifier, value } = params;
      const getUserFilterOptions =
        identifier === 'email'
          ? { email: value }
          : identifier === 'id'
          ? {
              _id: mongoose.Types.ObjectId.isValid(value)
                ? new mongoose.Types.ObjectId(value)
                : value,
            }
          : identifier === 'phone_number'
          ? { phone_number: value }
          : {};

      return await UserModel.findOne(getUserFilterOptions).exec();
    } catch (error) {
      logger.error('Error getting user data from db:', error);
      throw error;
    }
  }

  async getUserWithDetails(params: GetUserParams) {
    try {
      const { identifier, value } = params;
      const getUserFilterOptions =
        identifier === 'email'
          ? { email: value }
          : identifier === 'id'
          ? {
              _id: mongoose.Types.ObjectId.isValid(value)
                ? new mongoose.Types.ObjectId(value)
                : value,
            }
          : identifier === 'phone_number'
          ? { phone_number: value }
          : {};

      return await UserModel.findOne(getUserFilterOptions)
        .select('-password')
        .populate('account_details')
        .exec();
    } catch (error) {
      logger.error('Error getting user data from db:', error);
      throw error;
    }
  }

  async checkUserExist(params: GetUserParams): Promise<boolean> {
    try {
      const { identifier, value } = params;
      let getUserFilterOptions =
        identifier === 'email'
          ? { email: value }
          : {
              _id: mongoose.Types.ObjectId.isValid(value)
                ? new mongoose.Types.ObjectId(value)
                : value,
            };

      const user = await UserModel.exists(getUserFilterOptions).exec();
      return !!user;
    } catch (error) {
      logger.error('Error checking user exist from db:', error);
      throw error;
    }
  }

  // Admin: Count all non-admin users
  async getAllUserCount() {
    try {
      return await UserModel.countDocuments({
        account_type: { $ne: UserAccountType.ADMIN },
      }).exec();
    } catch (error) {
      throw error;
    }
  }

  // Admin: Count total employees
  async getAllEmployeeCount() {
    try {
      return await UserModel.countDocuments({ account_type: UserAccountType.INDIVIDUAL }).exec();
    } catch (error) {
      throw error;
    }
  }

  // Admin: Count total companies
  async getAllCompanyCount() {
    try {
      return await UserModel.countDocuments({ account_type: UserAccountType.COMPANY }).exec();
    } catch (error) {
      throw error;
    }
  }
}
