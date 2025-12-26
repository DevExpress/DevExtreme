import type Scheduler from '../../../../m_scheduler';
import timeZoneUtils from '../../../../m_utils_time_zone';
import type { ViewType } from '../../../../types';
import { getCompareOptions } from '../../../common/get_compare_options';
import { shiftIntervals } from '../../../common/shift_intervals';
import type { CompareOptions, FilterOptions } from '../../../types';
import { getVisibleDateTimeIntervals } from './get_visible_date_time_intervals';

const VIEWS_WITH_ALL_DAY_PANEL: ViewType[] = ['day', 'week', 'workWeek'];
const DATE_TIME_VIEWS: ViewType[] = ['day', 'week', 'workWeek', 'timelineDay', 'timelineWeek', 'timelineWorkWeek'];

export const getFilterOptions = (
  schedulerStore: Scheduler,
  overrides?: {
    startDate?: Date;
    endDate?: Date;
  },
): FilterOptions => {
  const compareOptions: CompareOptions = overrides?.startDate && overrides?.endDate
    ? {
      startDayHour: schedulerStore.getViewOption('startDayHour'),
      endDayHour: schedulerStore.getViewOption('endDayHour'),
      min: timeZoneUtils.createUTCDateWithLocalOffset(overrides.startDate).getTime(),
      max: timeZoneUtils.createUTCDateWithLocalOffset(overrides.endDate).getTime(),
      skippedDays: schedulerStore.currentView.skippedDays || [],
    }
    : getCompareOptions(schedulerStore);

  const viewOffset = schedulerStore.getViewOffsetMs();
  const viewType = schedulerStore.currentView.type;
  const supportAllDayPanel = VIEWS_WITH_ALL_DAY_PANEL.includes(viewType);
  const isDateTimeView = DATE_TIME_VIEWS.includes(viewType);

  return {
    allDayPanelMode: schedulerStore.getViewOption('allDayPanelMode'),
    supportAllDayPanel,
    isDateTimeView,
    showAllDayPanel: schedulerStore.option('showAllDayPanel'),
    resourceManager: schedulerStore.resourceManager,
    timeZone: schedulerStore.getTimeZone(),
    dataAccessor: schedulerStore._dataAccessors,
    viewOffset,
    firstDayOfWeek: schedulerStore.option('firstDayOfWeek'),
    allDayIntervals: shiftIntervals(
      getVisibleDateTimeIntervals(compareOptions, true),
      viewOffset,
    ),
    regularIntervals: shiftIntervals(
      getVisibleDateTimeIntervals(compareOptions, false),
      viewOffset,
    ),
  };
};
