import type {
  CellInterval, Duration, Position,
} from '../../types';

export const snapToCells = <T extends Duration & Position>(
  entities: T[],
  cells: CellInterval[],
  isSnapToCell = true,
): T[] => {
  if (!isSnapToCell) {
    return entities;
  }

  return entities.map((entity) => {
    const { cellIndex, endCellIndex } = entity;

    return {
      ...entity,
      startDate: cells[cellIndex].min,
      endDate: cells[endCellIndex].max,
      duration: cells[endCellIndex].max - cells[cellIndex].min,
    };
  });
};
