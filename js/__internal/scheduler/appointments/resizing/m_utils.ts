const normalizeDate = (options, date, sourceDate, isStartDate) => {
  if (!options.considerTime) {
    return date;
  }

  let result = new Date(date);

  result.setHours(
    sourceDate.getHours(),
    sourceDate.getMinutes(),
    sourceDate.getSeconds(),
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

  return result;
};

export const normalizeStartDate = (options, startDate, sourceStartDate) => normalizeDate(options, startDate, sourceStartDate, true);

export const normalizeEndDate = (options, endDate, sourceEndDate) => normalizeDate(options, endDate, sourceEndDate, false);
