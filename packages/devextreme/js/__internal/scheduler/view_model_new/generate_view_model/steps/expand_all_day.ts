import type { ListEntity } from '../../types';

const HOURS_IN_DAY = 24;

// NOTE: if all day appointment ends at 00:00 make it longer to occupy next cell
export const expandAllDay = <T extends Pick<ListEntity, 'startDateUTC' | 'endDateUTC' | 'allDay'>>(
  entities: T[],
  startDayHour: number,
): T[] => entities.map((entity) => {
    if (!entity.allDay) {
      return entity;
    }

    const endDate = new Date(entity.endDateUTC);
    endDate.setUTCHours(Math.max(endDate.getUTCHours(), startDayHour % HOURS_IN_DAY), 0, 0, 0);

    return {
      ...entity,
      endDateUTC: endDate.getTime() + 1,
    };
  });
