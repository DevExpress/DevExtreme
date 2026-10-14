import type { DataChange } from '@js/common/grids';
import type { ColumnButton } from '@js/ui/data_grid';
import type { FormItemComponent } from '@js/ui/form';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import type { ProcessedItem } from '../data_controller/types';
import type { RawItemData } from '../data_source_adapter/types';
import type { InternalGrid, RowKey } from '../types';
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

export interface EditingCellOptions {
  column: Column;
  rowType: string;
  isEditing?: boolean;
}

export type EditingButton = string | ColumnButton;

export interface EditingButtonTexts {
  save: string | undefined;
  cancel: string | undefined;
  edit: string | undefined;
  undelete: string | undefined;
  delete: string | undefined;
  add: string | undefined;
}

export interface EditFormColumnItem {
  column: Column;
  editorType?: FormItemComponent;
  isCustomEditorType?: boolean;
}

export interface OnSavingResult {
  cancel: boolean;
  changes?: DataChange[];
}

export interface EditFormItemNode {
  name?: string;
  dataField?: string;
  editorType?: FormItemComponent;
  items?: EditFormItemNode[];
  tabs?: EditFormItemNode[];
}
