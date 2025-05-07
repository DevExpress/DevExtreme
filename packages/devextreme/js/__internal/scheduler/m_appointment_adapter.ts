import { extend } from '@js/core/utils/extend';
import { deepExtendArraySafe } from '@js/core/utils/object';
import errors from '@js/ui/widget/ui.errors';

import { getRecurrenceProcessor } from './m_recurrence';
import type { PathTimeZoneConversion, TimeZoneCalculator } from './r1/timezone_calculator';
import type { AppointmentDataAccessor } from './utils';

// TODO: express the type from PathTimeZoneConversion
type ConversionNames = 'toAppointment' | 'fromAppointment' | 'toGrid' | 'fromGrid';

// TODO Vinogradov refactoring: add types to this module.
const PROPERTY_NAMES = {
  startDate: 'startDate',
  endDate: 'endDate',
  allDay: 'allDay',
  text: 'text',
  description: 'description',
  startDateTimeZone: 'startDateTimeZone',
  endDateTimeZone: 'endDateTimeZone',
  recurrenceRule: 'recurrenceRule',
  recurrenceException: 'recurrenceException',
  disabled: 'disabled',
};
class AppointmentAdapter {
  constructor(
    public rawAppointment: any,
    public dataAccessors: AppointmentDataAccessor,
    public timeZoneCalculator: TimeZoneCalculator,
  ) {
  }

  get duration(): number {
    return this.endDate && this.startDate
      ? this.endDate.getTime() - this.startDate.getTime()
      : 0;
  }

  get startDate() {
    const result = this.getField<any>(PROPERTY_NAMES.startDate);
    return result === undefined ? result : new Date(result);
  }

  set startDate(value) {
    this.setField(PROPERTY_NAMES.startDate, value);
  }

  get endDate() {
    const result = this.getField<any>(PROPERTY_NAMES.endDate);
    return result === undefined ? result : new Date(result);
  }

  set endDate(value) {
    this.setField(PROPERTY_NAMES.endDate, value);
  }

  get allDay(): boolean {
    return Boolean(this.getField<boolean>(PROPERTY_NAMES.allDay));
  }

  set allDay(value: boolean) {
    this.setField(PROPERTY_NAMES.allDay, value);
  }

  get text() {
    return this.getField<string>(PROPERTY_NAMES.text);
  }

  set text(value: string) {
    this.setField(PROPERTY_NAMES.text, value);
  }

  get description() {
    return this.getField<string>(PROPERTY_NAMES.description);
  }

  set description(value: string) {
    this.setField(PROPERTY_NAMES.description, value);
  }

  get startDateTimeZone() {
    return this.getField(PROPERTY_NAMES.startDateTimeZone);
  }

  get endDateTimeZone() {
    return this.getField(PROPERTY_NAMES.endDateTimeZone);
  }

  get recurrenceRule() {
    return this.getField<string | undefined>(PROPERTY_NAMES.recurrenceRule);
  }

  set recurrenceRule(value) {
    this.setField(PROPERTY_NAMES.recurrenceRule, value);
  }

  get recurrenceException() {
    return this.getField<string | undefined>(PROPERTY_NAMES.recurrenceException);
  }

  set recurrenceException(value) {
    this.setField(PROPERTY_NAMES.recurrenceException, value);
  }

  get disabled() {
    return !!this.getField(PROPERTY_NAMES.disabled);
  }

  get isRecurrent() {
    return getRecurrenceProcessor().isValidRecurrenceRule(this.recurrenceRule);
  }

  private getField<T>(property: string): T {
    return this.dataAccessors.get(property, this.rawAppointment) as T;
  }

  private setField<T>(property: string, value: T): T {
    return this.dataAccessors.set(property, this.rawAppointment, value) as T;
  }

  calculateStartDate(pathTimeZoneConversion: ConversionNames) {
    if (!this.startDate || isNaN(this.startDate.getTime())) {
      throw errors.Error('E1032', this.text);
    }

    return this.calculateDate(this.startDate, this.startDateTimeZone, pathTimeZoneConversion);
  }

  calculateEndDate(pathTimeZoneConversion: ConversionNames) {
    return this.calculateDate(this.endDate, this.endDateTimeZone, pathTimeZoneConversion);
  }

  calculateDate(date, appointmentTimeZone, pathTimeZoneConversion: ConversionNames) {
    return this.timeZoneCalculator.createDate(date, {
      appointmentTimeZone,
      path: pathTimeZoneConversion as PathTimeZoneConversion,
    }) as Date;
  }

  clone(options?: { pathTimeZone: ConversionNames }) {
    const result = new AppointmentAdapter(
      deepExtendArraySafe({}, this.rawAppointment, false, false, false, true),
      this.dataAccessors,
      this.timeZoneCalculator,
    );

    if (options?.pathTimeZone) {
      result.calculateDates(options.pathTimeZone);
    }

    return result;
  }

  calculateDates(pathTimeZoneConversion: ConversionNames) {
    const startDate = this.calculateStartDate(pathTimeZoneConversion);
    const endDate = this.calculateEndDate(pathTimeZoneConversion);

    if (startDate) {
      this.startDate = startDate;
    }
    if (endDate) {
      this.endDate = endDate;
    }

    return this;
  }

  source(serializeDate = false) {
    if (serializeDate) {
      // hack for use dateSerializationFormat
      const clonedAdapter = this.clone();
      clonedAdapter.startDate = this.startDate;
      clonedAdapter.endDate = this.endDate;

      return clonedAdapter.source();
    }

    return extend({}, this.rawAppointment);
  }
}

export default AppointmentAdapter;

// TODO: refactor timezone to avoid optional calculator
export const createAppointmentAdapter = (rawAppointment, dataAccessors: AppointmentDataAccessor, timeZoneCalculator?: TimeZoneCalculator) => new AppointmentAdapter(rawAppointment, dataAccessors, timeZoneCalculator as TimeZoneCalculator);
