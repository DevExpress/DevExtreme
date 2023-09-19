import dateUtils from '@js/core/utils/date';

const toMs = dateUtils.dateToMilliseconds;
const HOURS_IN_DAY = 24;

const getOffsetInHours = (offsetInMs: number): number => Math.floor(offsetInMs / toMs('hour'));

const getViewStartHours = (offsetInMs: number, startDayHour: number): number => {
  const offsetHour = getOffsetInHours(offsetInMs);
  const endHoursShift = (offsetHour + startDayHour) % HOURS_IN_DAY;

  return endHoursShift < 0
    ? HOURS_IN_DAY + endHoursShift
    : endHoursShift;
};

export const offsetUtils = {
  getOffsetInHours,
  getViewStartHours,
};
