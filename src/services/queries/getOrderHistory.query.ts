import mongoose from 'mongoose';

// @ts-ignore
export const getOrderHistoryQuery = (filter: { employeeId?: mongoose.Types.ObjectId }) => {
  const { employeeId } = filter;
  const aggregationPipeline: any[] = [];
  console.log(employeeId);

  // Lookup to fetch employee details based on the user field
  aggregationPipeline.push({
    $lookup: {
      from: 'individuals',
      localField: 'customer_id',
      foreignField: 'user',
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
        customer_id: new mongoose.Types.ObjectId(employeeId),
      },
    });
  }

  aggregationPipeline.push({
    $project: {
      _id: 1,
      total_amount: { $toString: '$total_amount' },
      status: 1,
      created_at: 1,
      order_date: 1,
      'employee_details.first_name': 1,
      'employee_details.last_name': 1,
    },
  });

  return aggregationPipeline;
};
