import { ViewDataProviderType } from '../../../workspaces/types';
import dateUtils from '../../../../../../core/utils/date';

const getSkippedHoursInRange = (
  startDate: Date,
  endDate: Date,
  viewDataProvider: ViewDataProviderType,
): number => {
  const msInHour = dateUtils.dateToMilliseconds('hour');
  const startTime = (dateUtils.trimTime(startDate) as Date).getTime();
  const endTime = dateUtils.setToDayEnd(new Date(endDate.getTime() - 1)).getTime();
  const allDayIntervalDuration = 24 * msInHour;
  let excludedHours = 0;

  for (let time = startTime; time < endTime; time += allDayIntervalDuration) {
    const checkDate = new Date(time);
    if (viewDataProvider.isSkippedDate(checkDate)) {
      excludedHours += 24;
    }
  }

  return excludedHours;
};

export default getSkippedHoursInRange;
