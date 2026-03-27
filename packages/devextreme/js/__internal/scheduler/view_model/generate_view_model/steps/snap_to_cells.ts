import type { SnapToCellsMode } from '@js/ui/scheduler';

import type {
  CellInterval, ListEntity, Position,
} from '../../types';

const getCellFill = (
  startDateUTC: number,
  endDateUTC: number,
  cell: CellInterval,
): number => {
  const cellDuration = cell.max - cell.min;
  if (cellDuration <= 0) return 0;

  const overlapStart = Math.max(startDateUTC, cell.min);
  const overlapEnd = Math.min(endDateUTC, cell.max);
  const overlapDuration = Math.max(0, overlapEnd - overlapStart);

  return overlapDuration / cellDuration;
};

export const snapToCells = <T extends ListEntity & Position>(
  entities: T[],
  cells: CellInterval[],
  mode: SnapToCellsMode = 'always',
): T[] => {
  if (mode === 'never') return entities;

  return entities.map((entity) => {
    const startCell = cells[entity.cellIndex];
    const endCell = cells[entity.endCellIndex];

    const snapStart = mode === 'always'
      || getCellFill(entity.startDateUTC, entity.endDateUTC, startCell) > 0.5;
    const snapEnd = mode === 'always'
      || getCellFill(entity.startDateUTC, entity.endDateUTC, endCell) > 0.5;

    const startDateUTC = snapStart ? startCell.min : entity.startDateUTC;
    const endDateUTC = snapEnd ? endCell.max : entity.endDateUTC;

    return {
      ...entity,
      startDateUTC,
      endDateUTC,
      duration: endDateUTC - startDateUTC,
    };
  });
};
