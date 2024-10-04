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
    food_image: {
      type: String,
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

    // New fields to store health-related information
    health_benefits: {
      type: [String], // List of health benefits like "low sodium", "high protein"
      default: [],
    },
    allergens: {
      type: [String], // List of possible allergens like "peanuts", "gluten"
      default: [],
    },
    suitable_for_conditions: {
      type: [String], // List of medical conditions this food is suitable for
      default: [],
    },
    suitable_for_diet: {
      type: [String], // List of dietary preferences like "Vegan", "Gluten-Free"
      default: [],
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
  food_image: string;
  health_benefits: string[];
  allergens: string[];
  suitable_for_conditions: string[];
  suitable_for_diet: string[];
  created_at?: Date;
  updated_at?: Date;
}

foodMenuSchema.pre('save', function (next) {
  this.health_benefits = this.health_benefits.map((value) =>
    value.toLowerCase().replace(/\s+/g, '_'),
  );
  this.allergens = this.allergens.map((value) => value.toLowerCase().replace(/\s+/g, '_'));
  this.suitable_for_conditions = this.suitable_for_conditions.map((value) =>
    value.toLowerCase().replace(/\s+/g, '_'),
  );
  this.suitable_for_diet = this.suitable_for_diet.map((value) =>
    value.toLowerCase().replace(/\s+/g, '_'),
  );
  next();
});

foodMenuSchema.index({ name: 'text', description: 'text' }, { background: true });
foodMenuSchema.index({ allergens: 1 }, { background: true });
foodMenuSchema.index({ suitable_for_conditions: 1 }, { background: true });
foodMenuSchema.index({ suitable_for_diet: 1 }, { background: true });

export interface FoodMenuDocument extends FoodMenu, Document {}
export const FoodMenuModel = mongoose.model<FoodMenuDocument>('FoodMenu', foodMenuSchema);
