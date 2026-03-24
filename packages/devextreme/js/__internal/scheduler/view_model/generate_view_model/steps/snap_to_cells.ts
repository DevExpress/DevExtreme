import type { SnapToCellsModeType } from '../../../types';
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
  mode: SnapToCellsModeType = 'always',
): T[] => {
  if (mode === 'never') return entities;

  if (mode === 'always') {
    return entities.map((entity) => {
      const startDateUTC = cells[entity.cellIndex].min;
      const endDateUTC = cells[entity.endCellIndex].max;

      return {
        ...entity, startDateUTC, endDateUTC, duration: endDateUTC - startDateUTC,
      };
    });
  }

  return entities.map((entity) => {
    const startCell = cells[entity.cellIndex];
    const endCell = cells[entity.endCellIndex];

    const startDateUTC = getCellFill(entity.startDateUTC, entity.endDateUTC, startCell) > 0.5
      ? startCell.min : entity.startDateUTC;
    const endDateUTC = getCellFill(entity.startDateUTC, entity.endDateUTC, endCell) > 0.5
      ? endCell.max : entity.endDateUTC;

    return {
      ...entity, startDateUTC, endDateUTC, duration: endDateUTC - startDateUTC,
    };
  });
};
