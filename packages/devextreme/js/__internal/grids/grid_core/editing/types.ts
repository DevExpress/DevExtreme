import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import type { ProcessedItem } from '../data_controller/types';
import type { RawItemData } from '../data_source_adapter/types';
import type { InternalGrid, RowKey } from '../m_types';
import type { INSERT_INDEX } from './const';

export interface NormalizedEditCellOptions {
  item: ProcessedItem;
  oldColumn: Column;
  column: Column;
  columnIndex: number;
  oldRowIndex: number;
  rowIndex: number;
}

export interface InsertInfo {
  [INSERT_INDEX]: number;
  parentKey?: RowKey;
}

export interface InternalEditData {
  key: RowKey;
  oldData?: RawItemData;
  insertInfo?: InsertInfo;
  error?: Error;
}

export interface EditActionOptions {
  row?: ProcessedItem;
}

export type AllowEditActionCallback = (
  options: { component: InternalGrid; row?: ProcessedItem },
) => boolean;

export type AllowEditActionValue = boolean | AllowEditActionCallback;

export type EditActions = 'allowAdding' | 'allowUpdating' | 'allowDeleting';
