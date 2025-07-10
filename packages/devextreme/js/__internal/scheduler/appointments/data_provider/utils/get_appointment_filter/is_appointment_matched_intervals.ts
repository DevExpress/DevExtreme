import type { DateInterval } from '../type';

export const isAppointmentMatchedIntervals = (
  appointment: {
    startDate: Date;
    endDate: Date;
  },
  intervals: DateInterval[],
): boolean => {
  const { startDate, endDate } = appointment;
  let i = 0;

  for (; i < intervals.length; i += 1) {
    if (startDate < intervals[i].max) {
      break;
    }
  }

  return i < intervals.length && (startDate >= intervals[i].min || endDate > intervals[i].min);
};
