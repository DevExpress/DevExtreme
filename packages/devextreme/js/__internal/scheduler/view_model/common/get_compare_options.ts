import type Scheduler from '../../m_scheduler';
import timeZoneUtils from '../../m_utils_time_zone';
import type { CompareOptions } from '../types';

export const getCompareOptions = (
  schedulerStore: Scheduler,
): CompareOptions => {
  const workspace = schedulerStore.getWorkSpace();
  const dateRange = workspace.getDateRange() as Date[];
  const compareOptions = {
    startDayHour: schedulerStore.getViewOption('startDayHour'),
    endDayHour: schedulerStore.getViewOption('endDayHour'),
    min: timeZoneUtils.createUTCDateWithLocalOffset(dateRange[0]).getTime(),
    max: timeZoneUtils.createUTCDateWithLocalOffset(dateRange[1]).getTime(),
    skippedDays: schedulerStore.currentView.skippedDays,
  };

  return compareOptions;
};
