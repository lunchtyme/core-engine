import moment from 'moment-timezone';

export const getEmployeesLunchTime2hoursFromNowQuery = () => {
  const nowUtc = moment.utc();
  const targetUtc = nowUtc.clone().add(2, 'hours').toDate();
  const bufferMinutes = 5;
  const startUtc = moment.utc(targetUtc).subtract(bufferMinutes, 'minutes').toDate();
  const endUtc = moment.utc(targetUtc).add(bufferMinutes, 'minutes').toDate();

  const aggregationPipeline = [
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user_info',
      },
    },
    { $unwind: '$user_info' },
    {
      $addFields: {
        lunch_time_parsed: {
          $dateFromString: {
            dateString: {
              $concat: [
                { $substr: ['$lunch_time', 0, 5] },
                ' ',
                { $cond: [{ $gte: [{ $hour: '$lunch_time' }, 12] }, 'PM', 'AM'] },
              ],
            },
            format: '%H:%M %p',
            timezone: '$user_info.time_zone',
          },
        },
        start_time_in_user_timezone: {
          $dateFromParts: {
            year: { $year: startUtc },
            month: { $month: startUtc },
            day: { $dayOfMonth: startUtc },
            hour: { $hour: startUtc },
            minute: { $minute: startUtc },
            timezone: '$user_info.time_zone',
          },
        },
        end_time_in_user_timezone: {
          $dateFromParts: {
            year: { $year: endUtc },
            month: { $month: endUtc },
            day: { $dayOfMonth: endUtc },
            hour: { $hour: endUtc },
            minute: { $minute: endUtc },
            timezone: '$user_info.time_zone',
          },
        },
      },
    },
    {
      $match: {
        $expr: {
          $and: [
            { $gte: ['$lunch_time_parsed', '$start_time_in_user_timezone'] },
            { $lte: ['$lunch_time_parsed', '$end_time_in_user_timezone'] },
          ],
        },
      },
    },
    {
      $project: {
        first_name: 1,
        last_name: 1,
        lunch_time: 1,
        'user_info.email': 1,
        'user_info.time_zone': 1,
        company: 1,
      },
    },
  ];

  return aggregationPipeline;
};
