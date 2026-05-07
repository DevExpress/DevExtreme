import type { Column } from '../columns_controller/types';
import type { Item, UserData } from '../data_controller/m_data_controller';
import type { RowKey } from '../m_types';
import type { INSERT_INDEX } from './const';

export interface NormalizedEditCellOptions {
  item: Item;
  oldColumn: Column;
  column: Column;
  columnIndex: number;
  oldRowIndex: number;
  rowIndex: number;
}

export interface InsertInfo {
  [INSERT_INDEX]: number;
}

export interface InternalEditData {
  key: RowKey;
  oldData?: UserData;
  insertInfo?: InsertInfo;
  error?: Error;
}
