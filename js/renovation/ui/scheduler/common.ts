import { utils } from '../../../ui/scheduler/utils';
import { SchedulerProps } from './props';
import { DataAccessorType } from './types';
import { TimeZoneCalculator } from './timeZoneCalculator/utils';
import timeZoneUtils from '../../../ui/scheduler/utils.timeZone';

export const createDataAccessors = (
  props: SchedulerProps,
  forceIsoDateParsing = false,
): DataAccessorType => utils.dataAccessors.create(
  {
    startDate: props.startDateExpr,
    endDate: props.endDateExpr,
    startDateTimeZone: props.startDateTimeZoneExpr,
    endDateTimeZone: props.endDateTimeZoneExpr,
    allDay: props.allDayExpr,
    text: props.textExpr,
    description: props.descriptionExpr,
    recurrenceRule: props.recurrenceRuleExpr,
    recurrenceException: props.recurrenceExceptionExpr,
  },
  null,
  forceIsoDateParsing,
  props.dateSerializationFormat,
) as DataAccessorType;

export const createTimeZoneCalculator = (
  currentTimeZone: string,
): TimeZoneCalculator => new TimeZoneCalculator({
  getClientOffset: (date: Date): number => timeZoneUtils.getClientTimezoneOffset(date),
  getCommonOffset: (
    date: Date,
  ): number => timeZoneUtils.calculateTimezoneByValue(
    currentTimeZone,
    date,
  ) as number,
  getAppointmentOffset: (
    date: Date,
    appointmentTimezone: string | undefined,
  ): number => timeZoneUtils.calculateTimezoneByValue(
    appointmentTimezone,
    date,
  ) as number,
});
