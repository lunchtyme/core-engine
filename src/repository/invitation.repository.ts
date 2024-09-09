import mongoose from 'mongoose';
import { InvitationModel, InvitationStatus } from '../infrastructure';
import { StoreInvitationDTO } from '../services/dtos/request.dto';
import { Helper } from '../utils';

export class InvitationRepository {
  async upsert(params: StoreInvitationDTO, session?: mongoose.ClientSession | null) {
    try {
      const { user, employee_work_email } = params;
      const updateFilter = { user, employee_work_email };
      const updateValues = { ...params };
      return (
        await InvitationModel.updateOne(updateFilter, updateValues, {
          upsert: true,
          session: session ?? undefined,
        }).exec()
      ).acknowledged;
    } catch (error) {
      throw error;
    }
  }

  async checkInvitationExists(params: {
    employee_work_email: string;
    user: mongoose.Types.ObjectId;
  }) {
    try {
      const { employee_work_email, user } = params;
      return await InvitationModel.exists({ employee_work_email, user }).exec();
    } catch (error) {
      throw error;
    }
  }

  async validInvitationExists(params: {
    employee_work_email: string;
    user: mongoose.Types.ObjectId;
    invitation_code?: string;
  }) {
    try {
      const { user, employee_work_email, invitation_code } = params;
      const filterOptions: any = {
        user,
        employee_work_email,
        expires_at: { $gt: new Date() },
        status: InvitationStatus.PENDING,
      };
      if (invitation_code) {
        filterOptions.invitation_token = invitation_code;
      }
      return await InvitationModel.exists(filterOptions).exec();
    } catch (error) {
      throw error;
    }
  }

  async getInvitationDetails(
    params: { employee_work_email: string; invitation_code?: string },
    session?: mongoose.ClientSession | null,
  ) {
    try {
      const { employee_work_email, invitation_code } = params;
      const filterOptions: any = {
        employee_work_email,
        expires_at: { $gt: new Date() },
        status: InvitationStatus.PENDING,
      };
      if (invitation_code) {
        filterOptions.invitation_token = invitation_code;
      }
      let currentSession = null;
      if (session != null) {
        currentSession = session;
      }
      return await InvitationModel.findOne(filterOptions)
        .session(currentSession)
        .populate('user')
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async generateUniqueInvitationToken(length = 8) {
    let token;
    let isUnique = false;
    while (!isUnique) {
      token = Helper.generateRandomToken(length);
      const existingInvitation = await InvitationModel.findOne({ invitation_token: token }).exec();
      if (!existingInvitation) {
        isUnique = true;
      }
    }
    return token as string;
  }

  async deleteInvitation(invitationId: string) {
    try {
      return (await InvitationModel.deleteOne({ _id: invitationId }).exec()).acknowledged;
    } catch (error) {
      throw error;
    }
  }

  async updateInvitationStatus(
    params: { invitationId: string; status: InvitationStatus },
    session?: mongoose.ClientSession | null,
  ) {
    try {
      const { invitationId, status } = params;
      return (
        await InvitationModel.updateOne(
          { _id: invitationId },
          { status },
          { session: session ?? undefined },
        ).exec()
      ).acknowledged;
    } catch (error) {
      throw error;
    }
  }

  async fetchMyInvitations(user: mongoose.Types.ObjectId) {
    try {
      return await InvitationModel.find({ user }).sort({ created_at: -1 }).exec();
    } catch (error) {
      throw error;
    }
  }

  async fetchInvitations() {
    try {
      return await InvitationModel.find({}).sort({ created_at: -1 }).exec();
    } catch (error) {
      throw error;
    }
  }
}
