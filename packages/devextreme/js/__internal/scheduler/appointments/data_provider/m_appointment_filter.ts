import query from '@js/common/data/query';

import {
  isAppointmentTakesAllDay, isDateAndTimeView,
} from '../../r1/utils/index';
import type { AppointmentDataItem, SafeAppointment } from '../../types';
import { AppointmentAdapter } from '../../utils/appointment_adapter/appointment_adapter';
import type { AppointmentDataAccessor } from '../../utils/data_accessor/appointment_data_accessor';
import type ViewDataProvider from '../../workspaces/view_model/m_view_data_provider';
import { getAppointmentFilter } from './utils/index';

// TODO Vinogradov refactoring: this module should be refactored :)

export class AppointmentFilterBaseStrategy {
  public static readonly strategyName: string = 'standard';

  options: any;

  dataAccessors: AppointmentDataAccessor;

  constructor(options) {
    this.options = options;
    this.dataAccessors = this.options.dataAccessors;
  }

  get timeZoneCalculator() { return this.options.timeZoneCalculator; }

  get viewStartDayHour() { return this._resolveOption('startDayHour'); }

  get viewEndDayHour() { return this._resolveOption('endDayHour'); }

  get firstDayOfWeek() { return this._resolveOption('firstDayOfWeek'); }

  get showAllDayPanel() { return this._resolveOption('showAllDayPanel'); }

  get loadedResources() { return this.options.getResourceManager().groupResources(); }

  get supportAllDayRow() { return this._resolveOption('supportAllDayRow'); }

  get viewType() { return this._resolveOption('viewType'); }

  get viewDirection() { return this._resolveOption('viewDirection'); }

  get dateRange() { return this._resolveOption('dateRange'); }

  get groupCount() { return this._resolveOption('groupCount'); }

  get viewDataProvider(): ViewDataProvider { return this._resolveOption('viewDataProvider'); }

  get allDayPanelMode() { return this._resolveOption('allDayPanelMode'); }

  _resolveOption(name) {
    const result = this.options[name];
    return typeof result === 'function'
      ? result()
      : result;
  }

  filter(preparedItems: AppointmentDataItem[]): SafeAppointment[] {
    const [min, max] = this.dateRange;
    const viewOffset = this._resolveOption('viewOffset');
    const allDay = !this.showAllDayPanel && this.supportAllDayRow
      ? false
      : undefined;

    return this.filterLoadedAppointments({
      startDayHour: this.viewStartDayHour,
      endDayHour: this.viewEndDayHour,
      viewOffset,
      min,
      max,
      resources: this.loadedResources,
      allDay,
      isTimeDateView: isDateAndTimeView(this.viewType),
      firstDayOfWeek: this.firstDayOfWeek,
    }, preparedItems);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasAllDayAppointments(filteredItems, preparedItems: AppointmentDataItem[]): boolean {
    return filteredItems
      .map((item) => new AppointmentAdapter(
        item,
        this.dataAccessors,
      ))
      .some((item) => isAppointmentTakesAllDay(item, this.allDayPanelMode));
  }

  private _createAllDayAppointmentFilter() {
    return [[
      (appointment) => isAppointmentTakesAllDay(
        appointment,
        this.allDayPanelMode,
      ),
    ]];
  }

  _createCombinedFilter(filterOptions) {
    return [[getAppointmentFilter({
      ...filterOptions,
      allDayPanelMode: this.allDayPanelMode,
    }, this.timeZoneCalculator)]];
  }

  filterLoadedAppointments(filterOptions, preparedItems: AppointmentDataItem[]): SafeAppointment[] {
    const filteredItems = this.filterPreparedItems(filterOptions, preparedItems);
    return filteredItems.map(({ rawAppointment }) => rawAppointment);
  }

  filterPreparedItems(filterOptions, preparedItems: AppointmentDataItem[]): AppointmentDataItem[] {
    const combinedFilter = this._createCombinedFilter(filterOptions);

    // @ts-expect-error
    return query(preparedItems)
      // @ts-expect-error
      .filter(combinedFilter)
      .toArray();
  }

  filterAllDayAppointments(preparedItems: AppointmentDataItem[]): SafeAppointment[] {
    const combinedFilter = this._createAllDayAppointmentFilter();
    // @ts-expect-error
    return query(preparedItems)
      // @ts-expect-error
      .filter(combinedFilter)
      .toArray()
      .map(({ rawAppointment }) => rawAppointment);
  }
}
