import type { ListEntity } from '../../types';

// NOTE: if all day appointment ends at 00:00 make it longer to occupy next cell
export const expandAllDay = <T extends Pick<ListEntity, 'startDate' | 'endDate' | 'allDay' | 'isAllDayPanelOccupied'>>(
  entities: T[],
  isMonthView: boolean,
): T[] => entities.map((entity) => {
    if (!entity.allDay) {
      return entity;
    }
    if (isMonthView || entity.isAllDayPanelOccupied) {
      return {
        ...entity,
        endDate: new Date(entity.endDate).setHours(24, 0, 0, 0),
      };
    }

    const startDate = new Date(entity.startDate);
    const endDate = new Date(entity.endDate + 1);
    endDate.setDate(endDate.getDate() + 1);

    return {
      ...entity,
      endDate: endDate.setHours(
        startDate.getHours(),
        startDate.getMinutes(),
        startDate.getSeconds(),
        startDate.getMilliseconds(),
      ),
    };
  });
