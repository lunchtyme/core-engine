import moment from 'moment-timezone';

export const getEmployeesLunchTime2hoursFromNowQuery = () => {
  // Get current UTC time and calculate the target time 2 hours from now
  const nowUtc = moment.utc();
  const targetUtc = nowUtc.clone().add(2, 'hours').toDate();

  // Adjust for a 5-minute buffer
  const bufferMinutes = 5;
  const startUtc = moment.utc(targetUtc).subtract(bufferMinutes, 'minutes').toDate();
  const endUtc = moment.utc(targetUtc).add(bufferMinutes, 'minutes').toDate();

  const aggregationPipeline: any[] = [
    {
      $lookup: {
        from: 'users', // Assuming the users collection is named 'users'
        localField: 'user',
        foreignField: '_id',
        as: 'user_info',
      },
    },
    { $unwind: '$user_info' }, // Unwind the user_info array to access individual fields
    {
      $addFields: {
        // Parsing the lunch_time string (e.g., "15:00 PM") into hour and minute
        lunch_hour: {
          $toInt: {
            $arrayElemAt: [
              { $split: [{ $arrayElemAt: [{ $split: ['$lunch_time', ' '] }, 0] }, ':'] },
              0,
            ],
          },
        },
        lunch_minute: {
          $toInt: {
            $arrayElemAt: [
              { $split: [{ $arrayElemAt: [{ $split: ['$lunch_time', ' '] }, 0] }, ':'] },
              1,
            ],
          },
        },
      },
    },
    {
      $addFields: {
        // Constructing a date using today's date and the parsed lunch_time in the user's timezone
        lunch_time_parsed: {
          $dateFromParts: {
            year: { $year: nowUtc.toDate() }, // Using today's year
            month: { $month: nowUtc.toDate() }, // Using today's month
            day: { $dayOfMonth: nowUtc.toDate() }, // Using today's day
            hour: '$lunch_hour',
            minute: '$lunch_minute',
            timezone: '$user_info.time_zone', // Using the user's timezone
          },
        },
      },
    },
    {
      $addFields: {
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
