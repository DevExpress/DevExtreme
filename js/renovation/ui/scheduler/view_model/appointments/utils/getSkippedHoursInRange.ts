import { ViewDataProviderType } from '../../../workspaces/types';

const getSkippedHoursInRange = (
  startDate: Date,
  endDate: Date,
  viewDataProvider: ViewDataProviderType,
): number => {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const hoursInDay = 24;
  const allDayIntervalDuration = hoursInDay * 1000 * 3600;

  let excludedHours = 0;

  for (let time = startTime; time <= endTime; time += allDayIntervalDuration) {
    const checkDate = new Date(time);
    if (viewDataProvider.isSkippedDate(checkDate)) {
      excludedHours += hoursInDay;
    }
  }

  return excludedHours;
};

export default getSkippedHoursInRange;
