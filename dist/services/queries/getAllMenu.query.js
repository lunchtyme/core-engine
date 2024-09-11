"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFoodMenuQuery = void 0;
const getFoodMenuQuery = (filter) => {
    const { query, category } = filter;
    const aggregationPipeline = [];
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
exports.getFoodMenuQuery = getFoodMenuQuery;
