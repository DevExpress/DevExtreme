import dateLocalization from '@js/common/core/localization/date';
import dateUtils from '@js/core/utils/date';
import { isFunction, isObject } from '@js/core/utils/type';
import messageLocalization from '@js/localization/message';
import type { DateNavigatorTextInfo, Properties } from '@js/ui/scheduler';
import type { BaseFormat } from '@ts/core/localization/date';
import { camelize } from '@ts/core/utils/m_inflector';
import type { IntervalOptions, Step } from '@ts/scheduler/header/types';
import type { NormalizedView, RawViewType, ViewType } from '@ts/scheduler/utils/options/types';
import {
  getDateAfterVisibleDays,
  getFirstVisibleDate,
  isDateSkipped,
} from '@ts/scheduler/utils/skipped_days';

import type { Direction } from './constants';

const DAY_FORMAT = 'd';

const {
  correctDateWithUnitBeginning: getPeriodStart,
  getFirstWeekDate: getWeekStart,
  getLastMonthDay,
  addDateInterval,
} = dateUtils;

const {
  format: formatDate,
} = dateLocalization;

const MS_DURATION = { milliseconds: 1 };
const DAY_DURATION = { days: 1 };
const WEEK_DURATION = { days: 7 };

const subMS = (date: Date): Date => addDateInterval(date, MS_DURATION, -1);

const addMS = (date: Date): Date => addDateInterval(date, MS_DURATION, 1);

const nextDay = (date: Date): Date => addDateInterval(date, DAY_DURATION, 1);

export const nextWeek = (date: Date): Date => addDateInterval(date, WEEK_DURATION, 1);

const nextMonth = (date: Date): Date => {
  const days = getLastMonthDay(date);

  return addDateInterval(date, { days }, 1);
};

const getWorkWeekStart = (
  date: Date,
  firstDayOfWeek: number | undefined,
  skippedDays: number[],
): Date => getFirstVisibleDate(
  getWeekStart(date, firstDayOfWeek),
  skippedDays,
  nextDay,
);

const getDateAfterWorkWeek = (
  workWeekStart: Date,
  firstDayOfWeek: number | undefined,
  skippedDays: number[],
): Date => {
  const weekStart = getWeekStart(workWeekStart, firstDayOfWeek);
  let lastVisibleDate = addDateInterval(weekStart, { days: 6 }, 1);
  while (isDateSkipped(lastVisibleDate, skippedDays)) {
    lastVisibleDate = addDateInterval(lastVisibleDate, DAY_DURATION, -1);
  }

  return nextDay(lastVisibleDate);
};

const nextAgendaStart = (
  date: Date,
  agendaDuration: number,
): Date => addDateInterval(date, { days: agendaDuration }, 1);

const getIntervalStartDate = (options: IntervalOptions): Date => {
  const {
    date, step, firstDayOfWeek, skippedDays,
  } = options;

  switch (step) {
    case 'day':
    case 'month':
      return getPeriodStart(date, step, false, firstDayOfWeek) as Date;
    case 'week': {
      const weekStart = getPeriodStart(date, step, false, firstDayOfWeek) as Date;
      if (skippedDays.length > 0) {
        return getFirstVisibleDate(weekStart, skippedDays, nextDay);
      }
      return weekStart;
    }
    case 'workWeek':
      return getWorkWeekStart(date, firstDayOfWeek, skippedDays);
    case 'agenda':
      return new Date(date);
    default:
      return new Date(date);
  }
};

const getPeriodEndDate = (
  currentPeriodStartDate: Date,
  step: Step,
  agendaDuration: number,
  skippedDays: number[],
  firstDayOfWeek: number | undefined,
): Date => {
  const calculators: Record<Step, () => Date> = {
    day: () => nextDay(currentPeriodStartDate),
    week: () => (skippedDays.length > 0
      ? getDateAfterVisibleDays(
        currentPeriodStartDate,
        7 - skippedDays.length,
        skippedDays,
        nextDay,
      )
      : nextWeek(currentPeriodStartDate)),
    month: () => nextMonth(currentPeriodStartDate),
    workWeek: () => getDateAfterWorkWeek(currentPeriodStartDate, firstDayOfWeek, skippedDays),
    agenda: () => nextAgendaStart(currentPeriodStartDate, agendaDuration),
  };

  return subMS(calculators[step]());
};

const getNextPeriodStartDate = (
  currentPeriodEndDate: Date,
  step: Step,
  skippedDays: number[],
): Date => {
  let date = addMS(currentPeriodEndDate);

  if (step === 'workWeek') {
    date = getFirstVisibleDate(date, skippedDays, nextDay);
  } else if (step === 'week' && skippedDays.length > 0) {
    date = getFirstVisibleDate(date, skippedDays, nextDay);
  }

  return date;
};

const getIntervalEndDate = (startDate: Date, options: IntervalOptions): Date => {
  const {
    intervalCount, step, agendaDuration, skippedDays, firstDayOfWeek,
  } = options;

  let periodStartDate = new Date(startDate);
  let periodEndDate = new Date(startDate);
  let nextPeriodStartDate = new Date(startDate);

  for (let i = 0; i < intervalCount; i += 1) {
    periodStartDate = nextPeriodStartDate;

    periodEndDate = getPeriodEndDate(
      periodStartDate,
      step,
      agendaDuration ?? 0,
      skippedDays,
      firstDayOfWeek,
    );

    nextPeriodStartDate = getNextPeriodStartDate(periodEndDate, step, skippedDays);
  }

  return periodEndDate;
};

const getNextMonthDate = (date: Date, intervalCount: number, direction: Direction): Date => {
  const currentDate = date.getDate();

  const currentMonthFirstDate = new Date(new Date(date.getTime()).setDate(1));
  const thatMonthFirstDate = new Date(
    currentMonthFirstDate
      .setMonth(currentMonthFirstDate.getMonth() + intervalCount * direction),
  );
  const thatMonthDuration = getLastMonthDay(thatMonthFirstDate);

  const minDate = currentDate < thatMonthDuration ? currentDate : thatMonthDuration;

  const currentMonthMinDate = new Date(new Date(date.getTime()).setDate(minDate));
  const thatMonthMinDate = new Date(
    currentMonthMinDate
      .setMonth(currentMonthMinDate.getMonth() + intervalCount * direction),
  );

  return thatMonthMinDate;
};

export const getNextIntervalDate = (options: IntervalOptions, direction: Direction): Date => {
  const {
    date, step, intervalCount, agendaDuration,
  } = options;

  let dayDuration = 0;
  // eslint-disable-next-line default-case
  switch (step) {
    case 'day':
      dayDuration = Number(intervalCount);
      break;
    case 'week':
    case 'workWeek':
      dayDuration = 7 * intervalCount;
      break;
    case 'agenda':
      dayDuration = agendaDuration ?? 0;
      break;
    case 'month':
      return getNextMonthDate(date, intervalCount, direction);
  }

  return addDateInterval(date, { days: dayDuration }, direction);
};

const getDateMonthFormatter = (isShort: boolean) => {
  const monthType = isShort ? 'abbreviated' : 'wide';
  const months = dateLocalization.getMonthNames(monthType as BaseFormat);

  return (date: Date): string => {
    const day = formatDate(date, 'day');

    const month = months[date.getMonth()];

    return `${day} ${month}`;
  };
};

const formatMonthYear = (date: Date): string => {
  const months = dateLocalization.getMonthNames('abbreviated');
  const month = months[date.getMonth()];

  const year = formatDate(date, 'year');

  return `${month} ${year}`;
};

const getDateMonthYearFormatter = (isShort: boolean) => (date: Date): string => {
  const dateMonthFormat = getDateMonthFormatter(isShort);
  const dateMonth = dateMonthFormat(date);

  const year = formatDate(date, 'year');

  return `${dateMonth} ${year}`;
};

const getDifferentYearCaption = (startDate: Date, endDate: Date): string => {
  const firstDateText = formatDate(startDate, getDateMonthYearFormatter(true));
  const lastDateDateText = formatDate(endDate, getDateMonthYearFormatter(true));

  return `${firstDateText}-${lastDateDateText}`;
};

export const getCaptionInterval = (options: IntervalOptions): {
  startDate: Date;
  endDate: Date;
} => {
  const startDate = getIntervalStartDate(options);
  const endDate = getIntervalEndDate(startDate, options);

  return { startDate, endDate };
};

const getSameYearCaption = (startDate: Date, endDate: Date, isShort: boolean): string => {
  const isDifferentMonthDates = startDate.getMonth() !== endDate.getMonth();
  const useShortFormat = isDifferentMonthDates || isShort;

  const firstDateFormat = isDifferentMonthDates
    ? getDateMonthFormatter(useShortFormat)
    : DAY_FORMAT;

  const firstDateText = formatDate(startDate, firstDateFormat);
  const lastDateText = formatDate(endDate, getDateMonthYearFormatter(useShortFormat));

  return `${firstDateText}-${lastDateText}`;
};

const getSameDateCaption = (date: Date, step, isShort: boolean): string => {
  const useShortFormat = step === 'agenda' ? isShort : false;

  const dateMonthFormat = getDateMonthFormatter(useShortFormat);

  const dateMonth = dateMonthFormat(date);
  const year = formatDate(date, 'year');

  return `${dateMonth} ${year}`;
};

const formatCaptionByMonths = (startDate: Date, endDate: Date, isShort: boolean): string => {
  const isDifferentYears = startDate.getFullYear() !== endDate.getFullYear();

  if (isDifferentYears) {
    return getDifferentYearCaption(startDate, endDate);
  }

  return getSameYearCaption(startDate, endDate, isShort);
};

const formatMonthViewCaption = (startDate: Date, endDate: Date): string => {
  if (dateUtils.sameMonth(startDate, endDate)) {
    return String(formatDate(startDate, 'monthandyear') ?? '');
  }

  const isSameYear = dateUtils.sameYear(startDate, endDate);

  const firstDateText = isSameYear
    ? dateLocalization.getMonthNames('abbreviated')[startDate.getMonth()]
    : formatMonthYear(startDate);
  const lastDateText = formatMonthYear(endDate);

  return `${firstDateText}-${lastDateText}`;
};

const getCaptionText = (startDate: Date, endDate: Date, isShort: boolean, step): string => {
  if (dateUtils.sameDate(startDate, endDate)) {
    return getSameDateCaption(startDate, step, isShort);
  }

  if (step === 'month') {
    return formatMonthViewCaption(startDate, endDate);
  }

  return formatCaptionByMonths(startDate, endDate, isShort);
};

export const getCaption = (options: IntervalOptions, isShort: boolean, customizationFunction?: Properties['customizeDateNavigatorText']): DateNavigatorTextInfo => {
  const { startDate, endDate } = getCaptionInterval(options);

  let text = getCaptionText(startDate, endDate, isShort, options.step);

  if (isFunction(customizationFunction)) {
    text = customizationFunction({ startDate, endDate, text });
  }

  return { startDate, endDate, text };
};

const STEP_MAP: Record<ViewType, Step> = {
  day: 'day',
  week: 'week',
  workWeek: 'workWeek',
  month: 'month',
  timelineDay: 'day',
  timelineWeek: 'week',
  timelineWorkWeek: 'workWeek',
  timelineMonth: 'month',
  agenda: 'agenda',
} as const;

export const getViewName = (view: RawViewType): string | undefined => {
  if (isObject(view)) {
    return view.name ?? view.type;
  }

  return view;
};

export const getViewText = (
  view: NormalizedView,
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
): string => view.name || messageLocalization.format(`dxScheduler-switcher${camelize(view.type, true)}`);

export const formatViews = (
  views: NormalizedView[],
): NormalizedView[] => views.map((view) => ({
  ...view,
  name: getViewName(view),
  text: getViewText(view),
}));

export const getStep = (type: ViewType): Step => STEP_MAP[type];
