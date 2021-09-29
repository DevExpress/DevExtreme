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

import { DataAccessorType, ViewType } from '../types';
import { calculateIsGroupedAllDayPanel, getCellDuration } from '../view_model/to_test/views/utils/base';
import { createGetAppointmentColor } from '../resources/utils';

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
): AppointmentsConfigType => ({
  key,
  adaptivityEnabled: schedulerConfig.adaptivityEnabled,
  rtlEnabled: schedulerConfig.rtlEnabled,
  startDayHour: viewConfig.startDayHour,
  viewStartDayHour: viewConfig.startDayHour, // TODO remove
  endDayHour: viewConfig.endDayHour,
  viewEndDayHour: viewConfig.endDayHour, // TODO remove
  resources: schedulerConfig.resources,
  maxAppointmentsPerCell: schedulerConfig.maxAppointmentsPerCell,
  currentDate: viewConfig.currentDate,
  isVirtualScrolling: viewConfig.scrolling.mode === 'virtual',
  intervalCount: viewConfig.intervalCount,
  hoursInterval: viewConfig.hoursInterval,
  showAllDayPanel: viewConfig.showAllDayPanel,
  modelGroups: [],
  appointmentCountPerCell: 2, // TODO default
  appointmentOffset: 26, // TODO default
  allowResizing: false, // TODO resizing
  allowAllDayResizing: false, // TODO resizing
  dateTableOffset: 0,
  groupOrientation: viewConfig.groupOrientation,
  startViewDate: viewConfig.startDate,
  timeZone: schedulerConfig.timeZone,
  firstDayOfWeek: viewConfig.firstDayOfWeek,
  viewType: viewConfig.type,
  cellDurationInMinutes: viewConfig.cellDuration,
  supportAllDayRow: viewConfig.showAllDayPanel, // ?
  isVerticalGroupOrientation: viewConfig.groupOrientation === 'vertical',
});

export const getAppointmentsModel = (
  key: number,
  schedulerConfig: SchedulerProps,
  viewConfig: CurrentViewConfigType,
  viewDataProvider: ViewDataProviderType,
  timeZoneCalculator: unknown,
  appointmentDataProvider: unknown,
  dataAccessors: DataAccessorType,
  cellsMetaData: CellsMetaData,
): AppointmentsModelType => {
  const appointmentConfig = getAppointmentConfig(
    key,
    schedulerConfig,
    viewConfig,
  );

  const groupCount = getGroupCount(schedulerConfig.groups);

  const groupedByDate = isGroupingByDate(
    schedulerConfig.groups as unknown as Group[],
    viewConfig.groupOrientation,
    viewConfig.groupByDate,
  );

  const positionHelper = new PositionHelper({
    viewDataProvider,
    groupedByDate,
    rtlEnabled: appointmentConfig.rtlEnabled,
    groupCount,
    getDOMMetaDataCallback: (): CellsMetaData => cellsMetaData,
  });

  const isGroupedAllDayPanel = calculateIsGroupedAllDayPanel(
    viewConfig.groups,
    viewConfig.groupOrientation,
    viewConfig.showAllDayPanel,
  );

  const rowCount = viewDataProvider.getRowCount({
    intervalCount: viewConfig.intervalCount,
    currentDate: viewConfig.currentDate,
    viewType: viewConfig.type,
    hoursInterval: viewConfig.hoursInterval,
    startDayHour: viewConfig.startDayHour,
    endDayHour: viewConfig.endDayHour,
  });

  const allDayHeight = getAllDayHeight(
    viewConfig.showAllDayPanel,
    appointmentConfig.isVerticalGroupOrientation,
    cellsMetaData,
  );

  const endViewDate = viewDataProvider.getLastCellEndDate();
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
  const cellDuration = getCellDuration(
    viewConfig.type,
    viewConfig.startDayHour,
    viewConfig.endDayHour,
    viewConfig.hoursInterval,
  );

  const getAppointmentColor = createGetAppointmentColor({
    resources: schedulerConfig.resources,
    resourceDataAccessors: dataAccessors,
    loadedResources: [], // TODO fill after load resources
    resourceLoaderMap: new Map(), // TODO fill after load resources
  });

  return {
    ...appointmentConfig,
    appointmentRenderingStrategyName: getAppointmentRenderingStrategyName(viewConfig.type),
    loadedResources: [],
    dataAccessors,
    timeZoneCalculator,
    appointmentDataProvider,
    viewDataProvider,
    positionHelper,
    isGroupedAllDayPanel,
    rowCount,
    groupCount,
    cellWidth: getCellWidth(cellsMetaData),
    cellHeight: getCellHeight(cellsMetaData),
    allDayHeight,
    isGroupedByDate: groupedByDate,
    endViewDate,
    visibleDayDuration,
    dateRange,
    intervalDuration,
    allDayIntervalDuration,
    leftVirtualCellCount,
    topVirtualCellCount: topVirtualRowCount,
    cellDuration,
    getAppointmentColor,
    resizableStep: positionHelper.getResizableStep(),
    DOMMetaData: cellsMetaData,
  };
};
