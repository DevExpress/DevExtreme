import dateUtils from '@js/core/utils/date';
import { isDefined } from '@js/core/utils/type';
import { dateUtilsTs } from '@ts/core/utils/date';

import { PathTimeZoneConversion } from './const';
import type { DateType, TimeZoneCalculatorOptions, TimeZoneOffsetsType } from './types';

const MS_IN_MINUTE = 60000;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const toMs = dateUtils.dateToMilliseconds;

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
        return this.getConvertedDate(date, info.appointmentTimeZone, false);

      case PathTimeZoneConversion.fromAppointmentToSource:
        return this.getConvertedDate(date, info.appointmentTimeZone, true);

      case PathTimeZoneConversion.fromSourceToGrid:
        return this.getConvertedDate(date, undefined, false);

      case PathTimeZoneConversion.fromGridToSource:
        return this.getConvertedDate(date, undefined, true);

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

  getOriginStartDateOffsetInMs(
    date: Date,
    timezone: string | undefined,
    isUTCDate: boolean,
  ): number {
    const offsetInHours = this.getOffsetInHours(date, timezone, isUTCDate);
    return offsetInHours * MS_IN_HOUR;
  }

  protected getOffsetInHours(date: Date, timezone: string | undefined, isUTCDate: boolean): number {
    const { client, appointment, common } = this.getOffsets(date, timezone);

    if (!!timezone && isUTCDate) {
      return appointment - client;
    }

    if (!!timezone && !isUTCDate) {
      return appointment - common;
    }

    if (!timezone && isUTCDate) {
      return common - client;
    }

    return 0;
  }

  protected getClientOffset(date: Date): number {
    return this.options.getClientOffset(date);
  }

  protected getCommonOffset(date: Date): number | undefined {
    return this.options.tryGetCommonOffset(date);
  }

  protected getAppointmentOffset(
    date: Date,
    appointmentTimezone: string | undefined,
  ): number | undefined {
    return this.options.tryGetAppointmentOffset(date, appointmentTimezone);
  }

  protected getConvertedDate(
    date: Date,
    appointmentTimezone: string | undefined,
    isBack: boolean,
  ): Date {
    const newDate = new Date(date.getTime());
    const offsets = this.getOffsets(newDate, appointmentTimezone);
    const targetOffsetName = appointmentTimezone ? 'appointment' : 'common';
    const direction = isBack ? -1 : 1;

    return dateUtilsTs.addOffsets(newDate, [
      direction * toMs('hour') * offsets[targetOffsetName],
      -direction * toMs('hour') * offsets.client,
    ]);
  }
}
