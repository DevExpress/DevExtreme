import { dateUtilsTs } from '@ts/core/utils/date';
import { dateUtils } from '@ts/core/utils/m_date';
import type { AppointmentDataItem } from '@ts/scheduler/types';

const toMs = dateUtils.dateToMilliseconds;
const SECOND_MS = toMs('second');
const DAY_MS = toMs('day');
const DAY_WITHOUT_ONE_SECOND_MS = toMs('day') - toMs('second');

export const getShiftedAllDayStartDate = (
  originalStartDate: Date,
  viewOffset: number,
): Date => {
  const trimmedDate = dateUtils.trimTime(originalStartDate);
  const startOfDay = dateUtilsTs.addOffsets(trimmedDate, viewOffset);
  const endOfDay = dateUtilsTs.addOffsets(trimmedDate, DAY_WITHOUT_ONE_SECOND_MS, viewOffset);

  switch (true) {
    case originalStartDate > endOfDay:
      return dateUtilsTs.addOffsets(endOfDay, SECOND_MS);
    case originalStartDate < startOfDay:
      return dateUtilsTs.addOffsets(startOfDay, -DAY_MS);
    // NOTE: originalStartDate in interval [startOfDay, endOfDay]
    // (include border points)
    default:
      return startOfDay;
  }
};

export const getShiftedAllDayEndDate = (
  originalEndDate: Date,
  viewOffset: number,
): Date => {
  const trimmedDate = dateUtils.trimTime(originalEndDate);
  const startOfDay = dateUtilsTs.addOffsets(trimmedDate, viewOffset);
  const endOfDay = dateUtilsTs.addOffsets(trimmedDate, DAY_WITHOUT_ONE_SECOND_MS, viewOffset);

  switch (true) {
    case originalEndDate > endOfDay:
      return dateUtilsTs.addOffsets(endOfDay, DAY_MS);
    case originalEndDate < startOfDay:
      return dateUtilsTs.addOffsets(startOfDay, -SECOND_MS);
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
  }: AppointmentDataItem,
  viewOffset: number,
): { startDate: Date; endDate: Date } => {
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
        startDate: dateUtils.trimTime(originalStartDate),
        endDate: dateUtilsTs.addOffsets(
          dateUtils.trimTime(originalEndDate),
          DAY_WITHOUT_ONE_SECOND_MS,
        ),
      };
    // NOTE: allDay appointment + viewOffset is set case
    default:
      return {
        startDate: getShiftedAllDayStartDate(originalStartDate, viewOffset),
        endDate: getShiftedAllDayEndDate(originalEndDate, viewOffset),
      };
  }
};
