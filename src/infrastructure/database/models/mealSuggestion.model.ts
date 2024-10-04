import mongoose, { Document, Schema } from 'mongoose';

const mealSuggestionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reason_for_suggestion: {
      type: String, // String for the reason why the meal is suggested
      required: false, // Optional field
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Create the MealSuggestion model
export interface MealSuggestion {
  user: Schema.Types.ObjectId;
  name: string;
  description: string;
  reason_for_suggestion?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface MealSuggestionDocument extends MealSuggestion, Document {}
export const MealSuggestionModel = mongoose.model<MealSuggestionDocument>(
  'MealSuggestion',
  mealSuggestionSchema,
);
