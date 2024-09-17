import mongoose from 'mongoose';
import { CreateAddressDTO } from '../services/dtos/request.dto';
import { AddressModel } from '../infrastructure';
import logger from '../utils/logger';

export class AddressRepository {
  async create(params: CreateAddressDTO, session?: mongoose.ClientSession | null) {
    try {
      const result = new AddressModel(params);
      return await result.save({ session });
    } catch (error) {
      logger.error('Error storing address to db:', error);
      throw error;
    }
  }

  async checkIfExist(user_id: mongoose.Types.ObjectId): Promise<boolean> {
    try {
      const address = await AddressModel.exists({ user: user_id }).exec();
      return !!address;
    } catch (error) {
      logger.error('Error checking user exist from db:', error);
      throw error;
    }
  }
}
