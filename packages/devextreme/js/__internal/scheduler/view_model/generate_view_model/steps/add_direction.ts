import type { Direction, ListEntity } from '../../types';

export const addDirection = <T extends ListEntity>(
  entities: T[],
  allDayPanelDirection: Direction['direction'],
  regularPanelDirection: Direction['direction'],
): (T & Direction)[] => entities.map((entity) => ({
    ...entity,
    direction: entity.isAllDayPanelOccupied ? allDayPanelDirection : regularPanelDirection,
  }));
