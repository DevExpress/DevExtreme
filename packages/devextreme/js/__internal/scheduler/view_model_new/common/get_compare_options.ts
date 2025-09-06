import type Scheduler from '../../m_scheduler';
import type { CompareOptions } from '../types';

export const getCompareOptions = (
  schedulerStore: Scheduler,
): CompareOptions => {
  const workspace = schedulerStore.getWorkSpace();
  const dateRange = workspace.getDateRange() as Date[];
  const compareOptions = {
    startDayHour: schedulerStore.getViewOption('startDayHour'),
    endDayHour: schedulerStore.getViewOption('endDayHour'),
    min: dateRange[0].getTime(),
    max: dateRange[1].getTime(),
    skippedDays: schedulerStore.currentView.skippedDays,
  };

  return compareOptions;
};
