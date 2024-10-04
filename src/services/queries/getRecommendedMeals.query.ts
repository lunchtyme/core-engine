import { FoodCategory } from '../../infrastructure';
import mongoose from 'mongoose';

export const getRecommendedMealsQuery = async (filter: {
  query?: string;
  category?: FoodCategory;
  userId?: mongoose.Types.ObjectId;
  risk_health?: boolean;
}) => {
  const { query, category, userId, risk_health } = filter;
  const aggregationPipeline: any[] = [];

  if (!risk_health) {
    // If user ID is provided, we fetch their health info first
    if (userId) {
      const userHealthInfo = await mongoose.model('HealthInfo').findOne({ user: userId });

      if (userHealthInfo) {
        // Extract health preferences (allergies, medical conditions, and dietary preferences)
        const {
          allergies = [],
          medical_conditions = [],
          dietary_preferences = [],
        } = userHealthInfo;
        const conditions: any[] = [];

        // Match menus suitable for user's medical conditions
        if (medical_conditions.length > 0) {
          conditions.push({
            suitable_for_conditions: { $in: medical_conditions }, // Match menus suitable for user's conditions
          });
        }

        // Match menus suitable for user's dietary preferences
        if (dietary_preferences.length > 0) {
          conditions.push({
            suitable_for_diet: { $in: dietary_preferences }, // Match menus suitable for user's dietary preferences
          });
        }

        // Exclude menus containing allergens
        if (allergies.length > 0) {
          conditions.push({
            allergens: { $nin: allergies }, // Exclude menus containing user allergens
          });
        }

        // Apply the combined conditions in $and
        if (conditions.length > 0) {
          aggregationPipeline.push({
            $match: {
              $and: conditions,
            },
          });
        }
      }
    }
  }

  // Apply text search query if available
  if (query) {
    aggregationPipeline.push({
      $match: { $text: { $search: query } },
    });
    aggregationPipeline.push({
      $addFields: { score: { $meta: 'textScore' } },
    });
    aggregationPipeline.push({
      $sort: { score: { $meta: 'textScore' } },
    });
  }

  // Apply category filter if available
  if (category) {
    aggregationPipeline.push({
      $match: { categories: { $in: [category] } },
    });
  }

  // Convert price to string
  aggregationPipeline.push({
    $addFields: {
      price: { $toString: '$price' },
    },
  });

  return aggregationPipeline;
};
