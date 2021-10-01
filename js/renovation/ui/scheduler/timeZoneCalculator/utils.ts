import { isDefined } from '../../../../core/utils/type';
import dateUtils from '../../../../core/utils/date';
import {
  DateType,
  PathTimeZoneConversion,
  TimeZoneCalculatorOptions,
  TimeZoneOffsetsType,
} from './types';

export class TimeZoneCalculator {
  options: TimeZoneCalculatorOptions;

  constructor(options: TimeZoneCalculatorOptions) {
    this.options = options;
  }

  createDate(
    sourceDate: DateType,
    info: { path: PathTimeZoneConversion; appointmentTimeZone?: string },
  ): Date | undefined {
    const date = new Date(sourceDate);

    switch (info.path) {
      case PathTimeZoneConversion.fromSourceToAppointment:
        return this.getConvertedDate(date, info.appointmentTimeZone, true, false);

      case PathTimeZoneConversion.fromAppointmentToSource:
        return this.getConvertedDate(date, info.appointmentTimeZone, true, true);

      case PathTimeZoneConversion.fromSourceToGrid:
        return this.getConvertedDate(date, info.appointmentTimeZone, false, false);

      case PathTimeZoneConversion.fromGridToSource:
        return this.getConvertedDate(date, info.appointmentTimeZone, false, true);

      default:
        throw new Error('not specified pathTimeZoneConversion');
    }
  }

  getOffsets(date: Date, appointmentTimezone: string | undefined): TimeZoneOffsetsType {
    const clientOffset = -this.getClientOffset(date) / dateUtils.dateToMilliseconds('hour');
    const commonOffset = this.getCommonOffset(date);
    const appointmentOffset = this.getAppointmentOffset(date, appointmentTimezone);

    return {
      client: clientOffset,
      common: !isDefined(commonOffset) ? clientOffset : commonOffset,
      appointment: typeof appointmentOffset !== 'number' ? clientOffset : appointmentOffset,
    };
  }

  // QUnit tests are checked call of this method
  // eslint-disable-next-line class-methods-use-this
  getConvertedDateByOffsets(
    date: Date,
    clientOffset: number,
    targetOffset: number,
    isBack: boolean,
  ): Date {
    const direction = isBack
      ? -1
      : 1;

    const utcDate = date.getTime() - direction * clientOffset * dateUtils.dateToMilliseconds('hour');

    return new Date(utcDate + direction * targetOffset * dateUtils.dateToMilliseconds('hour'));
  }

  protected getClientOffset(date: Date): number {
    return this.options.getClientOffset(date);
  }

  protected getCommonOffset(date: Date): number {
    return this.options.getCommonOffset(date);
  }

  protected getAppointmentOffset(
    date: Date,
    appointmentTimezone: string | undefined,
  ): number {
    return this.options.getAppointmentOffset(date, appointmentTimezone);
  }

  protected getConvertedDate(
    date: Date,
    appointmentTimezone: string | undefined,
    useAppointmentTimeZone: boolean,
    isBack: boolean,
  ): Date {
    const newDate = new Date(date.getTime());
    const offsets = this.getOffsets(newDate, appointmentTimezone);

    if (useAppointmentTimeZone && !!appointmentTimezone) {
      return this.getConvertedDateByOffsets(date, offsets.client, offsets.appointment, isBack);
    }

    return this.getConvertedDateByOffsets(date, offsets.client, offsets.common, isBack);
  }
}
