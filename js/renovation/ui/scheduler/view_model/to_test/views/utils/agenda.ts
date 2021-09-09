import { setOptionHour } from './base';

export const calculateStartViewDate = (currentDate: Date, startDayHour: number): Date => {
  const validCurrentDate = new Date(currentDate);

  return setOptionHour(validCurrentDate, startDayHour);
};
