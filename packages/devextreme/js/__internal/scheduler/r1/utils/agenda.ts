import type { ListEntity } from '../../view_model_new/types';
import { setOptionHour } from './base';

export const calculateStartViewDate = (currentDate: Date, startDayHour: number): Date => {
  const validCurrentDate = new Date(currentDate);

  return setOptionHour(validCurrentDate, startDayHour);
};

const getDayStart = (date: Date | number, viewOffset: number): number => {
  const trimDate = new Date(date).setHours(0, 0, 0, 0);
  return trimDate + viewOffset;
};

export const calculateRows = (
  appointments: ListEntity[],
  agendaDuration: number,
  currentDate: Date,
  groupCount: number,
  viewOffset = 0,
): number[][] => {
  const dayMs = getDayStart(currentDate, viewOffset);
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
    const appointmentStart = getDayStart(appointment.startDate, viewOffset);
    const intervalIndex = intervalsStartMap.get(appointmentStart);
    if (intervalIndex !== undefined) {
      result[appointment.groupIndex][intervalIndex] += 1;
    }
  });

  return result;
};
