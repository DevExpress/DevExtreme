import { ViewDataProviderType } from '../../../workspaces/types';

const HOUR_IN_MS = 1000 * 60 * 60;
const HOURS_IN_DAY = 24;

const getSkippedHoursInRange = (
  startDate: Date,
  endDate: Date,
  allDay: boolean,
  viewDataProvider: ViewDataProviderType,
): number => {
  const isAllDay = allDay && !viewDataProvider.viewType.includes('timeline');
  let result = 0;

  const currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() + 1);
  currentDate.setHours(0, 0, 0, 0);

  const endDateWithStartHour = new Date(endDate);
  endDateWithStartHour.setHours(0, 0, 0, 0);

  const { startDayHour, endDayHour } = viewDataProvider.getViewOptions();
  const dayHours = isAllDay ? HOURS_IN_DAY : endDayHour - startDayHour;

  while (currentDate < endDateWithStartHour) {
    if (viewDataProvider.isSkippedDate(currentDate)) {
      result += dayHours;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const startDateHours = startDate.getHours();
  const endDateHours = endDate.getHours() + Math.ceil(endDate.getTime() % HOUR_IN_MS);

  if (viewDataProvider.isSkippedDate(startDate)) {
    if (isAllDay) {
      result += HOURS_IN_DAY;
    } else if (startDateHours < startDayHour) {
      result += dayHours;
    } else if (startDateHours < endDayHour) {
      result += endDayHour - startDateHours;
    }
  }

  if (viewDataProvider.isSkippedDate(endDate)) {
    if (isAllDay) {
      result += HOURS_IN_DAY;
    } else if (endDateHours > endDayHour) {
      result += dayHours;
    } else if (endDateHours > startDayHour) {
      result += endDateHours - startDayHour;
    }
  }

  return result;
};

export default getSkippedHoursInRange;
