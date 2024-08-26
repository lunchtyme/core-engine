import mongoose, { Schema } from 'mongoose';

/**
 * Enum for user account types.
 */
export enum UserAccountType {
  /**
   * Company account type.
   */
  COMPANY = 'COMPANY',
  /**
   * Individual account type.
   */
  INDIVIDUAL = 'INDIVIDUAL',
  /**
   * Administrative account type.
   */
  ADMIN = 'ADMIN',
  /**
   * Internal staff or employee account type.
   */
  // STAFF = 'STAFF',
}

/**
 * Enum for user account states.
 */
export enum UserAccountState {
  /**
   * Account is active and fully functional.
   */
  ACTIVE = 'ACTIVE',
  /**
   * Account is temporarily blocked or restricted.
   */
  SUSPENDED = 'SUSPENDED',
  /**
   * Account is no longer active or has been deactivated.
   */
  INACTIVE = 'INACTIVE',
  /**
   * Account is locked due to security concerns or excessive login attempts.
   */
  LOCKED = 'LOCKED',
}

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
      required: true,
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

userSchema.virtual('account_details', {
  ref: (doc: any) => doc.account_type,
  localField: 'account_ref',
  foreignField: '_id',
  justOne: true,
});

export const UserModel = mongoose.model('User', userSchema);
