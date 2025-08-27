import { dateUtils } from '@ts/core/utils/m_date';

interface AppointmentData {
  allDay: boolean;
  startDate: number;
  endDate: number;
}

const toMs = dateUtils.dateToMilliseconds;
const SECOND_MS = toMs('second');
const DAY_MS = toMs('day');
const DAY_WITHOUT_ONE_SECOND_MS = toMs('day') - toMs('second');

export const getShiftedAllDayStartDate = (
  originalStartDate: number,
  viewOffset: number,
): number => {
  const trimmedDate = dateUtils.trimTime(new Date(originalStartDate)).getTime() as number;
  const startOfDay = trimmedDate + viewOffset;
  const endOfDay = trimmedDate + DAY_WITHOUT_ONE_SECOND_MS + viewOffset;

  switch (true) {
    case originalStartDate > endOfDay:
      return endOfDay + SECOND_MS;
    case originalStartDate < startOfDay:
      return startOfDay - DAY_MS;
    // NOTE: originalStartDate in interval [startOfDay, endOfDay]
    // (include border points)
    default:
      return startOfDay;
  }
};

export const getShiftedAllDayEndDate = (
  originalEndDate: number,
  viewOffset: number,
): number => {
  const trimmedDate = dateUtils.trimTime(new Date(originalEndDate)).getTime() as number;
  const startOfDay = trimmedDate + viewOffset;
  const endOfDay = trimmedDate + DAY_WITHOUT_ONE_SECOND_MS + viewOffset;

  switch (true) {
    case originalEndDate > endOfDay:
      return endOfDay + DAY_MS;
    case originalEndDate < startOfDay:
      return startOfDay - SECOND_MS;
    // NOTE: originalEndDate in interval [startOfDay, endOfDay]
    // (include border points)
    default:
      return endOfDay;
  }
};

export const getAppointmentOccurrenceDates = (
  {
    startDate: originalStartDate,
    endDate: originalEndDate,
    allDay,
  }: AppointmentData,
  viewOffset: number,
): { startDate: number; endDate: number } => {
  switch (true) {
    // NOTE: For regular appointments -> return original dates
    case !allDay:
      return {
        startDate: originalStartDate,
        endDate: originalEndDate,
      };
    // NOTE: If viewOffset isn't set -> "round" dates
    // E.g: ['2024-02-01T10:00:00', '2024-02-02T11:00:00']
    // -> ['2024-02-01T00:00:00', '2024-02-02T23:59:59']
    case viewOffset === 0:
      return {
        startDate: dateUtils.trimTime(new Date(originalStartDate)).getTime(),
        endDate: dateUtils.trimTime(new Date(originalEndDate)).getTime()
          + DAY_WITHOUT_ONE_SECOND_MS,
      };
    // NOTE: allDay appointment + viewOffset is set case
    default:
      return {
        startDate: getShiftedAllDayStartDate(originalStartDate, viewOffset),
        endDate: getShiftedAllDayEndDate(originalEndDate, viewOffset),
      };
  }
};
