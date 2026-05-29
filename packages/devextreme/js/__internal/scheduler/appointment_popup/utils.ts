/* eslint-disable spellcheck/spell-checker */
import type { DayOfWeek } from '@js/common';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { isDefined } from '@js/core/utils/type';
import type { Properties as DateBoxProperties } from '@js/ui/date_box';
import type { SimpleItem } from '@js/ui/form';

import { getImageContainer } from '../../core/utils/m_icon';
import { getRecurrenceString, parseRecurrenceRule } from '../recurrence/base';
import { daysFromByDayRule } from '../recurrence/days_from_by_day_rule';
import type { Rule } from '../recurrence/types';

export const createFormIconTemplate = (iconName: string): () => dxElementWrapper => (): dxElementWrapper => getImageContainer(iconName) ?? $('<div>').addClass('dx-scheduler-form-icon-sized-gap');

export const getStartDateCommonConfig = (firstDayOfWeek: DayOfWeek): SimpleItem => ({
  colSpan: 1,
  itemType: 'simple',
  editorType: 'dxDateBox',
  validationRules: [{
    type: 'required',
  }],
  editorOptions: {
    type: 'date',
    useMaskBehavior: true,
    calendarOptions: {
      firstDayOfWeek,
      showTodayButton: true,
    },
  } as unknown as DateBoxProperties,
});

export class RecurrenceRule {
  startDate: Date | null = null;

  frequency: string | null = null;

  interval!: number;

  until!: Date | null;

  count!: number | null;

  byDay!: string[];

  byMonthDay!: number | null;

  byMonth!: number | null;

  repeatEnd!: 'never' | 'count' | 'until';

  constructor(rule: string, startDate: Date | null) {
    const recurrenceRule = parseRecurrenceRule(rule);
    const todayEnd = dateUtils.setToDayEnd(new Date());

    this.startDate = startDate;
    this.frequency = recurrenceRule.freq?.toLowerCase() ?? null;
    this.interval = recurrenceRule.interval ?? 1;

    this.until = recurrenceRule.until ?? todayEnd;
    this.count = recurrenceRule.count ?? 1;

    this.byDay = daysFromByDayRule(recurrenceRule);
    this.byMonthDay = recurrenceRule.bymonthday
      ? Number(recurrenceRule.bymonthday)
      : startDate?.getDate() ?? 1;

    this.byMonth = recurrenceRule.bymonth
      ? Number(recurrenceRule.bymonth)
      : (this.startDate?.getMonth() ?? 0) + 1;

    this.repeatEnd = 'never';
    if (isDefined(recurrenceRule.count)) {
      this.repeatEnd = 'count';
    } else if (isDefined(recurrenceRule.until)) {
      this.repeatEnd = 'until';
    }
  }

  toString(): string | undefined {
    if (!this.frequency) {
      return undefined;
    }

    const rule: Rule = { freq: this.frequency, interval: this.interval };

    if (this.repeatEnd === 'until' && this.until) {
      rule.until = this.until;
    } else if (this.repeatEnd === 'count' && this.count) {
      rule.count = this.count;
    }

    switch (this.frequency) {
      case 'weekly':
        rule.byday = this.byDay.join(',');
        break;
      case 'monthly':
        if (this.byMonthDay) {
          rule.bymonthday = String(this.byMonthDay);
        }
        break;
      case 'yearly':
        if (this.byMonthDay && this.byMonth) {
          rule.bymonthday = String(this.byMonthDay);
          rule.bymonth = String(this.byMonth);
        }
        break;
      default:
    }

    return getRecurrenceString(rule);
  }
}
