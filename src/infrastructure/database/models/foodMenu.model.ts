import mongoose, { Document, Schema } from 'mongoose';

export enum FoodCategory {
  APPETIZER = 'Appetizer',
  MAIN_COURSE = 'Main Course',
  DESSERT = 'Dessert',
  BEVERAGE = 'Beverage',
  SALAD = 'Salad',
  SOUP = 'Soup',
  PASTA = 'Pasta',
  PIZZA = 'Pizza',
  SEAFOOD = 'Seafood',
  VEGETARIAN = 'Vegetarian',
  VEGAN = 'Vegan',
  GLUTEN_FREE = 'Gluten-Free',
  SANDWICH = 'Sandwich',
  GRILL = 'Grill',
  STEAK = 'Steak',
  BURGER = 'Burger',
  SIDES = 'Sides',
  BREAKFAST = 'Breakfast',
  BRUNCH = 'Brunch',
  SMOOTHIE = 'Smoothie',
  COFFEE = 'Coffee',
  TEA = 'Tea',
  JUICE = 'Juice',
  SNACK = 'Snack',
  SPECIALS = 'Specials',
}

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
    categories: {
      type: [String],
      enum: Object.values(FoodCategory),
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

export interface FoodMenu {
  name: string;
  description: string;
  price: mongoose.Types.Decimal128;
  categories: FoodCategory[];
  available: boolean;
  added_by: mongoose.Types.ObjectId;
  created_at?: Date;
  updated_at?: Date;
}

foodMenuSchema.index({ name: 'text', description: 'text' }, { background: true });
export interface FoodMenuDocument extends FoodMenu, Document {}
export const FoodMenuModel = mongoose.model<FoodMenuDocument>('FoodMenu', foodMenuSchema);
