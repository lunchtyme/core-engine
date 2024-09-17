import mongoose, { Document, Schema } from 'mongoose';
import { UserAccountState, UserAccountType } from './enums';

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    account_type: {
      type: String,
      enum: [UserAccountType.ADMIN, UserAccountType.COMPANY, UserAccountType.INDIVIDUAL],
      required: true,
    },
    account_ref: {
      type: Schema.Types.ObjectId,
      refPath: 'account_type', // Dynamically reference based on the account type
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    account_state: {
      type: String,
      enum: [
        UserAccountState.ACTIVE,
        UserAccountState.LOCKED,
        UserAccountState.INACTIVE,
        UserAccountState.SUSPENDED,
      ],
      default: UserAccountState.ACTIVE,
      required: true,
    },
    dial_code: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    time_zone: {
      type: String,
      required: true,
    },
    has_completed_onboarding: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.index(
  { email: 1, account_ref: 1, account_state: 1, account_type: 1 },
  { background: true },
);
userSchema.index(
  {
    time_zone: 1,
  },
  { background: true },
);

userSchema.virtual('account_details', {
  ref: (doc: any) => doc.account_type,
  localField: 'account_ref',
  foreignField: '_id',
  justOne: true,
});

export interface IUser {
  email: string;
  password: string;
  account_type: UserAccountType;
  account_ref: mongoose.Types.ObjectId;
  email_verified: boolean;
  verified: boolean;
  account_state: UserAccountState;
  dial_code: string;
  phone_number: string;
  time_zone: string;
  has_completed_onboarding: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserModelDocument extends IUser, Document {}
export const UserModel = mongoose.model<UserModelDocument>('User', userSchema);
