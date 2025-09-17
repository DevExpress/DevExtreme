import type { ListEntity } from '../../types';

const ONE_DAY_MINUTES = 24 * 60;
const TWO_DAYS_MINUTES = 2 * ONE_DAY_MINUTES;
const MS_IN_MINUTE = 60_000;
const MINUTES_IN_HOUR = 60;

// NOTE: if all day appointment ends at 00:00 make it longer to occupy next cells day
export const expandAllDay = <T extends Pick<ListEntity, 'startDateUTC' | 'endDateUTC' | 'allDay'>>(
  entities: T[],
  viewOffsetMs: number,
  endDayHour: number,
): T[] => entities.map((entity) => {
    if (!entity.allDay) {
      return entity;
    }

    // NOTE: viewOffset can be between [-24, 24] hours
    const endOfDayMinutes = (TWO_DAYS_MINUTES + viewOffsetMs / MS_IN_MINUTE - 1) % ONE_DAY_MINUTES;
    const endOfDayHours = Math.floor(endOfDayMinutes / MINUTES_IN_HOUR);
    const endOfDayRemainingMinutes = endOfDayMinutes % MINUTES_IN_HOUR;

    const endDate = new Date(entity.endDateUTC);
    endDate.setUTCHours(endOfDayHours, endOfDayRemainingMinutes);

    const minStartDate = new Date(entity.startDateUTC)
      .setUTCHours(endDayHour, 0, 0, 0)
      - MS_IN_MINUTE;

    return {
      ...entity,
      startDateUTC: Math.min(entity.startDateUTC, minStartDate),
      endDateUTC: endDate.getTime(),
    };
  });
