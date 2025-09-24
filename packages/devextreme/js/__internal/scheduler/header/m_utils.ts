import dateLocalization from '@js/common/core/localization/date';
import dateUtils from '@js/core/utils/date';
import { isFunction, isObject } from '@js/core/utils/type';
import messageLocalization from '@js/localization/message';
import type { DateNavigatorTextInfo, Properties } from '@js/ui/scheduler';
import type { IntervalOptions, Step } from '@ts/scheduler/header/types';
import type { NormalizedView, RawViewType, ViewType } from '@ts/scheduler/utils/options/types';

import type { Direction } from './constants';

const DAY_FORMAT = 'd';

const DAYS_IN_WORK_WEEK = 5;

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

const SATURDAY_INDEX = 6;
const SUNDAY_INDEX = 0;

const subMS = (date: Date): Date => addDateInterval(date, MS_DURATION, -1);

const addMS = (date: Date): Date => addDateInterval(date, MS_DURATION, 1);

const nextDay = (date: Date): Date => addDateInterval(date, DAY_DURATION, 1);

export const nextWeek = (date: Date): Date => addDateInterval(date, WEEK_DURATION, 1);

const nextMonth = (date: Date): Date => {
  const days = getLastMonthDay(date);

  return addDateInterval(date, { days }, 1);
};

const isWeekend = (date: Date): boolean => [SATURDAY_INDEX, SUNDAY_INDEX].includes(date.getDay());

const getWorkWeekStart = (firstDayOfWeek: Date): Date => {
  let date = new Date(firstDayOfWeek);
  while (isWeekend(date)) {
    date = nextDay(date);
  }

  return date;
};

const getDateAfterWorkWeek = (workWeekStart: Date): Date => {
  let date = new Date(workWeekStart);

  let workDaysCount = 0;
  while (workDaysCount < DAYS_IN_WORK_WEEK) {
    if (!isWeekend(date)) {
      workDaysCount++;
    }

    date = nextDay(date);
  }

  return date;
};

const nextAgendaStart = (date: Date, agendaDuration: number): Date => addDateInterval(date, { days: agendaDuration }, 1);

const getIntervalStartDate = (options: IntervalOptions) => {
  const { date, step, firstDayOfWeek } = options;

  // eslint-disable-next-line default-case
  switch (step) {
    case 'day':
    case 'week':
    case 'month':
      return getPeriodStart(date, step, false, firstDayOfWeek);
    case 'workWeek':
      // eslint-disable-next-line no-case-declarations
      const firstWeekDay = getWeekStart(date, firstDayOfWeek);
      return getWorkWeekStart(firstWeekDay);
    case 'agenda':
      return new Date(date);
  }
};

const getIntervalEndDate = (startDate: Date, options: IntervalOptions) => {
  const { intervalCount, step, agendaDuration } = options;

  let periodStartDate;
  let periodEndDate;
  let nextPeriodStartDate = new Date(startDate);

  for (let i = 0; i < intervalCount; i++) {
    periodStartDate = nextPeriodStartDate;

    periodEndDate = getPeriodEndDate(periodStartDate, step, agendaDuration!);

    nextPeriodStartDate = getNextPeriodStartDate(periodEndDate, step);
  }

  return periodEndDate;
};

export const getCaptionInterval = (options: IntervalOptions): {
  startDate: Date;
  endDate: Date;
} => {
  const startDate = getIntervalStartDate(options);
  const endDate = getIntervalEndDate(startDate, options);

  return { startDate, endDate };
};

const getPeriodEndDate = (currentPeriodStartDate: Date, step: Step, agendaDuration: number): Date => {
  let date;

  // eslint-disable-next-line default-case
  switch (step) {
    case 'day':
      date = nextDay(currentPeriodStartDate);
      break;
    case 'week':
      date = nextWeek(currentPeriodStartDate);
      break;
    case 'month':
      date = nextMonth(currentPeriodStartDate);
      break;
    case 'workWeek':
      date = getDateAfterWorkWeek(currentPeriodStartDate);
      break;
    case 'agenda':
      date = nextAgendaStart(currentPeriodStartDate, agendaDuration);
      break;
  }

  return subMS(date);
};

const getNextPeriodStartDate = (currentPeriodEndDate: Date, step): Date => {
  let date = addMS(currentPeriodEndDate);

  if (step === 'workWeek') {
    while (isWeekend(date)) {
      date = nextDay(date);
    }
  }

  return date;
};

export const getNextIntervalDate = (options, direction: Direction): Date => {
  const {
    date, step, intervalCount, agendaDuration,
  } = options;

  let dayDuration;
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
      dayDuration = agendaDuration;
      break;
    case 'month':
      return getNextMonthDate(date, intervalCount, direction);
  }

  return addDateInterval(date, { days: dayDuration }, direction);
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

const getDateMonthFormatter = (isShort: boolean) => {
  const monthType = isShort ? 'abbreviated' : 'wide';
  const months = dateLocalization.getMonthNames(monthType as any);

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

export const getViewText = (view: RawViewType): string => {
  const viewName = getViewName(view);
  const viewText = messageLocalization.format(`dxScheduler-switcher${viewName}`);

  if (!viewText) {
    return viewName ?? '';
  }

  return viewText;
};

export const formatViews = (
  views: NormalizedView[],
): NormalizedView[] => views.map((view) => ({ ...view, text: getViewText(view) }));

export const getStep = (type: ViewType): Step => STEP_MAP[type];
