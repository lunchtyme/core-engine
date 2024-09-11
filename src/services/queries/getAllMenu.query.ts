import { FoodCategory } from '../../infrastructure';

export const getFoodMenuQuery = (filter: { query?: string; category?: FoodCategory }) => {
  const { query, category } = filter;
  const aggregationPipeline: any[] = [];

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

  if (category) {
    aggregationPipeline.push({
      $match: { categories: { $in: [category] } },
    });
  }

  aggregationPipeline.push({
    $addFields: {
      price: { $toString: '$price' },
    },
  });

  return aggregationPipeline;
};
