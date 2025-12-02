import type { Column } from '../columns_controller/m_columns_controller';
import type { Item } from '../data_controller/m_data_controller';

export interface NormalizedEditCellOptions {
  item: Item;
  oldColumn: Column;
  column: Column;
  columnIndex: number;
  oldRowIndex: number;
  rowIndex: number;
}
