import mongoose from 'mongoose';
import { BillingDocument, BillingModel, BillingStatus, IndividualModel } from '../infrastructure';
import { Helper, logger } from '../utils';
import { BaseRepository } from './base.repository';
import { SaveBillingDTO } from '../services';

export class BillingRepository extends BaseRepository<BillingDocument> {
  constructor() {
    super(BillingModel);
  }
  async create(params: SaveBillingDTO, session?: mongoose.ClientSession | null) {
    try {
      const { user, amount, reference_code, type, email, status } = params;
      const result = new BillingModel({
        user,
        reference_code,
        email,
        type,
        amount: new mongoose.Types.Decimal128(amount),
        status: status && status,
      });

      return await result.save({ session });
    } catch (error) {
      logger.error('Error saving billing info:', { error, params });
      throw error;
    }
  }

  async generateUniqueRefCode(length = 8) {
    let code;
    let isUnique = false;
    while (!isUnique) {
      code = Helper.generateRandomToken(length);
      const existingRefCode = await BillingModel.findOne({ reference_code: code }).exec();
      if (!existingRefCode) {
        isUnique = true;
      }
    }
    return code as string;
  }

  async updateBillingStatus(
    params: {
      user: mongoose.Types.ObjectId;
      reference: string;
      status: BillingStatus;
    },
    session?: mongoose.ClientSession | null,
  ) {
    try {
      const { user, status, reference } = params;
      const updateQuery = { status };
      const options: any = {};
      if (session) {
        options.session = session;
      }
      const result = await BillingModel.updateOne(
        { user, reference_code: reference },
        updateQuery,
        options,
      );
      return result.acknowledged;
    } catch (error) {
      logger.error('Error updating billing status:', { error, params });
      throw error;
    }
  }

  async getOne(
    params: { user: mongoose.Types.ObjectId; reference: string; status: BillingStatus },
    session?: mongoose.ClientSession | null,
  ) {
    try {
      const { user, status, reference } = params;
      const sess = session ?? null;
      return await BillingModel.findOne({ user, status, reference_code: reference })
        .session(sess)
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async getTotalAmountSpentByMe(companyUserId: mongoose.Types.ObjectId) {
    try {
      const totalSpent = await BillingModel.aggregate([
        { $match: { user: companyUserId, status: BillingStatus.PAID } },
        { $group: { _id: null, totalAmount: { $sum: { $toDecimal: '$amount' } } } },
        { $project: { _id: 0, totalAmount: { $toString: '$totalAmount' } } },
      ]);

      return totalSpent.length > 0 ? totalSpent[0].totalAmount : '0'; // Return the total spent as a string
    } catch (error) {
      throw error;
    }
  }
}
