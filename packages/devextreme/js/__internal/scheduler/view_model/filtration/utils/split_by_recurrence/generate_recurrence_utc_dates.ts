import { dateUtilsTs } from '@ts/core/utils/date';
import * as rrule from 'rrule';

import { parseRecurrenceRule } from '../../../../recurrence/base';
import type { DateInterval, MinimalAppointmentEntity } from '../../../types';
import { getDateOffsetMs } from './get_date_information';

const { RRule, RRuleSet } = rrule;

interface Options {
  firstDayOfWeek?: number;
  interval: DateInterval;
  timeZone: string;
  startDateTimeZone?: string;
}

const WEEK_DAY_NUMBERS = [6, 0, 1, 2, 3, 4, 5];

export const generateRecurrenceUTCDates = <
  T extends Pick<MinimalAppointmentEntity, 'source' | 'recurrenceRule' | 'hasRecurrenceRule'>,
>(
  appointment: T,
  {
    firstDayOfWeek,
    interval,
    timeZone,
    startDateTimeZone,
  }: Options,
): number[] => {
  if (!appointment.hasRecurrenceRule || !appointment.recurrenceRule) {
    return [appointment.source.startDate];
  }

  const startDateOffset = getDateOffsetMs(appointment.source.startDate, startDateTimeZone);
  const targetOffset = getDateOffsetMs(appointment.source.startDate, timeZone);
  const startDateOffsetBase = startDateTimeZone
    ? startDateOffset - targetOffset
    : targetOffset;
  // NOTE: Add offset only for correct recurrence calculation for rule with BYDAY=MO,WE,FR
  // Target time zone day and UTC day are different
  const duration = appointment.source.endDate - appointment.source.startDate;
  const start = appointment.source.startDate + startDateOffsetBase;

  // NOTE: interval dates already have target time zone offset
  const min = interval.min - duration - targetOffset + startDateOffsetBase;
  const max = interval.max - targetOffset + startDateOffsetBase;

  const rule = parseRecurrenceRule(appointment.recurrenceRule);
  const ruleOptions = RRule.parseString(appointment.recurrenceRule);
  ruleOptions.dtstart = new Date(start);

  if (!ruleOptions.wkst && firstDayOfWeek) {
    ruleOptions.wkst = WEEK_DAY_NUMBERS[firstDayOfWeek];
  }

  if (rule.until) {
    const untilOffset = getDateOffsetMs(rule.until.getTime(), timeZone);
    ruleOptions.until = dateUtilsTs.addOffsets(rule.until, untilOffset);
  }

  const rRuleSet = new RRuleSet();
  const rRule = new RRule(ruleOptions);
  rRuleSet.rrule(rRule);

  return rRuleSet
    .between(new Date(min), new Date(max), true)
    .map((date) => date.getTime() - startDateOffsetBase);
};
