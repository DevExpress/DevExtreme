import query from '@js/common/data/query';
import { wrapToArray } from '@js/core/utils/array';
import dateUtils from '@js/core/utils/date';
import { map } from '@js/core/utils/iterator';
import { isDefined, isFunction } from '@js/core/utils/type';
import { dateUtilsTs } from '@ts/core/utils/date';
import type { AppointmentDataItem, SafeAppointment } from '@ts/scheduler/r1/types';
import {
  getDatesWithoutTime, hasResourceValue, isAppointmentTakesAllDay, isTimelineView,
} from '@ts/scheduler/r1/utils/index';
import type { AppointmentDataAccessor } from '@ts/scheduler/utils';

import { createAppointmentAdapter } from '../../m_appointment_adapter';
import { getRecurrenceProcessor } from '../../m_recurrence';
import {
  _appointmentPartInInterval,
  compareDateWithEndDayHour,
  compareDateWithStartDayHour,
  getAppointmentTakesSeveralDays,
  getRecurrenceException,
} from './m_utils';

// TODO Vinogradov refactoring: this module should be refactored :)

const toMs = dateUtils.dateToMilliseconds;

export class AppointmentFilterBaseStrategy {
  public static readonly strategyName: string = 'standard';

  options: any;

  dataAccessors: AppointmentDataAccessor;

  constructor(options) {
    this.options = options;
    this.dataAccessors = this.options.dataAccessors;
  }

  get timeZoneCalculator() { return this.options.timeZoneCalculator; }

  get viewStartDayHour() { return this.options.startDayHour; }

  get viewEndDayHour() { return this.options.endDayHour; }

  get timezone() { return this.options.timezone; }

  get firstDayOfWeek() { return this.options.firstDayOfWeek; }

  get showAllDayPanel() { return this.options.showAllDayPanel; }

  get loadedResources() { return this._resolveOption('loadedResources'); }

  get supportAllDayRow() { return this._resolveOption('supportAllDayRow'); }

  get viewType() { return this._resolveOption('viewType'); }

  get viewDirection() { return this._resolveOption('viewDirection'); }

  get dateRange() { return this._resolveOption('dateRange'); }

  get groupCount() { return this._resolveOption('groupCount'); }

  get viewDataProvider() { return this._resolveOption('viewDataProvider'); }

  get allDayPanelMode() { return this._resolveOption('allDayPanelMode'); }

  _resolveOption(name) {
    const result = this.options[name];
    return typeof result === 'function'
      ? result()
      : result;
  }

  filter(preparedItems: AppointmentDataItem[]): SafeAppointment[] {
    const [min, max] = this.dateRange;
    const { viewOffset } = this.options;
    const allDay = !this.showAllDayPanel && this.supportAllDayRow
      ? false
      : undefined;

    return this.filterLoadedAppointments({
      startDayHour: this.viewStartDayHour,
      endDayHour: this.viewEndDayHour,
      viewOffset,
      viewStartDayHour: this.viewStartDayHour,
      viewEndDayHour: this.viewEndDayHour,
      min,
      max,
      resources: this.loadedResources,
      allDay,
      supportMultiDayAppointments: isTimelineView(this.viewType),
      firstDayOfWeek: this.firstDayOfWeek,
    }, preparedItems);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasAllDayAppointments(filteredItems, preparedItems: AppointmentDataItem[]): boolean {
    return filteredItems
      .map((item) => createAppointmentAdapter(
        item,
        this.dataAccessors,
        this.timeZoneCalculator,
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
    const min = new Date(filterOptions.min);
    const max = new Date(filterOptions.max);
    const {
      startDayHour,
      endDayHour,
      viewOffset,
      viewStartDayHour,
      viewEndDayHour,
      resources,
      firstDayOfWeek,
      checkIntersectViewport,
      supportMultiDayAppointments,
    } = filterOptions;

    const [trimMin, trimMax] = getDatesWithoutTime(min, max);
    const useRecurrence = this.dataAccessors.has('recurrenceRule');

    return [[(appointment) => {
      const appointmentVisible = appointment.visible ?? true;

      if (!appointmentVisible) {
        return false;
      }

      const {
        allDay: isAllDay,
        hasRecurrenceRule,
      } = appointment;

      const startDate = dateUtilsTs.addOffsets(appointment.startDate, [-viewOffset]);
      const endDate = dateUtilsTs.addOffsets(appointment.endDate, [-viewOffset]);

      const appointmentTakesAllDay = isAppointmentTakesAllDay(
        appointment,
        this.allDayPanelMode,
      );

      if (!hasRecurrenceRule) {
        if (!(endDate >= trimMin && startDate < trimMax
                    || dateUtils.sameDate(endDate, trimMin)
                    && dateUtils.sameDate(startDate, trimMin))
        ) {
          return false;
        }
      }

      const appointmentTakesSeveralDays = getAppointmentTakesSeveralDays(appointment);
      const isLongAppointment = appointmentTakesSeveralDays || appointmentTakesAllDay;

      if (resources?.length && !this._filterAppointmentByResources(appointment.rawAppointment, resources)) {
        return false;
      }

      if (appointmentTakesAllDay && filterOptions.allDay === false) {
        return false;
      }

      if (hasRecurrenceRule) {
        const recurrenceException = getRecurrenceException(appointment, this.timeZoneCalculator, this.timezone);

        if (!this._filterAppointmentByRRule({
          ...appointment,
          recurrenceException,
          allDay: appointmentTakesAllDay,
        }, min, max, startDayHour, endDayHour, firstDayOfWeek)) {
          return false;
        }
      }

      if (!isAllDay && supportMultiDayAppointments && isLongAppointment) {
        if (endDate < min && (!useRecurrence || (useRecurrence && !hasRecurrenceRule))) {
          return false;
        }
      }

      if (!isAllDay && isDefined(startDayHour) && (!useRecurrence || !filterOptions.isVirtualScrolling)) {
        if (!compareDateWithStartDayHour(startDate, endDate, startDayHour, appointmentTakesAllDay, appointmentTakesSeveralDays)) {
          return false;
        }
      }

      if (!isAllDay && isDefined(endDayHour)) {
        if (!compareDateWithEndDayHour({
          startDate,
          endDate,
          startDayHour,
          endDayHour,
          viewOffset,
          viewStartDayHour,
          viewEndDayHour,
          allDay: appointmentTakesAllDay,
          severalDays: appointmentTakesSeveralDays,
          min,
          max,
          checkIntersectViewport,
        })) {
          return false;
        }
      }

      if (!isAllDay && (!isLongAppointment || supportMultiDayAppointments)) {
        if (endDate < min && useRecurrence && !hasRecurrenceRule) {
          return false;
        }
      }

      return true;
    }]];
  }

  _filterAppointmentByResources(appointment, resources) {
    const checkAppointmentResourceValues = (resourceName, resourceIndex) => {
      const resourceGetter = this.dataAccessors.resources.getter[resourceName];
      let resource;

      if (isFunction(resourceGetter)) {
        resource = resourceGetter(appointment);
      }

      const appointmentResourceValues = wrapToArray(resource);
      const resourceData: any[] = map(
        resources[resourceIndex].items,
        ({ id }) => id,
      );

      for (let i = 0; i < appointmentResourceValues.length; i++) {
        if (hasResourceValue(resourceData, appointmentResourceValues[i])) {
          return true;
        }
      }

      return false;
    };

    let result = false;

    for (let i = 0; i < resources.length; i++) {
      const resourceName = resources[i].name;

      result = checkAppointmentResourceValues(resourceName, i);

      if (!result) {
        return false;
      }
    }

    return result;
  }

  _filterAppointmentByRRule(appointment, min, max, startDayHour, endDayHour, firstDayOfWeek) {
    const { recurrenceRule } = appointment;
    const { recurrenceException } = appointment;
    const { allDay } = appointment;
    let result = true;
    const appointmentStartDate = appointment.startDate;
    const appointmentEndDate = appointment.endDate;
    const recurrenceProcessor = getRecurrenceProcessor();

    if (allDay || _appointmentPartInInterval(appointmentStartDate, appointmentEndDate, startDayHour, endDayHour)) {
      const [trimMin, trimMax] = getDatesWithoutTime(min, max);

      min = trimMin;
      max = new Date(trimMax.getTime() - toMs('minute'));
    }

    if (recurrenceRule && !recurrenceProcessor.isValidRecurrenceRule(recurrenceRule)) {
      result = (appointmentEndDate > min) && (appointmentStartDate <= max);
    }

    if (result && recurrenceProcessor.isValidRecurrenceRule(recurrenceRule)) {
      const { viewOffset } = this.options;
      result = recurrenceProcessor.hasRecurrence({
        rule: recurrenceRule,
        exception: recurrenceException,
        start: appointmentStartDate,
        end: appointmentEndDate,
        min: dateUtilsTs.addOffsets(min, [viewOffset]),
        max: dateUtilsTs.addOffsets(max, [viewOffset]),
        firstDayOfWeek,
        appointmentTimezoneOffset: this.timeZoneCalculator.getOriginStartDateOffsetInMs(
          appointmentStartDate,
          appointment.startDateTimeZone,
          false,
        ),
      });
    }

    return result;
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
