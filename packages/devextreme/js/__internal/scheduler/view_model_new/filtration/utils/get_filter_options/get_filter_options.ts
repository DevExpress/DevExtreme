import type Scheduler from '../../../../m_scheduler';
import { getCompareOptions } from '../../../common/get_compare_options';
import { VIEWS_WITH_ALL_DAY_PANEL } from '../../../constants';
import type { FilterOptions } from '../../../types';
import { getVisibleDateTimeIntervals } from './get_visible_date_time_intervals';
import { shiftIntervals } from './shift_intervals';

export const getFilterOptions = (schedulerStore: Scheduler): FilterOptions => {
  const compareOptions = getCompareOptions(schedulerStore);
  const viewOffset = schedulerStore.getViewOffsetMs();
  const supportAllDayPanel = VIEWS_WITH_ALL_DAY_PANEL.includes(schedulerStore.currentView.type);

  return {
    allDayPanelMode: schedulerStore.getViewOption('allDayPanelMode'),
    supportAllDayPanel,
    showAllDayPanel: schedulerStore.option('showAllDayPanel'),
    resourceManager: schedulerStore.resourceManager,
    timeZoneCalculator: schedulerStore.timeZoneCalculator,
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
