"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMealSuggestionsQuery = void 0;
const getMealSuggestionsQuery = () => {
    const aggregationPipeline = [
        {
            $match: {}, // You can add filters here, if necessary
        },
        {
            $project: {
                name: 1,
                description: 1,
                reason_for_suggestion: 1,
                user: 1,
                createdAt: 1,
            },
        },
    ];
    return aggregationPipeline;
};
exports.getMealSuggestionsQuery = getMealSuggestionsQuery;
