import type {
  CellInterval,
  ListEntity,
  Position,
} from '../../types';
import { binarySearchCellIndex } from './binary_search_cell_index';

export const addPosition = <T extends Pick<ListEntity, 'startDate' | 'endDate' | 'allDay'>>(
  entities: T[],
  cells: CellInterval[],
): (T & Position)[] => entities.map((entity) => {
    const cellIndex = binarySearchCellIndex(cells, entity.startDate);
    let endCellIndex = cellIndex;
    while (
      endCellIndex < cells.length - 1
      && entity.endDate > cells[endCellIndex].max
      && entity.endDate >= cells[endCellIndex + 1].min
    ) { endCellIndex += 1; }

    return {
      ...entity,
      cellIndex,
      endCellIndex,
      rowIndex: cells[cellIndex].rowIndex,
      columnIndex: cells[cellIndex].columnIndex,
    };
  });
