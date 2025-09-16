import type { ListEntity } from '../../types';

// NOTE: if all day appointment ends at 00:00 make it longer to occupy next cells day
export const expandAllDay = <T extends Pick<ListEntity, 'startDateUTC' | 'endDateUTC' | 'allDay'>>(
  entities: T[],
): T[] => entities.map((entity) => {
    if (!entity.allDay) {
      return entity;
    }

    const endDate = new Date(entity.endDateUTC);
    endDate.setUTCHours(23, 59, 59, 999);

    return {
      ...entity,
      endDateUTC: endDate.getTime(),
    };
  });
