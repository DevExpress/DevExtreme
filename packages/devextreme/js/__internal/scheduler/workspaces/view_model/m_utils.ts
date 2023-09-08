import dateUtils from '@js/core/utils/date';

import { VIEWS } from '../../m_constants';
import { ViewDataGenerator } from './m_view_data_generator';
import { ViewDataGeneratorDay } from './m_view_data_generator_day';
// eslint-disable-next-line import/no-cycle
import { ViewDataGeneratorMonth } from './m_view_data_generator_month';
import { ViewDataGeneratorTimelineMonth } from './m_view_data_generator_timeline_month';
import { ViewDataGeneratorWeek } from './m_view_data_generator_week';
import { ViewDataGeneratorWorkWeek } from './m_view_data_generator_work_week';

const DAYS_IN_WEEK = 7;
const MS_IN_DAY = 24 * 60 * 60 * 1000;

export const getViewDataGeneratorByViewType = (viewType) => {
  switch (viewType) {
    case VIEWS.MONTH:
      return new ViewDataGeneratorMonth();
    case VIEWS.TIMELINE_MONTH:
      return new ViewDataGeneratorTimelineMonth();
    case VIEWS.DAY:
    case VIEWS.TIMELINE_DAY:
      return new ViewDataGeneratorDay();
    case VIEWS.WEEK:
    case VIEWS.TIMELINE_WEEK:
      return new ViewDataGeneratorWeek();
    case VIEWS.WORK_WEEK:
    case VIEWS.TIMELINE_WORK_WEEK:
      return new ViewDataGeneratorWorkWeek();
    default:
      return new ViewDataGenerator();
  }
};

export function alignToFirstDayOfWeek(date, firstDayOfWeek) {
  const newDate = new Date(date);
  let dayDiff = newDate.getDay() - firstDayOfWeek;

  if (dayDiff < 0) {
    dayDiff += DAYS_IN_WEEK;
  }

  newDate.setDate(newDate.getDate() - dayDiff);

  return newDate;
}

export function alignToLastDayOfWeek(date, firstDayOfWeek) {
  const newDate = alignToFirstDayOfWeek(date, firstDayOfWeek);
  newDate.setDate(newDate.getDate() + DAYS_IN_WEEK - 1);
  return newDate;
}

export function calculateDaysBetweenDates(fromDate, toDate) {
  const msDiff = dateUtils.trimTime(toDate).getTime() - dateUtils.trimTime(fromDate).getTime();
  return Math.round(msDiff / MS_IN_DAY) + 1;
}

export function calculateAlignedWeeksBetweenDates(fromDate, toDate, firstDayOfWeek) {
  const alignedFromDate = alignToFirstDayOfWeek(fromDate, firstDayOfWeek);
  const alignedToDate = alignToLastDayOfWeek(toDate, firstDayOfWeek);

  const weekCount = calculateDaysBetweenDates(alignedFromDate, alignedToDate) / DAYS_IN_WEEK;
  return Math.max(weekCount, 6);
}
