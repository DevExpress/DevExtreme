import { ViewDataProviderType } from '../../../workspaces/types';

const HOUR_IN_MS = 1000 * 60 * 60;

const getSkippedHoursInRange = (
  startDate: Date,
  endDate: Date,
  viewDataProvider: ViewDataProviderType,
): number => {
  let result = 0;

  const currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() + 1);
  currentDate.setHours(0, 0, 0, 0);

  const endDateWithStartHour = new Date(endDate);
  endDateWithStartHour.setHours(0, 0, 0, 0);

  const { startDayHour, endDayHour } = viewDataProvider.getViewOptions();
  const dayHours = endDayHour - startDayHour;

  while (currentDate < endDateWithStartHour) {
    if (viewDataProvider.isSkippedDate(currentDate)) {
      result += dayHours;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const startDateHours = startDate.getHours();
  const endDateHours = endDate.getHours() + Math.ceil(endDate.getTime() % HOUR_IN_MS);

  if (viewDataProvider.isSkippedDate(startDate)) {
    if (startDateHours < startDayHour) {
      result += dayHours;
    } else if (startDateHours < endDayHour) {
      result += endDayHour - startDateHours;
    }
  }

  if (viewDataProvider.isSkippedDate(endDate)) {
    if (endDateHours > endDayHour) {
      result += dayHours;
    } else if (endDateHours > startDayHour) {
      result += endDateHours - startDayHour;
    }
  }

  return result;
};

export default getSkippedHoursInRange;
