import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import type { Properties as DateBoxProperties } from '@js/ui/date_box';
import type { SimpleItem } from '@js/ui/form';

import { getRecurrenceString, parseRecurrenceRule } from '../recurrence/base';
import { daysFromByDayRule } from '../recurrence/days_from_by_day_rule';
import type { Rule } from '../recurrence/types';

// eslint-disable-next-line arrow-body-style
export const createFormIconTemplate = (iconName: string): (() => void) => {
  return (): dxElementWrapper => $('<i>').addClass('dx-icon').addClass(`dx-icon-${iconName}`);
};

export const getStartDateCommonConfig = (firstDayOfWeek: string): SimpleItem => ({
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
    },
  } as unknown as DateBoxProperties,
});

export class RecurrenceRule {
  private _recurrenceRule: Rule;

  private _untilValue: Date | null = null;

  private _countValue: number | null = null;

  constructor(rule: string) {
    this._recurrenceRule = parseRecurrenceRule(rule);
  }

  setUntilValue(value: Date): void {
    this._untilValue = value;
  }

  setCountValue(value: number): void {
    this._countValue = value;
  }

  getUntilValue(): Date | null {
    return this._untilValue;
  }

  getCountValue(): number | null {
    return this._countValue;
  }

  setRule(field: string, value: string | number | Date | null): void {
    if (!value || (Array.isArray(value) && !value.length)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this._recurrenceRule[field];
      return;
    }

    if (isDefined(field)) {
      if (field === 'until') {
        delete this._recurrenceRule.count;
      }

      if (field === 'count') {
        delete this._recurrenceRule.until;
      }

      this._recurrenceRule[field] = value;
    }
  }

  getRepeatEndRule(): string {
    const rules = this._recurrenceRule;

    if ('count' in rules) {
      return 'count';
    }

    if ('until' in rules) {
      return 'until';
    }

    return 'never';
  }

  getRecurrenceString(): string | undefined {
    return getRecurrenceString(this._recurrenceRule);
  }

  getRules(): Rule {
    return this._recurrenceRule;
  }

  getRule(field: string): string | number | Date | null | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._recurrenceRule[field];
  }

  getDaysFromByDayRule(): string[] {
    return daysFromByDayRule(this._recurrenceRule);
  }
}
