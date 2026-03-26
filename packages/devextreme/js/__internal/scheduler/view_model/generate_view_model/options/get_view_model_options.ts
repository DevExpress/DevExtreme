import type { Orientation } from '@js/common';
import type { SnapToCellsMode } from '@js/ui/scheduler';
import type Scheduler from '@ts/scheduler/m_scheduler';

import type { ViewType } from '../../../types';
import { getCompareOptions } from '../../common/get_compare_options';
import type { CompareOptions } from '../../types';

interface ViewConfig {
  isTimelineView: boolean;
  isMonthView: boolean;
  viewOrientation: 'horizontal' | 'vertical';
  snapToCellsMode: SnapToCellsMode;
}

const configByView: Record<ViewType, ViewConfig> = {
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
  agenda: {
    isTimelineView: false, isMonthView: false, viewOrientation: 'vertical', snapToCellsMode: 'always',
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
  };
};
