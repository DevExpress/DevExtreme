import timeZoneUtils from '../../utils_time_zone';
import type { ListEntity } from '../../view_model/types';
import { setOptionHour } from './base';

export const calculateStartViewDate = (
  currentDate: Date,
  startDayHour: number,
): Date => {
  const validCurrentDate = new Date(currentDate);
  return setOptionHour(validCurrentDate, startDayHour);
};

const getDayStart = (date: Date | number): number => new Date(date).setUTCHours(0, 0, 0, 0);

export const getDateByIndex = (
  startViewDate: Date,
  index: number,
): Date => {
  const date = new Date(startViewDate);
  date.setDate(date.getDate() + index);
  return date;
};

export const calculateEndViewDate = (
  startViewDate: Date,
  endDayHour: number,
  agendaDuration: number,
): Date => {
  const lastVisibleDate = getDateByIndex(
    startViewDate,
    Math.max(agendaDuration - 1, 0),
  );
  const endViewDate = setOptionHour(lastVisibleDate, endDayHour);

  return new Date(endViewDate.getTime() - 60000);
};

export const calculateRows = (
  appointments: ListEntity[],
  agendaDuration: number,
  startViewDate: Date,
  groupCount: number,
): number[][] => {
  const intervalsStartMap = new Map<number, number>();
  const result = Array.from(
    { length: groupCount || 1 },
    () => new Array<number>(agendaDuration).fill(0),
  );

  for (let i = 0; i < agendaDuration; i += 1) {
    const date = getDateByIndex(startViewDate, i);
    const utcDate = timeZoneUtils.createUTCDateWithLocalOffset(date);
    const dayStart = getDayStart(utcDate as Date);
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
