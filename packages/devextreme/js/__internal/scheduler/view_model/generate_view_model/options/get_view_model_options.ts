import type { Orientation } from '@js/common';
import type { SnapToCellsMode } from '@js/ui/scheduler';
import { dateUtils } from '@ts/core/utils/m_date';
import type Scheduler from '@ts/scheduler/scheduler';

import type { TimeZoneCalculator } from '../../../r1/timezone_calculator/calculator';
import type { ViewType } from '../../../types';
import type { DaylightPlan } from '../../../utils/daylight_grid';
import { buildDaylightPlanForRange } from '../../../utils/daylight_grid';
import { getCompareOptions } from '../../common/get_compare_options';
import type { CompareOptions } from '../../types';

const toMs = dateUtils.dateToMilliseconds;

interface ViewConfig {
  isTimelineView: boolean;
  isMonthView: boolean;
  viewOrientation: 'horizontal' | 'vertical';
  snapToCellsMode: SnapToCellsMode;
}

const configByView: Record<Exclude<ViewType, 'agenda'>, ViewConfig> = {
  day: {
    isTimelineView: false, isMonthView: false, viewOrientation: 'vertical', snapToCellsMode: 'never',
  },
  week: {
    isTimelineView: false, isMonthView: false, viewOrientation: 'vertical', snapToCellsMode: 'never',
  },
  workWeek: {
    isTimelineView: false, isMonthView: false, viewOrientation: 'vertical', snapToCellsMode: 'never',
  },
  month: {
    isTimelineView: false, isMonthView: true, viewOrientation: 'horizontal', snapToCellsMode: 'always',
  },
  timelineDay: {
    isTimelineView: true, isMonthView: false, viewOrientation: 'horizontal', snapToCellsMode: 'never',
  },
  timelineWeek: {
    isTimelineView: true, isMonthView: false, viewOrientation: 'horizontal', snapToCellsMode: 'never',
  },
  timelineWorkWeek: {
    isTimelineView: true, isMonthView: false, viewOrientation: 'horizontal', snapToCellsMode: 'never',
  },
  timelineMonth: {
    isTimelineView: true, isMonthView: true, viewOrientation: 'horizontal', snapToCellsMode: 'always',
  },
};

export interface ViewModelOptions {
  type: ViewType;
  snapToCellsMode: SnapToCellsMode;
  viewOffset: number;
  groupOrientation?: Orientation;
  isGroupByDate: boolean;
  groupCount: number;
  compareOptions: CompareOptions;
  isTimelineView: boolean;
  isMonthView: boolean;
  hasAllDayPanel: boolean;
  viewOrientation: Orientation;
  isRTLEnabled: boolean;
  isAdaptivityEnabled: boolean;
  cellDurationMinutes: number;
  isVirtualScrolling: boolean;
  timeZoneCalculator: TimeZoneCalculator;
  /**
   * The grid of a timeline whose range crosses a DST transition, shared by the cell
   * intervals and by the appointments placed on them. Undefined for every other view.
   */
  daylightPlan: DaylightPlan | undefined;
}

export const getViewModelOptions = (schedulerStore: Scheduler): ViewModelOptions => {
  const viewOffset = schedulerStore.getViewOffsetMs();
  const { groupOrientation, type } = schedulerStore.currentView;
  const groupCount = schedulerStore.resourceManager.groupCount();
  const isGroupByDate = Boolean(
    groupCount
    && groupOrientation === 'horizontal'
    && schedulerStore.getViewOption('groupByDate'),
  );
  const compareOptions = getCompareOptions(schedulerStore);
  const {
    isTimelineView,
    isMonthView,
    viewOrientation,
    snapToCellsMode: defaultSnapToCellsMode,
  } = configByView[type];
  const isRTLEnabled = Boolean(schedulerStore.option('rtlEnabled'));
  const isAdaptivityEnabled = Boolean(schedulerStore.option('adaptivityEnabled'));
  const cellDurationMinutes = schedulerStore.getViewOption('cellDuration');
  const allDayPanelMode = schedulerStore.getViewOption('allDayPanelMode');
  const snapToCellsMode = schedulerStore.getViewOption('snapToCellsMode');
  const showAllDayPanel = schedulerStore.getViewOption('showAllDayPanel');
  const isVirtualScrolling = schedulerStore.isVirtualScrolling();

  return {
    type,
    snapToCellsMode: snapToCellsMode ?? defaultSnapToCellsMode,
    viewOffset,
    groupOrientation,
    isGroupByDate,
    groupCount,
    compareOptions,
    isTimelineView,
    isMonthView,
    viewOrientation,
    isRTLEnabled,
    isAdaptivityEnabled,
    cellDurationMinutes,
    hasAllDayPanel: showAllDayPanel && allDayPanelMode !== 'hidden' && viewOrientation === 'vertical',
    isVirtualScrolling,
    timeZoneCalculator: schedulerStore.timeZoneCalculator,
    daylightPlan: isTimelineView && !isMonthView
      ? buildDaylightPlanForRange(
        compareOptions.min,
        compareOptions.max,
        compareOptions.startDayHour,
        compareOptions.endDayHour,
        cellDurationMinutes * toMs('minute'),
        compareOptions.skippedDays,
        schedulerStore.timeZoneCalculator,
      )
      : undefined,
  };
};
