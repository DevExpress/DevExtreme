import { dateUtils } from '@ts/core/utils/m_date';

import type { DateInterval, ListEntity } from '../../types';

const toMs = dateUtils.dateToMilliseconds;
const MINUTE_MS = toMs('minute');
const DAY_MS = toMs('day');
const ONE_DAY_MINUTES = 24 * 60;
const HOUR_MINUTES = 60;

const getDayInterval = (date: number, viewOffsetMs: number): DateInterval => {
  const trimmedDate = new Date(date).setUTCHours(0, 0, 0, 0);
  const startOfDay = trimmedDate + viewOffsetMs;
  const endOfDay = trimmedDate + DAY_MS + viewOffsetMs;

  return { min: startOfDay, max: endOfDay };
};
const getShiftedStartDate = (startDate: number, viewOffsetMs: number): number => {
  const { min, max } = getDayInterval(startDate, viewOffsetMs);

  switch (true) {
    case startDate > max:
      return max;
    case startDate < min:
      return min - DAY_MS;
    default:
      return min;
  }
};
const getShiftedEndDate = (endDate: number, viewOffsetMs: number): number => {
  const { min, max } = getDayInterval(endDate, viewOffsetMs);

  switch (true) {
    case endDate > max:
      return max + DAY_MS - MINUTE_MS;
    case endDate < min:
      return min - MINUTE_MS;
    default:
      return min;
  }
};

// NOTE: if all day appointment ends at 00:00 make it longer to occupy next cells day
export const expandAllDayAllDayPanel = <T extends Pick<ListEntity, 'startDateUTC' | 'endDateUTC' | 'allDay'>>(
  entities: T[],
  endDayHour: number,
  viewOffsetMs: number,
): T[] => entities.map((entity) => {
    if (!entity.allDay) {
      return entity;
    }

    if (viewOffsetMs === 0) {
      // NOTE: For case of start date higher than endDayHour:
      // (0 hours) [startHour, endHour] (appointment start, end) (24 hours)
      const minStartDate = new Date(entity.startDateUTC)
        .setUTCHours(endDayHour, 0, 0, 0)
        - MINUTE_MS;
      const endOfDayMinutes = (endDayHour * HOUR_MINUTES - 1) % ONE_DAY_MINUTES;
      const endOfDayHours = Math.floor(endOfDayMinutes / HOUR_MINUTES);
      const endOfDayRemainingMinutes = endOfDayMinutes % HOUR_MINUTES;
      const maxEndDate = new Date(entity.endDateUTC)
        .setUTCHours(endOfDayHours, endOfDayRemainingMinutes, 0, 0);

      return {
        ...entity,
        startDateUTC: Math.min(entity.startDateUTC, minStartDate),
        endDateUTC: maxEndDate,
      };
    }

    return {
      ...entity,
      startDateUTC: getShiftedStartDate(entity.startDateUTC, viewOffsetMs),
      endDateUTC: getShiftedEndDate(entity.endDateUTC, viewOffsetMs),
      // startDateUTC: Math.min(entity.startDateUTC, minStartDate),
      // endDateUTC: maxEndDate,
    };
  });

export const expandAllDayRegularPanel = <T extends Pick<ListEntity, 'startDateUTC' | 'endDateUTC' | 'allDay'>>(
  entities: T[],
): T[] => entities.map((entity) => {
    if (!entity.allDay) {
      return entity;
    }

    const startDate = new Date(entity.startDateUTC);
    const endDate = new Date(entity.endDateUTC);
    endDate.setDate(endDate.getDate() + 1);

    return {
      ...entity,
      endDateUTC: endDate
        .setUTCHours(
          startDate.getUTCHours(),
          startDate.getUTCMinutes(),
          startDate.getUTCSeconds(),
          startDate.getUTCMilliseconds(),
        ),
    };
  });
