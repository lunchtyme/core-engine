import mongoose, { Schema } from 'mongoose';

const individualSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    spend_balance: {
      type: Schema.Types.Decimal128,
      default: 0.0,
    },
    lunch_time: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

individualSchema.index(
  { email: 'text', first_name: 'text', last_name: 'text' },
  { background: true },
);

export const IndividualModel = mongoose.model('Individual', individualSchema);
