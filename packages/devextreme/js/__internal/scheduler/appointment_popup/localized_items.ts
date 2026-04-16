import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import { capitalize } from '@ts/core/utils/capitalize';

export const REPEAT_NEVER_VALUE = 'never';
export const ICAL_WEEK_DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

interface TextValueItem {
  text: string;
  value: string;
}

interface MonthItem {
  value: number;
  text: string;
}

interface WeekDayItem {
  text: string;
  key: string;
}

const repeatSelectItemDefs = [
  {
    messageId: 'dxScheduler-recurrenceNever',
    value: REPEAT_NEVER_VALUE,
  }, {
    messageId: 'dxScheduler-recurrenceHourly',
    value: 'hourly',
  }, {
    messageId: 'dxScheduler-recurrenceDaily',
    value: 'daily',
  }, {
    messageId: 'dxScheduler-recurrenceWeekly',
    value: 'weekly',
  }, {
    messageId: 'dxScheduler-recurrenceMonthly',
    value: 'monthly',
  }, {
    messageId: 'dxScheduler-recurrenceYearly',
    value: 'yearly',
  },
] as const;

const recurrenceFrequencyItemDefs = [
  {
    messageId: 'dxScheduler-recurrenceRepeatHourly',
    value: 'hourly',
  }, {
    messageId: 'dxScheduler-recurrenceRepeatDaily',
    value: 'daily',
  }, {
    messageId: 'dxScheduler-recurrenceRepeatWeekly',
    value: 'weekly',
  }, {
    messageId: 'dxScheduler-recurrenceRepeatMonthly',
    value: 'monthly',
  }, {
    messageId: 'dxScheduler-recurrenceRepeatYearly',
    value: 'yearly',
  },
] as const;

export const getRepeatSelectItems = (): TextValueItem[] => repeatSelectItemDefs
  .map((item) => ({
    text: messageLocalization.format(item.messageId),
    value: item.value,
  }));

export const getRecurrenceFrequencyItems = (): TextValueItem[] => recurrenceFrequencyItemDefs
  .map((item) => ({
    text: capitalize(
      messageLocalization.format(item.messageId),
    ),
    value: item.value,
  }));

export const getRecurrenceMonthItems = (): MonthItem[] => dateLocalization
  .getMonthNames()
  .map((monthName, index) => ({
    value: index + 1,
    text: monthName,
  }));

export const getRecurrenceWeekDayItems = (
  firstDayOfWeek?: number,
): WeekDayItem[] => {
  const localizedDayNames = dateLocalization.getDayNames('abbreviated');
  const orderedWeekDayItems = ICAL_WEEK_DAYS.map((day, index) => ({
    text: localizedDayNames[index].slice(0, 1).toUpperCase(),
    key: day,
  }));
  const validFirstDayOfWeek = firstDayOfWeek ?? dateLocalization.firstDayOfWeekIndex();

  return orderedWeekDayItems
    .slice(validFirstDayOfWeek)
    .concat(orderedWeekDayItems.slice(0, validFirstDayOfWeek));
};
