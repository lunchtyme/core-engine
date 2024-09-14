import { UserAccountType } from '../../typings/user';

export const getAllUserQuery = (filter: { query?: string }) => {
  const { query } = filter;
  const aggregationPipeline: any[] = [];

  // If there's a text query, match and sort by textScore
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

  // Exclude 'ADMIN' account types
  aggregationPipeline.push({
    $match: {
      account_type: { $ne: UserAccountType.ADMIN }, // Exclude Admin accounts
    },
  });

  // Add lookups for companies and individuals only (no admin lookup)
  aggregationPipeline.push(
    {
      $lookup: {
        from: 'companies',
        localField: 'account_ref',
        foreignField: '_id',
        as: 'company_account_details',
      },
    },
    {
      $lookup: {
        from: 'individuals',
        localField: 'account_ref',
        foreignField: '_id',
        as: 'individual_account_details',
      },
    },
  );

  // Merge the lookup results into a single field based on the account type
  aggregationPipeline.push({
    $addFields: {
      account_details: {
        $switch: {
          branches: [
            {
              case: { $eq: ['$account_type', UserAccountType.COMPANY] },
              then: { $arrayElemAt: ['$company_account_details', 0] },
            },
            {
              case: { $eq: ['$account_type', UserAccountType.INDIVIDUAL] },
              then: { $arrayElemAt: ['$individual_account_details', 0] },
            },
          ],
          default: null,
        },
      },
    },
  });

  // Convert price fields to strings
  aggregationPipeline.push({
    $addFields: {
      'account_details.spend_balance': { $toString: '$account_details.spend_balance' },
      'account_details.max_spend_amount_per_employee': {
        $toString: '$account_details.max_spend_amount_per_employee',
      },
    },
  });

  // Remove individual and company lookups
  aggregationPipeline.push({
    $project: {
      company_account_details: 0,
      individual_account_details: 0,
    },
  });

  // Filter out documents where account_ref is null
  aggregationPipeline.push({
    $match: {
      account_ref: { $ne: null },
      account_type: { $ne: null },
    },
  });

  return aggregationPipeline;
};
