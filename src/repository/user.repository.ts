import mongoose from 'mongoose';
import { UserModel } from '../infrastructure';
import { CreateAccountDTO } from '../services/dtos/request.dto';

export type GetUserParams = {
  identifier: 'email' | 'id' | 'phone_number';
  value: string | mongoose.Types.ObjectId;
};

export class UserRepository {
  async create(params: CreateAccountDTO, session?: mongoose.ClientSession | null) {
    try {
      const result = new UserModel(params);
      return await result.save({ session });
    } catch (error) {
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

      return await UserModel.findOne(getUserFilterOptions).populate('account_details').exec();
    } catch (error) {
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
      throw error;
    }
  }
}
