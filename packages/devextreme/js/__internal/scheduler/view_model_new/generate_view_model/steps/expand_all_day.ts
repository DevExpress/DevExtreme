import type { ListEntity } from '../../types';

// NOTE: if all day appointment ends at 00:00 make it longer to occupy next cell
export const expandAllDay = <T extends Pick<ListEntity, 'startDateUTC' | 'endDateUTC' | 'allDay' | 'isAllDayPanelOccupied'>>(
  entities: T[],
  isMonthView: boolean,
): T[] => entities.map((entity) => {
    if (!entity.allDay) {
      return entity;
    }
    if (isMonthView || entity.isAllDayPanelOccupied) {
      return {
        ...entity,
        endDateUTC: new Date(entity.endDateUTC - 1).setUTCHours(24, 0, 0, 0),
      };
    }

    const startDate = new Date(entity.startDateUTC);
    const endDate = new Date(entity.endDateUTC + 1);
    endDate.setUTCDate(endDate.getUTCDate() + 1);

    return {
      ...entity,
      endDateUTC: endDate.setUTCHours(
        startDate.getUTCHours(),
        startDate.getUTCMinutes(),
        startDate.getUTCSeconds(),
        startDate.getUTCMilliseconds(),
      ),
    };
  });
