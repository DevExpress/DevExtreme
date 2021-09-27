import {
  getTimeZoneCalculator,
  getAppointmentDataProvider,
} from '../../../../ui/scheduler/instanceFactory';
import {
  getCellWidth,
  getCellHeight,
  getAllDayHeight,
  PositionHelper,
} from '../../../../ui/scheduler/workspaces/helpers/positionHelper';
import { SchedulerProps } from '../props';
import { CurrentViewConfigType } from '../workspaces/props';
import { getGroupCount } from '../../../../ui/scheduler/resources/utils';
import { isGroupingByDate } from '../workspaces/utils';
import { CellsMetaData, Group, ViewDataProviderType } from '../workspaces/types';
import dateUtils from '../../../../core/utils/date';

import { AppointmentsConfigType, AppointmentsModelType } from './types';

import { ViewType } from '../types';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const toMs = (name: string): number => dateUtils.dateToMilliseconds(name);

const getAppointmentRenderingStrategyName = (viewType: ViewType): string => {
  const appointmentRenderingStrategyMap: Record<ViewType, { renderingStrategy: string }> = {
    day: {
      renderingStrategy: 'vertical',
    },
    week: {
      renderingStrategy: 'vertical',
    },
    workWeek: {
      renderingStrategy: 'vertical',
    },
    month: {
      renderingStrategy: 'horizontalMonth',
    },
    timelineDay: {
      renderingStrategy: 'horizontal',
    },
    timelineWeek: {
      renderingStrategy: 'horizontal',
    },
    timelineWorkWeek: {
      renderingStrategy: 'horizontal',
    },
    timelineMonth: {
      renderingStrategy: 'horizontalMonthLine',
    },
    agenda: {
      renderingStrategy: 'agenda',
    },
  };
  const { renderingStrategy } = appointmentRenderingStrategyMap[viewType];

  return renderingStrategy;
};

const getAppointmentConfig = (
  key: number,
  schedulerConfig: SchedulerProps,
  viewConfig: CurrentViewConfigType,
  viewDataProvider: ViewDataProviderType,
  cellMetaData: CellsMetaData,
): AppointmentsConfigType => {
  const groupedByDate = isGroupingByDate(
    schedulerConfig.groups as unknown as Group[],
    viewConfig.groupOrientation,
    viewConfig.groupByDate,
  );
  const isVerticalGroupOrientation = viewConfig.groupOrientation === 'vertical';
  const isVirtualScrolling = schedulerConfig.scrolling.mode === 'virtual';
  const endViewDate = viewDataProvider.getLastCellEndDate();
  const allDayHeight = getAllDayHeight(
    viewConfig.showAllDayPanel,
    isVerticalGroupOrientation,
    cellMetaData,
  );
  const visibleDayDuration = viewDataProvider.getVisibleDayDuration(
    viewConfig.startDayHour,
    viewConfig.endDayHour,
    viewConfig.hoursInterval,
  );

  const dateRange = [ // TODO get rid of dateRange
    viewDataProvider.getStartViewDate(),
    viewDataProvider.getLastViewDateByEndDayHour(viewConfig.endDayHour),
  ];

  const intervalDuration = viewDataProvider.getIntervalDuration(viewConfig.intervalCount);
  const allDayIntervalDuration = toMs('day') * 3600000;
  const { leftVirtualCellCount, topVirtualRowCount } = viewDataProvider.viewData;

  return {
    key,
    appointmentRenderingStrategyName: getAppointmentRenderingStrategyName(viewConfig.type),
    adaptivityEnabled: schedulerConfig.adaptivityEnabled,
    rtlEnabled: schedulerConfig.rtlEnabled,
    maxAppointmentsPerCell: schedulerConfig.maxAppointmentsPerCell,
    isVirtualScrolling,
    leftVirtualCellCount,
    topVirtualCellCount: topVirtualRowCount,
    modelGroups: viewConfig.groups,
    groupCount: getGroupCount(schedulerConfig.groups),
    dateTableOffset: 0,
    groupOrientation: viewConfig.groupOrientation,
    startViewDate: viewConfig.startDate,
    endViewDate,
    isGroupedByDate: groupedByDate,
    cellWidth: getCellWidth(cellMetaData),
    cellHeight: getCellHeight(cellMetaData),
    allDayHeight,
    visibleDayDuration,
    timeZone: schedulerConfig.timeZone,
    firstDayOfWeek: viewConfig.firstDayOfWeek,
    viewType: viewConfig.type,
    cellDuration: viewConfig.cellDuration,
    supportAllDayRow: viewConfig.showAllDayPanel, // ?
    dateRange,
    intervalDuration,
    allDayIntervalDuration,
    isVerticalGroupOrientation,
    DOMMetaData: cellMetaData,
  };
};

export const getAppointmentsModel = (
  key: number,
  schedulerConfig: SchedulerProps,
  viewConfig: CurrentViewConfigType,
  viewDataProvider: ViewDataProviderType,
  cellMetaData: CellsMetaData,
): AppointmentsModelType => {
  const appointmentConfig = getAppointmentConfig(
    key,
    schedulerConfig,
    viewConfig,
    viewDataProvider,
    cellMetaData,
  );

  const positionHelper = new PositionHelper({
    viewDataProvider,
    isGroupingByDate: appointmentConfig.isGroupedByDate,
    rtlEnabled: appointmentConfig.rtlEnabled,
    groupCount: appointmentConfig.groupCount,
    getDOMMetaDataCallback: (): CellsMetaData => cellMetaData,
  });

  return {
    ...appointmentConfig,
    timeZoneCalculator: getTimeZoneCalculator(key),
    appointmentDataProvider: getAppointmentDataProvider(key),
    viewDataProvider,
    positionHelper,
    resizableStep: positionHelper.getResizableStep(),
  };
};
