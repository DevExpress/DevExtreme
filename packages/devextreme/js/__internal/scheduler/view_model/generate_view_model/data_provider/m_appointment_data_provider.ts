import config from '@js/core/config';

import { combineRemoteFilter } from '../../../r1/filterting/index';
import type { AppointmentDataAccessor } from '../../../utils/data_accessor/appointment_data_accessor';
import { AppointmentDataSource } from './m_appointment_data_source';

export class AppointmentDataProvider {
  options: any;

  dataSource: any;

  dataAccessors: AppointmentDataAccessor;

  timeZoneCalculator: any;

  appointmentDataSource: AppointmentDataSource;

  constructor(options) {
    this.options = options;
    this.dataSource = this.options.dataSource;
    this.dataAccessors = this.options.dataAccessors;
    this.timeZoneCalculator = this.options.timeZoneCalculator;

    this.appointmentDataSource = new AppointmentDataSource(this.dataSource);
  }

  get keyName() {
    return this.appointmentDataSource.keyName;
  }

  get isDataSourceInit() {
    return !!this.dataSource;
  }

  setDataSource(dataSource): void {
    this.dataSource = dataSource;
    this.appointmentDataSource.setDataSource(this.dataSource);
  }

  updateDataAccessors(dataAccessors): void {
    this.dataAccessors = dataAccessors;
  }

  // TODO rename to the setRemoteFilter
  filterByDate(min, max, remoteFiltering = false, dateSerializationFormat?) {
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
