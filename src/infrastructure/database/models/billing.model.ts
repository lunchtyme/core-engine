import mongoose, { Schema, Document } from 'mongoose';

// Define an enum for billing types
export enum BillingType {
  WALLET_TOPUP = 'wallet_topup',
  ORDER_CHARGE = 'order_charge',
}

// Define an enum for billing status
export enum BillingStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELED = 'canceled',
}

// Define the Billing interface
export interface BillingDocument extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  status: BillingStatus;
  email: string;
  reference_code: string;
  type: BillingType;
  created_at: Date;
  updated_at: Date;
}

// Define the Billing schema
const BillingSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    amount: { type: Schema.Types.Decimal128, required: true },
    status: {
      type: String,
      enum: Object.values(BillingStatus),
      default: BillingStatus.PENDING,
    },
    reference_code: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: Object.values(BillingType),
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Add a compound index for efficient filtering and sorting
BillingSchema.index({ status: 1, amount: -1, type: 1, createdAt: -1, updatedAt: -1 });

// Create the Billing model
export const BillingModel = mongoose.model<BillingDocument>('Billing', BillingSchema);
