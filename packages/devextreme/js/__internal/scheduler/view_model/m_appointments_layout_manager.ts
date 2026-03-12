import dateUtils from '@js/core/utils/date';
import type { Appointment } from '@js/ui/scheduler';

import type Scheduler from '../m_scheduler';
import { getCellDuration } from '../r1/utils/index';
import type {
  AppointmentDataItem,
  RenderStrategyName,
  SafeAppointment,
  ViewType,
} from '../types';
import type { ResourceManager } from '../utils/resource_manager/resource_manager';
import { getAllDayHeight, getCellHeight, getCellWidth } from '../workspaces/helpers/m_position_helper';
import { createAppointmentFilter } from './filtering/create_appointment_filter';
import { AppointmentViewModelGenerator } from './generate_view_model/m_view_model_generator';
import type { AppointmentViewModelPlain } from './generate_view_model/types';
import { getAppointmentDataItems } from './preparation/get_appointment_data_items';

const toMs = dateUtils.dateToMilliseconds;
const appointmentRenderingStrategyMap: Record<ViewType, RenderStrategyName> = {
  day: 'vertical',
  week: 'week',
  workWeek: 'week',
  month: 'horizontalMonth',
  timelineDay: 'horizontal',
  timelineWeek: 'horizontal',
  timelineWorkWeek: 'horizontal',
  timelineMonth: 'horizontalMonthLine',
  agenda: 'agenda',
};

class AppointmentLayoutManager {
  preparedItems: AppointmentDataItem[] = [];

  filteredItems: SafeAppointment[] = [];

  appointmentViewModel = new AppointmentViewModelGenerator();

  _positionMap: any;

  constructor(public instance: Scheduler) {}

  public get appointmentRenderingStrategyName(): RenderStrategyName {
    return appointmentRenderingStrategyMap[this.instance.currentView.type];
  }

  public prepareItems(items?: Appointment[]): void {
    this.preparedItems = getAppointmentDataItems(
      items,
      this.instance._dataAccessors,
      this.instance.getViewOption('cellDuration'),
      this.instance.timeZoneCalculator,
    );
  }

  public filterAppointments(): void {
    const strategy = createAppointmentFilter(this.instance);
    this.filteredItems = strategy.filter(this.preparedItems);
  }

  public hasAllDayAppointments(): boolean {
    const strategy = createAppointmentFilter(this.instance);
    return strategy.hasAllDayAppointments(this.filteredItems, this.preparedItems);
  }

  protected _getRenderingStrategyOptions() {
    const workspace = this.instance.getWorkSpace();
    const { virtualScrollingDispatcher } = this.instance.getWorkSpace();
    const {
      cellCountInsideLeftVirtualCell,
      cellCountInsideTopVirtualRow,
    } = virtualScrollingDispatcher;
    const groupCount = this.instance.resourceManager.groupCount();
    const DOMMetaData = workspace.getDOMElementsMetaData();
    const allDayHeight = getAllDayHeight(
      workspace.option('showAllDayPanel'),
      workspace.isVerticalGroupedWorkSpace(),
      DOMMetaData,
    );
    const rowCount = workspace._getRowCount();
    const { positionHelper, viewDataProvider } = workspace;
    const visibleDayDuration = viewDataProvider.getVisibleDayDuration(
      workspace.option('startDayHour'),
      workspace.option('endDayHour'),
      workspace.option('hoursInterval'),
    );

    const cellDuration = getCellDuration(
      workspace.type,
      workspace.option('startDayHour'),
      workspace.option('endDayHour'),
      workspace.option('hoursInterval'),
    );
    return {
      resources: this.instance.option('resources'),
      getResourceManager: (): ResourceManager => this.instance.resourceManager,
      getAppointmentColor: (config) => this.instance.resourceManager.getAppointmentColor(config),
      dataAccessors: this.instance._dataAccessors,
      appointmentRenderingStrategyName: this.appointmentRenderingStrategyName,
      adaptivityEnabled: this.instance.option('adaptivityEnabled'),
      rtlEnabled: this.instance.option('rtlEnabled'),
      startDayHour: this.instance.getViewOption('startDayHour'),
      endDayHour: this.instance.getViewOption('endDayHour'),
      viewOffset: this.instance.getViewOption('offset') * toMs('minute'),
      maxAppointmentsPerCell: this.instance.getViewOption('maxAppointmentsPerCell'),
      currentDate: this.instance.option('currentDate'),
      isVirtualScrolling: this.instance.isVirtualScrolling(),
      leftVirtualCellCount: cellCountInsideLeftVirtualCell,
      topVirtualCellCount: cellCountInsideTopVirtualRow,
      intervalCount: workspace.option('intervalCount'),
      hoursInterval: workspace.option('hoursInterval'),
      showAllDayPanel: workspace.option('showAllDayPanel'),
      isGroupedAllDayPanel: workspace.isGroupedAllDayPanel(),
      groups: this.instance.getViewOption('groups'),
      groupCount,
      rowCount,
      appointmentCountPerCell: this.instance.option('_appointmentCountPerCell'),
      appointmentOffset: this.instance.option('_appointmentOffset'),
      allowResizing: this.instance._allowResizing(),
      allowAllDayResizing: this.instance._allowAllDayResizing(),
      startViewDate: workspace.getStartViewDate(),
      groupOrientation: workspace._getRealGroupOrientation(),
      cellWidth: getCellWidth(DOMMetaData),
      cellHeight: getCellHeight(DOMMetaData),
      allDayHeight,
      resizableStep: positionHelper.getResizableStep(),
      visibleDayDuration,
      allDayPanelMode: this.instance.getViewOption('allDayPanelMode'),
      // appointment settings
      timeZoneCalculator: this.instance.timeZoneCalculator,
      timeZone: this.instance.option('timeZone'),
      firstDayOfWeek: this.instance.getFirstDayOfWeek(),
      viewStartDayHour: this.instance.getViewOption('startDayHour'),
      viewEndDayHour: this.instance.getViewOption('endDayHour'),
      viewType: workspace.type,
      endViewDate: workspace.getEndViewDate(),
      positionHelper,
      isGroupedByDate: workspace.isGroupedByDate(),
      cellDuration,
      cellDurationInMinutes: workspace.option('cellDuration'),
      viewDataProvider: workspace.viewDataProvider,
      supportAllDayRow: workspace.supportAllDayRow(),
      dateRange: workspace.getDateRange(),
      intervalDuration: workspace.getIntervalDuration(),
      allDayIntervalDuration: workspace.getIntervalDuration(true),
      isVerticalGroupOrientation: workspace.isVerticalOrientation(),
      _collectorOffset: this.instance.getCollectorOffset(),
      DOMMetaData,
      // agenda only
      instance: this.instance,
      agendaDuration: workspace.option('agendaDuration'),
    };
  }

  public createAppointmentsMap(): AppointmentViewModelPlain[] {
    const renderingStrategyOptions = this._getRenderingStrategyOptions();

    const {
      viewModel,
      positionMap,
    } = this.appointmentViewModel.generate(this.filteredItems, renderingStrategyOptions) as any;

    this._positionMap = positionMap;

    return viewModel;
  }

  public getRenderingStrategyInstance() {
    const renderingStrategy = this.appointmentViewModel.getRenderingStrategy();

    if (!renderingStrategy) {
      const options = this._getRenderingStrategyOptions();
      this.appointmentViewModel.initRenderingStrategy(options);
    }

    return this.appointmentViewModel.getRenderingStrategy();
  }
}

export default AppointmentLayoutManager;
