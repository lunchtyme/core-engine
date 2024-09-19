import mongoose, { Schema } from 'mongoose';

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      // required: true,
    },
    max_spend_amount_per_employee: {
      type: Schema.Types.Decimal128,
      // required: true,
      default: 0.0,
    },
    spend_balance: {
      type: Schema.Types.Decimal128,
      default: 0.0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

companySchema.index({ email: 'text', website: 1, name: 'text' }, { background: true });

export const CompanyModel = mongoose.model('Company', companySchema);
