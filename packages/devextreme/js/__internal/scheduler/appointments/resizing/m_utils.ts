import { dateUtilsTs } from '@ts/core/utils/date';

const normalizeDate = (
  options: any,
  date: Date,
  sourceDate: Date,
  isStartDate: boolean,
): Date => {
  if (!options.considerTime) {
    return date;
  }

  const { viewOffset } = options;

  let result = new Date(date);
  result = dateUtilsTs.addOffsets(result, [viewOffset]);
  const shiftedSourceDate = dateUtilsTs.addOffsets(sourceDate, [viewOffset]);

  result.setHours(
    shiftedSourceDate.getHours(),
    shiftedSourceDate.getMinutes(),
    shiftedSourceDate.getSeconds(),
  );

  const {
    startDayHour,
    endDayHour,
    appointmentSettings: {
      allDay,
    },
  } = options;

  const minDate = new Date(date);
  const maxDate = new Date(date);

  minDate.setHours(startDayHour, 0, 0, 0);
  maxDate.setHours(endDayHour, 0, 0, 0);

  const resultTime = result.getTime();

  const isDateOutInterval = isStartDate
    ? resultTime < minDate.getTime() || resultTime >= maxDate.getTime()
    : resultTime <= minDate.getTime() || resultTime > maxDate.getTime();

  if (isDateOutInterval) {
    result = !allDay
      ? maxDate
      : minDate;
  }

  result = dateUtilsTs.addOffsets(result, [-viewOffset]);

  return result;
};

export const normalizeStartDate = (
  options: any,
  startDate: Date,
  sourceStartDate: Date,
): Date => normalizeDate(options, startDate, sourceStartDate, true);

export const normalizeEndDate = (
  options: any,
  endDate: Date,
  sourceEndDate: Date,
): Date => normalizeDate(options, endDate, sourceEndDate, false);
