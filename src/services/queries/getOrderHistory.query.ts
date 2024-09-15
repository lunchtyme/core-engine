import mongoose from 'mongoose';

export const getOrderHistoryQuery = (filter: { employeeId?: mongoose.Types.ObjectId }) => {
  const { employeeId } = filter;
  const aggregationPipeline: any[] = [];

  // Lookup to fetch employee details based on the user field
  aggregationPipeline.push({
    $lookup: {
      from: 'individuals',
      localField: 'customer_id',
      foreignField: '_id',
      as: 'employee_details',
    },
  });

  aggregationPipeline.push({
    $unwind: {
      path: '$employee_details',
      preserveNullAndEmptyArrays: false,
    },
  });

  if (employeeId) {
    aggregationPipeline.push({
      $match: {
        customer_id: employeeId,
      },
    });
  }

  aggregationPipeline.push({
    $project: {
      _id: 1,
      total_amount: { $toString: '$amount' },
      status: 1,
      created_at: 1,
      order_date: 1,
      'employee_details.first_name': 1,
      'company_details.last_name': 1,
    },
  });

  return aggregationPipeline;
};
