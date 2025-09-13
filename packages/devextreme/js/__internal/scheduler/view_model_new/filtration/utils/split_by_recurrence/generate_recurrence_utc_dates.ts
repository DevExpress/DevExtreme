import { dateUtilsTs } from '@ts/core/utils/date';
import { RRule, RRuleSet } from 'rrule';

import { parseRecurrenceRule } from '../../../../recurrence/base';
import type { DateInterval, MinimalAppointmentEntity } from '../../../types';

interface Options {
  firstDayOfWeek?: number;
  interval: DateInterval;
  startDateOffsetBase: number;
}

const WEEK_DAY_NUMBERS = [6, 0, 1, 2, 3, 4, 5];

export const generateRecurrenceUTCDates = <T extends MinimalAppointmentEntity >(
  appointment: T,
  {
    firstDayOfWeek,
    interval,
    startDateOffsetBase,
  }: Options,
): number[] => {
  if (!appointment.hasRecurrenceRule || !appointment.recurrenceRule) {
    return [appointment.startDateUTC];
  }

  // NOTE: Add offset only for correct recurrence calculation for rule with BYDAY=MO,WE,FR
  // Target time zone day and UTC day are different
  const duration = appointment.endDateUTC - appointment.startDateUTC;
  const start = appointment.startDateUTC + startDateOffsetBase;
  const min = interval.min + startDateOffsetBase - duration;
  const max = interval.max + startDateOffsetBase;

  const rule = parseRecurrenceRule(appointment.recurrenceRule);
  const ruleOptions = RRule.parseString(appointment.recurrenceRule);
  ruleOptions.dtstart = new Date(start);

  if (!ruleOptions.wkst && firstDayOfWeek) {
    ruleOptions.wkst = WEEK_DAY_NUMBERS[firstDayOfWeek];
  }

  if (rule.until) {
    ruleOptions.until = dateUtilsTs.addOffsets(rule.until, startDateOffsetBase);
  }

  const rRuleSet = new RRuleSet();
  const rRule = new RRule(ruleOptions);
  rRuleSet.rrule(rRule);

  return rRuleSet
    .between(new Date(min), new Date(max), true)
    .map((date) => date.getTime() - startDateOffsetBase);
};
