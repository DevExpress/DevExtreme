import type {
  CellInterval,
  ListEntity,
  Position,
} from '../../types';
import { binarySearchCellIndex } from './binary_search_cell_index';

export const addPosition = <T extends Pick<
  ListEntity, 'startDateUTC' | 'endDateUTC' | 'layoutStartMs' | 'layoutEndMs'
>>(
  entities: T[],
  cells: CellInterval[],
): (T & Position)[] => entities.map((entity) => {
  const usesLayout = entity.layoutStartMs !== undefined;
  const start = entity.layoutStartMs ?? entity.startDateUTC;
  const end = entity.layoutEndMs ?? entity.endDateUTC;
  const cellIndex = binarySearchCellIndex(cells, start);
  let endCellIndex = cellIndex;
  while (
    endCellIndex < cells.length - 1
      && end > cells[endCellIndex].max
      && end >= cells[endCellIndex + 1].min
  ) { endCellIndex += 1; }

  return {
    ...entity,
    startDateUTC: usesLayout
      ? entity.startDateUTC
      : Math.max(entity.startDateUTC, cells[cellIndex].min),
    endDateUTC: usesLayout
      ? entity.endDateUTC
      : Math.min(entity.endDateUTC, cells[endCellIndex].max),
    layoutStartMs: usesLayout ? Math.max(start, cells[cellIndex].min) : entity.layoutStartMs,
    layoutEndMs: usesLayout ? Math.min(end, cells[endCellIndex].max) : entity.layoutEndMs,
    cellIndex,
    endCellIndex,
    rowIndex: cells[cellIndex].rowIndex,
    columnIndex: cells[cellIndex].columnIndex,
  };
});
