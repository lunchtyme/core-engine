import mongoose, { Schema } from 'mongoose';

const foodMenuSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Schema.Types.Decimal128,
      required: true,
      default: 0.0,
    },
    category: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    added_by: {
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

foodMenuSchema.index({ name: 'text', description: 'text' }, { background: true });

export const FoodMenuModel = mongoose.model('FoodMenu', foodMenuSchema);
