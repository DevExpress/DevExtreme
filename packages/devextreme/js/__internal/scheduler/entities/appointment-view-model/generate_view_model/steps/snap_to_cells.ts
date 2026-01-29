import type {
  CellInterval, ListEntity, Position,
} from '../../types';

export const snapToCells = <T extends ListEntity & Position>(
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
      startDateUTC: cells[cellIndex].min,
      endDateUTC: cells[endCellIndex].max,
      duration: cells[endCellIndex].max - cells[cellIndex].min,
    };
  });
};
