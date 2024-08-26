import mongoose, { Schema } from 'mongoose';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

const orderSchema = new Schema(
  {
    customer_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    food_items: [
      {
        food_menu: {
          type: Schema.Types.ObjectId,
          ref: 'FoodMenu', // Reference to the FoodMenu model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    total_amount: {
      type: Schema.Types.Decimal128,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      enum: [
        OrderStatus.PENDING,
        OrderStatus.DELIVERED,
        OrderStatus.CONFIRMED,
        OrderStatus.CANCELLED,
      ],
      default: OrderStatus.PENDING,
    },
    order_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

orderSchema.index({ status: 1, order_date: 1 }, { background: true });

export const OrderModel = mongoose.model('Order', orderSchema);
