import { AI_COLUMN_NAME } from '@ts/grids/grid_core/ai_column/const';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import type { RawItemData } from '../../data_source_adapter/types';

export function generateRowValues(
  data: RawItemData,
  columns: Column[],
  isModified = false,
): unknown[] {
  // `isModified` switches the placeholder for skipped columns
  // to distinguish `item.modifiedValues` from `item.values`.
  const emptyValue = isModified ? undefined : null;

  return columns.map((column) => {
    if (column.command && column.type !== AI_COLUMN_NAME) {
      return emptyValue;
    }

    if (column.calculateCellValue) {
      // Public ColumnBase types calculateCellValue as returning `any`.
      return column.calculateCellValue(data) as unknown;
    }

    if (column.dataField) {
      return data[column.dataField];
    }

    return emptyValue;
  });
}
