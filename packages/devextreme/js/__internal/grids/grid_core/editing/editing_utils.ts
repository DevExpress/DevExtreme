import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { isObject } from '@js/core/utils/type';
import type { FormItemComponent } from '@js/ui/form';
import type { EditingTexts } from '@js/ui/tree_list';

import type { ProcessedItem } from '../data_controller/types';
import type { InternalGrid, RowKey } from '../types';
import { GUID_LENGTH, NEW_ROW_TEMP_KEY_PREFIX } from './const';
import type {
  EditFormColumnItem,
  EditFormItemNode,
  EditingButton,
  EditingButtonTexts,
  EditingCellOptions,
} from './types';

export const createFailureHandler = (
  deferred: DeferredObj<unknown>,
): ((arg: unknown) => void) => (arg: unknown): void => {
  // eslint-disable-next-line @typescript-eslint/no-base-to-string -- any rejection reason
  const error = arg instanceof Error ? arg : new Error((arg ? String(arg) : '') || 'Unknown error');
  deferred.reject(error);
};

export const isEditingCell = (
  isEditRow: boolean,
  cellOptions: EditingCellOptions,
): boolean => Boolean(cellOptions.isEditing)
  || (isEditRow && Boolean(cellOptions.column.allowEditing));

export const isEditingOrShowEditorAlwaysDataCell = (
  isEditRow: boolean,
  cellOptions: EditingCellOptions,
): boolean => {
  const isCommandCell = Boolean(cellOptions.column.command);
  const isEditing = isEditingCell(isEditRow, cellOptions);
  const isEditorCell = !isCommandCell
    && (isEditing || Boolean(cellOptions.column.showEditorAlways));
  return cellOptions.rowType === 'data' && isEditorCell;
};

export const getEditingTexts = (
  options: { component: InternalGrid },
): EditingButtonTexts => {
  const editingTexts: EditingTexts = options.component.option('editing.texts') ?? {};

  return {
    save: editingTexts.saveRowChanges,
    cancel: editingTexts.cancelRowChanges,
    edit: editingTexts.editRow,
    undelete: editingTexts.undeleteRow,
    delete: editingTexts.deleteRow,
    add: editingTexts.addRowToNode,
  };
};

export const generateNewRowTempKey = (): string => `${NEW_ROW_TEMP_KEY_PREFIX}${new Guid()}`;

export const isNewRowTempKey = (key: RowKey): boolean => typeof key === 'string'
    && key.startsWith(NEW_ROW_TEMP_KEY_PREFIX)
    && key.length === NEW_ROW_TEMP_KEY_PREFIX.length + GUID_LENGTH;

export function getButtonName(button: string): string;
export function getButtonName(button: EditingButton): string | undefined;
export function getButtonName(button: EditingButton): string | undefined {
  return isObject(button) ? button.name : button;
}

export const getButtonIndex = (
  buttons: EditingButton[],
  name: string,
): number => buttons.findIndex((button) => getButtonName(button) === name);

export function isEditable($element: dxElementWrapper | undefined): boolean {
  if (!$element) {
    return false;
  }

  return $element.is('input') || $element.is('textarea');
}

export const getEditorType = (item: EditFormColumnItem): FormItemComponent | undefined => {
  const { column } = item;

  return item.isCustomEditorType ? item.editorType : column.formItem?.editorType;
};

export const forEachFormItems = (
  items: EditFormItemNode[],
  callBack: (item: EditFormItemNode) => void,
): void => {
  items.forEach((item) => {
    const childItems = item.items ?? item.tabs;

    if (childItems) {
      forEachFormItems(childItems, callBack);
    } else {
      callBack(item);
    }
  });
};

export const isCellModified = (
  row: ProcessedItem,
  columnIndex: number,
): boolean => row.modifiedValues?.[columnIndex] !== undefined;
