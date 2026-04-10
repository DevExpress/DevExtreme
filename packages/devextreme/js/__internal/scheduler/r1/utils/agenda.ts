import timeZoneUtils from '../../m_utils_time_zone';
import type { WeekdayIndex } from '../../utils/skipped_days';
import {
  getDateAfterVisibleDays,
  getFirstVisibleDate,
} from '../../utils/skipped_days';
import type { ListEntity } from '../../view_model/types';
import { setOptionHour } from './base';

const nextDay = (date: Date): Date => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
  return nextDate;
};

export const calculateStartViewDate = (
  currentDate: Date,
  startDayHour: number,
  skippedDays: WeekdayIndex[] = [],
): Date => {
  const validCurrentDate = new Date(currentDate);
  const startViewDate = setOptionHour(validCurrentDate, startDayHour);

  return skippedDays.length > 0
    ? getFirstVisibleDate(startViewDate, skippedDays, nextDay)
    : startViewDate;
};

const getDayStart = (date: Date | number): number => new Date(date).setUTCHours(0, 0, 0, 0);

export const getDateByIndex = (
  startViewDate: Date,
  index: number,
  skippedDays: WeekdayIndex[] = [],
): Date => (index <= 0
  ? new Date(startViewDate)
  : getDateAfterVisibleDays(startViewDate, index, skippedDays, nextDay));

export const calculateEndViewDate = (
  startViewDate: Date,
  endDayHour: number,
  agendaDuration: number,
  skippedDays: WeekdayIndex[] = [],
): Date => {
  const lastVisibleDate = getDateByIndex(
    startViewDate,
    Math.max(agendaDuration - 1, 0),
    skippedDays,
  );
  const endViewDate = setOptionHour(lastVisibleDate, endDayHour);

  return new Date(endViewDate.getTime() - 60000);
};

export const calculateRows = (
  appointments: ListEntity[],
  agendaDuration: number,
  startViewDate: Date,
  groupCount: number,
  skippedDays: WeekdayIndex[] = [],
): number[][] => {
  const intervalsStartMap = new Map<number, number>();
  const result = Array.from(
    { length: groupCount || 1 },
    () => new Array<number>(agendaDuration).fill(0),
  );

  for (let i = 0; i < agendaDuration; i += 1) {
    const date = getDateByIndex(startViewDate, i, skippedDays);
    const dayStart = getDayStart(timeZoneUtils.createUTCDateWithLocalOffset(date));
    intervalsStartMap.set(dayStart, i);
  }

  appointments.forEach((appointment) => {
    const appointmentStart = getDayStart(appointment.startDateUTC);
    const intervalIndex = intervalsStartMap.get(appointmentStart);
    if (intervalIndex !== undefined) {
      result[appointment.groupIndex][intervalIndex] += 1;
    }
  });

  return result;
};
