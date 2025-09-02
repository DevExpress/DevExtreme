import {
  isAppointmentTakesAllDay,
} from '../../r1/utils/index';
import type { AppointmentDataItem, SafeAppointment } from '../../types';
import { AppointmentAdapter } from '../../utils/appointment_adapter/appointment_adapter';
import type { AppointmentDataAccessor } from '../../utils/data_accessor/appointment_data_accessor';
import { shiftIntervals } from '../../view_model_new/common/shift_intervals';
import { getVisibleDateTimeIntervals } from '../../view_model_new/filtration/utils/get_filter_options/get_visible_date_time_intervals';
import type ViewDataProvider from '../../workspaces/view_model/m_view_data_provider';
import {
  filterArray,
  getAppointmentFilter,
  getRawAppointments,
} from './utils/index';
import type {
  CombinedFilter, CompareOptions, DateInterval, FilterOptions,
} from './utils/type';

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

  protected getIntervals(compareOptions: CompareOptions): {
    visibleDateIntervals: DateInterval[];
    visibleTimeIntervals: DateInterval[];
  } {
    const viewOffset = this._resolveOption('viewOffset');
    const intervals = {
      visibleDateIntervals: getVisibleDateTimeIntervals(compareOptions, true),
      visibleTimeIntervals: getVisibleDateTimeIntervals(compareOptions, false),
    };
    intervals.visibleDateIntervals = shiftIntervals(intervals.visibleDateIntervals, viewOffset);
    intervals.visibleTimeIntervals = shiftIntervals(intervals.visibleTimeIntervals, viewOffset);
    return intervals;
  }

  protected getFilterOptions(): FilterOptions {
    const [min, max] = this.dateRange;
    const allDayPanelFilter = !this.showAllDayPanel && this.supportAllDayRow
      ? false
      : undefined;
    const compareOptions: CompareOptions = {
      startDayHour: this.viewStartDayHour,
      endDayHour: this.viewEndDayHour,
      min: new Date(min).getTime(),
      max: new Date(max).getTime(),
    };

    return {
      ...compareOptions,
      ...this.getIntervals(compareOptions),
      resources: this.options.getResourceManager().groupResources(),
      firstDayOfWeek: this.firstDayOfWeek,
      allDayPanelFilter,
      allDayPanelMode: this.allDayPanelMode,
      supportAllDayRow: this.supportAllDayRow,
      viewOffset: this._resolveOption('viewOffset'),
    };
  }

  filter(preparedItems: AppointmentDataItem[]): SafeAppointment[] {
    const filterOptions = this.getFilterOptions();
    const combinedFilter = this.createCombinedFilter(filterOptions);
    const filteredItems = filterArray(preparedItems, combinedFilter);

    return getRawAppointments(filteredItems);
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

  protected createCombinedFilter(
    filterOptions: FilterOptions,
  ): CombinedFilter {
    return [[getAppointmentFilter(filterOptions, this.timeZoneCalculator)]];
  }
}
