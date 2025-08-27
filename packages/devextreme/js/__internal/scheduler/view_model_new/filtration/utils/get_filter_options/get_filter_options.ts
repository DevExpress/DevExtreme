import type Scheduler from '../../../../m_scheduler';
import { VIEWS_SPLIT_INTERVALS_BY_DAYS, VIEWS_WITH_ALL_DAY_PANEL } from '../../../constants';
import type { FilterOptions } from '../../../types';
import { getPanelIntervals } from './get_panel_intervals';

export const getFilterOptions = (schedulerStore: Scheduler): FilterOptions => {
  const workspace = schedulerStore.getWorkSpace();
  const dateRange = workspace.getDateRange() as Date[];
  const compareOptions = {
    startDayHour: schedulerStore.getViewOption('startDayHour'),
    endDayHour: schedulerStore.getViewOption('endDayHour'),
    min: dateRange[0],
    max: dateRange[1],
  };
  const viewOffset = schedulerStore.getViewOffsetMs();
  const isSplitByDays = VIEWS_SPLIT_INTERVALS_BY_DAYS.includes(schedulerStore.currentView.type);
  const supportAllDayPanel = VIEWS_WITH_ALL_DAY_PANEL.includes(schedulerStore.currentView.type);

  return {
    allDayPanelMode: schedulerStore.getViewOption('allDayPanelMode'),
    supportAllDayPanel,
    showAllDayPanel: schedulerStore.option('showAllDayPanel'),
    resourceManager: schedulerStore.resourceManager,
    timeZoneCalculator: schedulerStore.timeZoneCalculator,
    viewOffset,
    firstDayOfWeek: schedulerStore.option('firstDayOfWeek'),
    regularPanel: getPanelIntervals(compareOptions, viewOffset, false, isSplitByDays),
    allDayPanel: getPanelIntervals(compareOptions, viewOffset, true, false),
  };
};
