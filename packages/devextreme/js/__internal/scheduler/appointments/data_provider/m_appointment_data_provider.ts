import config from '@js/core/config';
import { combineRemoteFilter } from '@ts/scheduler/r1/filterting/index';
import type { AppointmentDataItem, SafeAppointment } from '@ts/scheduler/types';
import type { AppointmentDataAccessor } from '@ts/scheduler/utils';

import { AppointmentDataSource } from './m_appointment_data_source';
import { AppointmentFilterBaseStrategy } from './m_appointment_filter';
import { AppointmentFilterVirtualStrategy } from './m_appointment_filter_virtual';

type FilterStrategy = (AppointmentFilterBaseStrategy | AppointmentFilterVirtualStrategy) & {
  constructor: Function & {
    strategyName: string;
  };
};

const FilterStrategyMap = {
  [AppointmentFilterVirtualStrategy.strategyName]: AppointmentFilterVirtualStrategy,
  [AppointmentFilterBaseStrategy.strategyName]: AppointmentFilterBaseStrategy,
};

export class AppointmentDataProvider {
  options: any;

  dataSource: any;

  dataAccessors: AppointmentDataAccessor;

  timeZoneCalculator: any;

  appointmentDataSource: AppointmentDataSource;

  filterStrategy!: FilterStrategy;

  constructor(options) {
    this.options = options;
    this.dataSource = this.options.dataSource;
    this.dataAccessors = this.options.dataAccessors;
    this.timeZoneCalculator = this.options.timeZoneCalculator;

    this.appointmentDataSource = new AppointmentDataSource(this.dataSource);
    this.initFilterStrategy();
  }

  get keyName() {
    return this.appointmentDataSource.keyName;
  }

  get isDataSourceInit() {
    return !!this.dataSource;
  }

  get filterStrategyName(): string {
    return this.options.getIsVirtualScrolling()
      ? AppointmentFilterVirtualStrategy.strategyName
      : AppointmentFilterBaseStrategy.strategyName;
  }

  getFilterStrategy(): AppointmentFilterBaseStrategy | AppointmentFilterVirtualStrategy {
    if (
      !this.filterStrategy
      || this.filterStrategy.constructor.strategyName !== this.filterStrategyName
    ) {
      this.initFilterStrategy();
    }

    return this.filterStrategy;
  }

  initFilterStrategy(): void {
    const filterOptions = {
      resources: this.options.resources,
      dataAccessors: this.dataAccessors,
      startDayHour: this.options.startDayHour,
      endDayHour: this.options.endDayHour,
      viewOffset: this.options.viewOffset,
      showAllDayPanel: this.options.showAllDayPanel,
      timeZoneCalculator: this.options.timeZoneCalculator,
      //
      loadedResources: this.options.getLoadedResources,
      supportAllDayRow: this.options.getSupportAllDayRow,
      viewType: this.options.getViewType,
      viewDirection: this.options.getViewDirection,
      dateRange: this.options.getDateRange,
      groupCount: this.options.getGroupCount,
      viewDataProvider: this.options.getViewDataProvider,
      allDayPanelMode: this.options.allDayPanelMode,
    };
    const strategy = new FilterStrategyMap[this.filterStrategyName](filterOptions);

    this.filterStrategy = strategy as FilterStrategy;
  }

  setDataSource(dataSource): void {
    this.dataSource = dataSource;
    this.initFilterStrategy();
    this.appointmentDataSource.setDataSource(this.dataSource);
  }

  updateDataAccessors(dataAccessors): void {
    this.dataAccessors = dataAccessors;
    this.initFilterStrategy();
  }

  // Filter mapping
  filter(preparedItems: AppointmentDataItem[]): SafeAppointment[] {
    return this.getFilterStrategy().filter(preparedItems);
  }

  // TODO rename to the setRemoteFilter
  filterByDate(min, max, remoteFiltering, dateSerializationFormat) {
    if (!this.dataSource || !remoteFiltering) {
      return;
    }

    const dataSourceFilter = this.dataSource.filter();
    const filter = combineRemoteFilter({
      dataSourceFilter,
      dataAccessors: this.dataAccessors,
      min,
      max,
      dateSerializationFormat,
      forceIsoDateParsing: config().forceIsoDateParsing,
    });

    this.dataSource.filter(filter);
  }

  hasAllDayAppointments(filteredItems, preparedItems) {
    return this.getFilterStrategy().hasAllDayAppointments(filteredItems, preparedItems);
  }

  filterLoadedAppointments(filterOption, preparedItems) {
    return this.getFilterStrategy().filterLoadedAppointments(filterOption, preparedItems);
  }

  // Appointment data source mappings
  cleanState() { this.appointmentDataSource.cleanState(); }

  getUpdatedAppointment() { return this.appointmentDataSource._updatedAppointment; }

  getUpdatedAppointmentKeys() { return this.appointmentDataSource._updatedAppointmentKeys; }

  add(rawAppointment) {
    return this.appointmentDataSource.add(rawAppointment);
  }

  update(target, rawAppointment) {
    return this.appointmentDataSource.update(target, rawAppointment);
  }

  remove(rawAppointment) {
    return this.appointmentDataSource.remove(rawAppointment);
  }

  destroy() {
    this.appointmentDataSource.destroy();
  }
}
