import mongoose, { Schema } from 'mongoose';

/**
 * Enum for invitation statuses.
 */
export enum InvitationStatus {
  /**
   * Invitation is pending and waiting for a response.
   */
  PENDING = 'PENDING',
  /**
   * Invitation has been accepted by the recipient.
   */
  ACCEPTED = 'ACCEPTED',
  /**
   * Invitation has been declined by the recipient.
   */
  DECLINED = 'DECLINED',
  /**
   * Invitation has expired and is no longer valid.
   */
  EXPIRED = 'EXPIRED',
  /**
   * Invitation has been abandoned and is no longer valid.
   */
  ABANDONED = 'ABANDONED',
}

const invitationSchema = new Schema(
  {
    company_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'company',
    },
    invitee_email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        InvitationStatus.PENDING,
        InvitationStatus.ACCEPTED,
        InvitationStatus.DECLINED,
        InvitationStatus.EXPIRED,
        InvitationStatus.ABANDONED,
      ],
      default: InvitationStatus.PENDING,
    },
    invitation_token: {
      type: String,
      required: true,
      unique: true,
    },
    expires_at: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const InvitationModel = mongoose.model('Invitation', invitationSchema);
