import type { ListEntity } from '../../types';

const MINUTES_IN_DAY = 24 * 60;
const MS_IN_MINUTE = 60_000;
const MINUTES_IN_HOUR = 60;

// NOTE: if all day appointment ends at 00:00 make it longer to occupy next cells day
export const expandAllDay = <T extends Pick<ListEntity, 'startDateUTC' | 'endDateUTC' | 'allDay'>>(
  entities: T[],
  viewOffsetMs: number,
): T[] => entities.map((entity) => {
    if (!entity.allDay) {
      return entity;
    }

    const endOfDayMinutes = (MINUTES_IN_DAY + viewOffsetMs / MS_IN_MINUTE - 1) % MINUTES_IN_DAY;
    const endOfDayHours = Math.floor(endOfDayMinutes / MINUTES_IN_HOUR);
    const endOfDayRemainingMinutes = endOfDayMinutes % MINUTES_IN_HOUR;

    const endDate = new Date(entity.endDateUTC);
    endDate.setUTCHours(endOfDayHours, endOfDayRemainingMinutes);

    return {
      ...entity,
      endDateUTC: endDate.getTime(),
    };
  });
