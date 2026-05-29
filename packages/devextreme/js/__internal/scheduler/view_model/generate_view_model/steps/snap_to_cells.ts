import type { SnapToCellsMode } from '@js/ui/scheduler';

import type {
  CellInterval, ListEntity, Position,
} from '../../types';

export const snapToCells = <T extends ListEntity & Position>(
  entities: T[],
  cells: CellInterval[],
  mode: SnapToCellsMode = 'always',
): T[] => {
  if (mode === 'never') return entities;

  return entities.map((entity) => {
    const startCell = cells[entity.cellIndex];
    const endCell = cells[entity.endCellIndex];
    const cellDuration = startCell.max - startCell.min;
    const appointmentDuration = entity.endDateUTC - entity.startDateUTC;
    const isLessThanTwoCells = cellDuration > 0 && appointmentDuration / cellDuration < 2;
    const shouldSnap = mode === 'always' || isLessThanTwoCells;

    const startDateUTC = shouldSnap ? startCell.min : entity.startDateUTC;
    const endDateUTC = shouldSnap ? endCell.max : entity.endDateUTC;

    return {
      ...entity,
      startDateUTC,
      endDateUTC,
      duration: endDateUTC - startDateUTC,
    };
  });
};
