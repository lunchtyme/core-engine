import mongoose, { Document, Schema } from 'mongoose';

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
    order_id: { type: String, required: true },
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

interface OrderItem {
  food_menu: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

interface Order {
  customer_id: mongoose.Schema.Types.ObjectId;
  food_items: OrderItem[];
  total_amount: mongoose.Types.Decimal128;
  order_id: string;
  status: OrderStatus;
  order_date: Date;
  createdAt?: Date; // Optional, based on timestamps setting
  updatedAt?: Date; // Optional, based on timestamps setting
}

orderSchema.index({ status: 1, order_date: 1 }, { background: true });

export interface OrderDocument extends Order, Document {}
export const OrderModel = mongoose.model<OrderDocument>('Order', orderSchema);
