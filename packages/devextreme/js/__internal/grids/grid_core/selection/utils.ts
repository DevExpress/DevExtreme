import type DOMComponent from '@js/core/dom_component';
import type { dxElementWrapper } from '@js/core/renderer';
import CheckBox from '@js/ui/check_box';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import { SELECT_CHECKBOX_CLASS } from '@ts/grids/grid_core/selection/const';

export const getSelectColumnIndex = (columns: Column[]): number => columns
  .findIndex((column) => column.command === 'select');

export const getSelectionCheckBox = (
  $row: dxElementWrapper,
): DOMComponent | undefined => {
  const $checkBox = $row.find(`.${SELECT_CHECKBOX_CLASS}`);

  return $checkBox.length > 0 ? CheckBox.getInstance($checkBox.get(0)) : undefined;
};

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
