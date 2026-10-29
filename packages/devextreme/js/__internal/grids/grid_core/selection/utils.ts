import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';

export const getSelectColumnIndex = (columns: Column[]): number => columns
  .findIndex((column) => column.command === 'select');

export const updateSelectCellValue = (
  currentItem: ProcessedItem,
  newItem: ProcessedItem,
  selectColumnIndex: number,
): void => {
  if (selectColumnIndex < 0) {
    return;
  }

  const selectCellValue = newItem.values[selectColumnIndex];

  if (currentItem.values[selectColumnIndex] === selectCellValue) {
    return;
  }

  currentItem.values = currentItem.values.slice();
  currentItem.values[selectColumnIndex] = selectCellValue;
};
