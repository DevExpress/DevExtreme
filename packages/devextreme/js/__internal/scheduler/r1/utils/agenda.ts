import type { ListEntity } from '../../view_model_new/types';
import { setOptionHour } from './base';

export const calculateStartViewDate = (currentDate: Date, startDayHour: number): Date => {
  const validCurrentDate = new Date(currentDate);

  return setOptionHour(validCurrentDate, startDayHour);
};

const getDayStart = (date: Date | number): number => new Date(date).setHours(0, 0, 0, 0);

export const calculateRows = (
  appointments: ListEntity[],
  agendaDuration: number,
  currentDate: Date,
  groupCount: number,
): number[][] => {
  const dayMs = getDayStart(currentDate);
  const intervalsStartMap = new Map<number, number>();
  const result = Array.from(
    { length: groupCount || 1 },
    () => new Array<number>(agendaDuration).fill(0),
  );

  for (let i = 0; i < agendaDuration; i += 1) {
    const day = new Date(dayMs);
    intervalsStartMap.set(day.setDate(day.getDate() + i), i);
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
