import type { Appointment } from '@js/ui/scheduler';
import { deepExtendArraySafe } from '@ts/core/utils/m_object';
import type { PathTimeZoneConversion, TimeZoneCalculator } from '@ts/scheduler/r1/timezone_calculator';

import { getRecurrenceProcessor } from '../../m_recurrence';
import type { AppointmentDataAccessor } from '../data_accessor/appointment_data_accessor';

export class AppointmentAdapter {
  constructor(
    public source: Appointment,
    public dataAccessors: AppointmentDataAccessor,
  ) {}

  // TODO: move this transformation to dataAccessor
  get startDate(): Date {
    const date = this.dataAccessors.get('startDate', this.source);
    return date === undefined ? date : new Date(date);
  }

  set startDate(value: Date) { this.dataAccessors.set('startDate', this.source, value); }

  get endDate(): Date {
    const date = this.dataAccessors.get('endDate', this.source);
    return date === undefined ? date : new Date(date);
  }

  set endDate(value: Date) { this.dataAccessors.set('endDate', this.source, value); }

  get allDay(): boolean { return Boolean(this.dataAccessors.get('allDay', this.source)); }

  set allDay(value: boolean) { this.dataAccessors.set('allDay', this.source, value); }

  get text(): string { return this.dataAccessors.get('text', this.source) ?? ''; }

  set text(value: string) { this.dataAccessors.set('text', this.source, value); }

  get description(): string { return this.dataAccessors.get('description', this.source) ?? ''; }

  set description(value: string) { this.dataAccessors.set('description', this.source, value); }

  get startDateTimeZone(): string | undefined { return this.dataAccessors.get('startDateTimeZone', this.source); }

  get endDateTimeZone(): string | undefined { return this.dataAccessors.get('endDateTimeZone', this.source); }

  get recurrenceRule(): string | undefined { return this.dataAccessors.get('recurrenceRule', this.source); }

  set recurrenceRule(value: string | undefined) { this.dataAccessors.set('recurrenceRule', this.source, value); }

  get recurrenceException(): string | undefined { return this.dataAccessors.get('recurrenceException', this.source); }

  set recurrenceException(value: string | undefined) { this.dataAccessors.set('recurrenceException', this.source, value); }

  get disabled(): boolean { return Boolean(this.dataAccessors.get('disabled', this.source)); }

  get duration(): number {
    const { startDate, endDate } = this;
    return endDate && startDate
      ? endDate.getTime() - startDate.getTime()
      : 0;
  }

  get isRecurrent(): boolean {
    return getRecurrenceProcessor().isValidRecurrenceRule(this.recurrenceRule);
  }

  clone(): AppointmentAdapter {
    return new AppointmentAdapter(
      deepExtendArraySafe({}, this.source, false, false, false, true),
      this.dataAccessors,
    );
  }

  serialize(): AppointmentAdapter {
    // getter of dataAccessors return serialized date
    this.dataAccessors.set('startDate', this.source, this.dataAccessors.get('startDate', this.source));
    this.dataAccessors.set('endDate', this.source, this.dataAccessors.get('endDate', this.source));
    return this;
  }

  getCalculatedDates(
    timeZoneCalculator: TimeZoneCalculator,
    path: PathTimeZoneConversion,
  ): { startDate: Date; endDate: Date } {
    return {
      startDate: timeZoneCalculator.createDate(this.startDate, path, this.startDateTimeZone),
      endDate: timeZoneCalculator.createDate(this.endDate, path, this.endDateTimeZone),
    };
  }

  calculateDates(
    timeZoneCalculator: TimeZoneCalculator,
    path: PathTimeZoneConversion,
  ): AppointmentAdapter {
    const { startDate, endDate } = this.getCalculatedDates(timeZoneCalculator, path);

    if (this.startDate) {
      this.startDate = startDate;
    }
    if (this.endDate) {
      this.endDate = endDate;
    }

    return this;
  }
}
