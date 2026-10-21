import type { DataChange, NewRowPosition, RowInsertedInfo } from '@js/common/grids';
import type { DxElement } from '@js/core/element';
import type { DeferredObj } from '@js/core/utils/deferred';
import type { StoreChange } from '@js/data/store';
import type { DxEvent } from '@js/events';
import type { Column as DataGridColumn, ColumnButton, ColumnButtonClickEvent } from '@js/ui/data_grid';
import type { FormItemComponent } from '@js/ui/form';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import type { ProcessedItem } from '../data_controller/types';
import type { RawItemData } from '../data_source_adapter/types';
import type {
  InternalGrid, InternalGridOptions, OptionChanged, OptionChangedFor, RowKey,
} from '../types';
import type { ViewCellOptions, ViewDataChange } from '../views/types';
import type { EDITING_CHANGES_OPTION_NAME, INSERT_INDEX } from './const';

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

export interface OnSavingParams {
  cancel: boolean;
  promise: PromiseLike<void> | null;
  changes: EditingChange[];
}

export type OnSavingResult = { cancel: true; changes?: undefined } | OnSavingParams;

export interface EditFormItemNode {
  name?: string;
  dataField?: string;
  editorType?: FormItemComponent;
  items?: EditFormItemNode[];
  tabs?: EditFormItemNode[];
}

export type EditingChange = DataChange<RawItemData, RowKey>;

export type SavedRowInfo = Omit<RowInsertedInfo<EditingChange['data'], RowKey>, 'error'> & {
  error?: Error;
};

export type EditingColumn = Column
  & Pick<DataGridColumn, 'editCellTemplate'>
  & { buttons?: EditingButton[] };

export interface EditorCellOptions extends ViewCellOptions {
  column: EditingColumn;
  row?: ProcessedItem;
  setValue?: (value: unknown, text?: string) => void;
  isOnForm?: boolean;
  id?: string;
}

export type EditorTemplate = (
  container: DxElement,
  options: EditorCellOptions,
  change?: ViewDataChange,
) => void;

export type EditingButtonCallback = (options: {
  component?: InternalGrid;
  row?: ProcessedItem;
  column: Column;
}) => boolean;

export type InternalColumnButtonClickEvent = ColumnButtonClickEvent & { event: DxEvent };

export type InternalColumnButton = Omit<ColumnButton, 'visible' | 'disabled' | 'onClick'> & {
  visible?: boolean | EditingButtonCallback;
  disabled?: boolean | EditingButtonCallback;
  onClick?: (e: InternalColumnButtonClickEvent) => void;
};

export interface EditingChangesOptionChanged {
  name: 'editing';
  fullName: typeof EDITING_CHANGES_OPTION_NAME;
  value: EditingChange[];
  previousValue: EditingChange[];
  handled: boolean;
}

export interface EditingStartOptions {
  data?: RawItemData;
  key?: RowKey;
  column?: Column;
  cancel: boolean;
}

export interface EditingActionParams {
  cancel: boolean | PromiseLike<boolean> | PromiseLike<void>;
  data?: RawItemData;
  newData?: RawItemData;
  oldData?: RawItemData;
  key?: RowKey;
}

export interface SaveResult {
  key: RowKey;
  result: unknown;
}

export interface ProcessedChanges {
  pendingSaves: DeferredObj<unknown>[];
  saveResults: SaveResult[];
  dataChanges: StoreChange[];
}

export type EditingOptions = NonNullable<InternalGridOptions['editing']> & {
  allowAdding?: AllowEditActionValue;
  allowUpdating?: AllowEditActionValue;
  allowDeleting?: AllowEditActionValue;
  newRowPosition?: NewRowPosition;
};

export type EditingChangeParams = Partial<EditingChange> & { oldData?: RawItemData };

export type EditingButtonLocalizationNames = Record<
'edit' | 'save' | 'delete' | 'undelete' | 'cancel',
string
>;

export interface EditingModuleOptions {
  useLegacyColumnButtonTemplate?: boolean;
}

export type EditingModuleOptionChanged = OptionChanged | OptionChangedFor<EditingModuleOptions>;
