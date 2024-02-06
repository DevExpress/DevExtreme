import { ViewDataProviderType } from '../../../workspaces/types';
import dateUtils from '../../../../../../core/utils/date';

const getSkippedHoursInRange = (
  startDate: Date,
  endDate: Date,
  viewDataProvider: ViewDataProviderType,
): number => {
  const msInHour = dateUtils.dateToMilliseconds('hour');
  const startTime = dateUtils.setToDayStart(startDate).getTime();
  const endTime = dateUtils.setToDayEnd(new Date(endDate.getTime() - 1)).getTime();
  const allDayIntervalDuration = 24 * msInHour;
  let excludedHours = 0;

  const { startDayHour, endDayHour } = viewDataProvider.getViewOptions();
  const dayHours = endDayHour - startDayHour;

  for (let time = startTime; time < endTime; time += allDayIntervalDuration) {
    const checkDate = new Date(time);
    if (viewDataProvider.isSkippedDate(checkDate)) {
      excludedHours += dayHours;
    }
  }

  if (viewDataProvider.isSkippedDate(startDate)
    && startDate.getHours() > startDayHour
    && startDate.getHours() < endDayHour
  ) {
    excludedHours += endDayHour - startDate.getHours() - dayHours;
  }

  const endDateHours = new Date(endTime).getHours();

  if (viewDataProvider.isSkippedDate(endDate)
    && endDateHours <= endDayHour
    && endDateHours > startDayHour) {
    excludedHours += endDateHours + Math.ceil(endTime % (1000 / 60 / 60)) - startDayHour - dayHours;
  }

  return excludedHours;
};

export default getSkippedHoursInRange;
