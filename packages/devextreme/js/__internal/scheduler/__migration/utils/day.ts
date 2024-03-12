import { getViewStartByOptions, setOptionHour } from './base';

export const calculateStartViewDate = (
  currentDate: Date,
  startDayHour: number,
  startDate: Date | undefined,
  intervalDuration: number,
): Date => {
  const firstViewDate = getViewStartByOptions(
    startDate,
    currentDate,
    intervalDuration,
    startDate,
  );

  return setOptionHour(firstViewDate, startDayHour);
};
