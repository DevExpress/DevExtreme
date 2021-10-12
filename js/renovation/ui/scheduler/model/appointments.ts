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
import { TimeZoneCalculator } from '../timeZoneCalculator/utils';

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

export const getAppointmentsConfig = (
  schedulerConfig: SchedulerProps,
  viewConfig: CurrentViewConfigType,
  loadedResources: Group[],
  viewDataProvider: ViewDataProviderType,
): AppointmentsConfigType => {
  const groupCount = getGroupCount(loadedResources);

  const startViewDate = viewDataProvider.getStartViewDate();
  const dateRange = [ // TODO get rid of dateRange
    startViewDate,
    viewDataProvider.getLastViewDateByEndDayHour(viewConfig.endDayHour),
  ];

  return {
    adaptivityEnabled: schedulerConfig.adaptivityEnabled,
    rtlEnabled: schedulerConfig.rtlEnabled,
    resources: schedulerConfig.resources,
    maxAppointmentsPerCell: schedulerConfig.maxAppointmentsPerCell,
    timeZone: schedulerConfig.timeZone,
    modelGroups: schedulerConfig.groups,
    startDayHour: viewConfig.startDayHour,
    viewStartDayHour: viewConfig.startDayHour, // TODO remove
    endDayHour: viewConfig.endDayHour,
    viewEndDayHour: viewConfig.endDayHour, // TODO remove
    currentDate: viewConfig.currentDate,
    isVirtualScrolling: viewConfig.scrolling.mode === 'virtual',
    intervalCount: viewConfig.intervalCount,
    hoursInterval: viewConfig.hoursInterval,
    showAllDayPanel: viewConfig.showAllDayPanel,
    groupOrientation: viewConfig.groupOrientation,
    firstDayOfWeek: viewConfig.firstDayOfWeek,
    viewType: viewConfig.type,
    cellDurationInMinutes: viewConfig.cellDuration,
    supportAllDayRow: viewConfig.showAllDayPanel, // ?
    isVerticalGroupOrientation: viewConfig.groupOrientation === 'vertical',
    groupByDate: viewConfig.groupByDate,
    startViewDate,
    loadedResources,
    appointmentCountPerCell: 2, // TODO default
    appointmentOffset: 26, // TODO default
    allowResizing: false, // TODO resizing
    allowAllDayResizing: false, // TODO resizing
    dateTableOffset: 0,
    groupCount,
    dateRange,
  };
};

export const getAppointmentsModel = (
  appointmentsConfig: AppointmentsConfigType,
  viewDataProvider: ViewDataProviderType,
  timeZoneCalculator: TimeZoneCalculator,
  dataAccessors: DataAccessorType,
  cellsMetaData: CellsMetaData,
): AppointmentsModelType => {
  const groupedByDate = isGroupingByDate(
    appointmentsConfig.modelGroups as unknown as Group[],
    appointmentsConfig.groupOrientation,
    appointmentsConfig.groupByDate,
  );

  const positionHelper = new PositionHelper({
    viewDataProvider,
    groupedByDate,
    rtlEnabled: appointmentsConfig.rtlEnabled,
    groupCount: appointmentsConfig.groupCount,
    getDOMMetaDataCallback: (): CellsMetaData => cellsMetaData,
  });

  const isGroupedAllDayPanel = calculateIsGroupedAllDayPanel(
    appointmentsConfig.loadedResources,
    appointmentsConfig.groupOrientation,
    appointmentsConfig.showAllDayPanel,
  );

  const rowCount = viewDataProvider.getRowCount({
    intervalCount: appointmentsConfig.intervalCount,
    currentDate: appointmentsConfig.currentDate,
    viewType: appointmentsConfig.viewType,
    hoursInterval: appointmentsConfig.hoursInterval,
    startDayHour: appointmentsConfig.startDayHour,
    endDayHour: appointmentsConfig.endDayHour,
  });

  const allDayHeight = getAllDayHeight(
    appointmentsConfig.showAllDayPanel,
    appointmentsConfig.isVerticalGroupOrientation,
    cellsMetaData,
  );

  const endViewDate = viewDataProvider.getLastCellEndDate();
  const visibleDayDuration = viewDataProvider.getVisibleDayDuration(
    appointmentsConfig.startDayHour,
    appointmentsConfig.endDayHour,
    appointmentsConfig.hoursInterval,
  );

  const intervalDuration = viewDataProvider.getIntervalDuration(appointmentsConfig.intervalCount);
  const allDayIntervalDuration = toMs('day') * 3600000;
  const { leftVirtualCellCount, topVirtualRowCount } = viewDataProvider.viewData;
  const cellDuration = getCellDuration(
    appointmentsConfig.viewType,
    appointmentsConfig.startDayHour,
    appointmentsConfig.endDayHour,
    appointmentsConfig.hoursInterval,
  );

  const getAppointmentColor = createGetAppointmentColor({
    resources: appointmentsConfig.resources,
    resourceDataAccessors: dataAccessors,
    loadedResources: [], // TODO fill after load resources
    resourceLoaderMap: new Map(), // TODO fill after load resources
  });

  const appointmentRenderingStrategyName = getAppointmentRenderingStrategyName(
    appointmentsConfig.viewType,
  );

  return {
    ...appointmentsConfig,
    appointmentRenderingStrategyName,
    loadedResources: [],
    dataAccessors,
    timeZoneCalculator,
    viewDataProvider,
    positionHelper,
    isGroupedAllDayPanel,
    rowCount,
    cellWidth: getCellWidth(cellsMetaData),
    cellHeight: getCellHeight(cellsMetaData),
    allDayHeight,
    isGroupedByDate: groupedByDate,
    endViewDate,
    visibleDayDuration,
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
