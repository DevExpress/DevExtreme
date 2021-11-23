// import dateUtils from '../../../../core/utils/date';
import { isObject, isString } from '../../../../core/utils/type';
import { SchedulerProps, ViewProps } from '../props';
import { ViewType } from '../types';
import { CurrentViewConfigType } from '../workspaces/props';

const VIEW_TYPES = [
  'day', 'week', 'workWeek',
  'month', 'timelineDay', 'timelineWeek',
  'timelineWorkWeek', 'timelineMonth', 'agenda',
];

export const getCurrentView = (
  currentView: string | ViewType,
  // https://github.com/DevExpress/devextreme-renovation/issues/754
  views: (ViewType | Partial<ViewProps>)[],
): ViewType | Partial<ViewProps> => {
  let currentViewProps: ViewType | Partial<ViewProps> | undefined = views.find((view): boolean => {
    const names = isObject(view)
      ? [view.name, view.type]
      : [view];

    if (names.includes(currentView)) {
      return true;
    }

    return false;
  });

  if (currentViewProps === undefined) {
    if (VIEW_TYPES.includes(currentView)) {
      currentViewProps = currentView as ViewType;
    } else {
      [currentViewProps] = views;
    }
  }

  return currentViewProps;
};

export const getCurrentViewProps = (
  currentView: string | ViewType,
  // https://github.com/DevExpress/devextreme-renovation/issues/754
  views: (ViewType | Partial<ViewProps>)[],
): Partial<ViewProps> => {
  const currentViewProps = getCurrentView(currentView, views);

  return isString(currentViewProps)
    ? { type: currentViewProps }
    : currentViewProps;
};

function getViewConfigProp<T extends unknown>(schedulerProp: T, viewProp: T | undefined): T {
  return viewProp !== undefined ? viewProp : schedulerProp;
}

export const getCurrentViewConfig = (
  // https://github.com/DevExpress/devextreme-renovation/issues/754
  currentViewProps: Partial<ViewProps>,
  schedulerProps: SchedulerProps,
): CurrentViewConfigType => {
  const { scrolling: schedulerScrolling } = schedulerProps;

  const {
    firstDayOfWeek,
    startDayHour,
    endDayHour,
    cellDuration,
    groupByDate,
    intervalCount,
    groupOrientation,
    startDate,
    type,
    scrolling,
    dataCellTemplate,
    timeCellTemplate,
    resourceCellTemplate,
    dateCellTemplate,
    appointmentTemplate,
    appointmentCollectorTemplate,
  } = currentViewProps;

  const isVirtualScrolling = schedulerScrolling.mode === 'virtual'
        || scrolling?.mode === 'virtual';
  const crossScrollingEnabled = schedulerProps.crossScrollingEnabled
        || isVirtualScrolling;

  const result = {
    firstDayOfWeek: getViewConfigProp(schedulerProps.firstDayOfWeek, firstDayOfWeek),
    startDayHour: getViewConfigProp(schedulerProps.startDayHour, startDayHour),
    endDayHour: getViewConfigProp(schedulerProps.endDayHour, endDayHour),
    cellDuration: getViewConfigProp(schedulerProps.cellDuration, cellDuration),
    groupByDate: getViewConfigProp(schedulerProps.groupByDate, groupByDate),
    scrolling: getViewConfigProp(schedulerScrolling, scrolling),

    dataCellTemplate: getViewConfigProp(schedulerProps.dataCellTemplate, dataCellTemplate),
    timeCellTemplate: getViewConfigProp(schedulerProps.timeCellTemplate, timeCellTemplate),
    resourceCellTemplate: getViewConfigProp(
      schedulerProps.resourceCellTemplate, resourceCellTemplate,
    ),
    dateCellTemplate: getViewConfigProp(schedulerProps.dateCellTemplate, dateCellTemplate),
    appointmentTemplate: getViewConfigProp(schedulerProps.appointmentTemplate, appointmentTemplate),
    appointmentCollectorTemplate: getViewConfigProp(
      schedulerProps.appointmentCollectorTemplate,
      appointmentCollectorTemplate,
    ),

    // currentDate: dateUtils.trimTime(new Date(schedulerProps.currentDate)), // TODO
    currentDate: schedulerProps.currentDate,
    intervalCount,
    groupOrientation,
    startDate,
    type,
    showAllDayPanel: schedulerProps.showAllDayPanel,
    showCurrentTimeIndicator: schedulerProps.showCurrentTimeIndicator,
    indicatorUpdateInterval: schedulerProps.indicatorUpdateInterval,
    shadeUntilCurrentTime: schedulerProps.shadeUntilCurrentTime,
    crossScrollingEnabled,
    schedulerHeight: schedulerProps.height,
    schedulerWidth: schedulerProps.width,

    tabIndex: schedulerProps.tabIndex,
    accessKey: schedulerProps.accessKey,
    focusStateEnabled: schedulerProps.focusStateEnabled,

    // indicatorTime: new Date(), // TODO
    allowMultipleCellSelection: true, // TODO
    allDayPanelExpanded: true, // TODO

    // noDataText: this.props.noDataText, // TODO: necessary for agenda
    // selectedCellData: this.props.selectedCellData,
    // onSelectionChanged: (args) => { TODO
    //   this.option('selectedCellData', args.selectedCellData);
    // },
    // timeZoneCalculator: getTimeZoneCalculator(this.key), // TODO
    // onSelectedCellsClick: this.showAddAppointmentPopup.bind(this) // TODO,
    // onVirtualScrollingUpdated: this._renderAppointments.bind(this) // TODO,
    // getHeaderHeight: () => utils.DOM.getHeaderHeight(this._header) // TODO,
    // onScrollEnd: () => this._appointments.updateResizableArea() // TODO or refactor,
    // onCellClick = this._createActionByOption('onCellClick') // TODO
    // onCellContextMenu = this._createActionByOption('onCellContextMenu') // TODO
  };

  return {
    ...result,
    hoursInterval: result.cellDuration / 60,
    // selectedCellData: [], // TODO
  } as CurrentViewConfigType;
};
