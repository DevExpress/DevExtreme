import type { DataChangeType, GridsEditMode, NewRowPosition } from '@js/common/grids';

import type { EditActions } from './types';

export const CLASSES = {
  editRow: 'dx-edit-row',
  rowInserted: 'dx-row-inserted',
  rowModified: 'dx-row-modified',
  rowRemoved: 'dx-row-removed',
  rowSelected: 'dx-selection',

  editorCell: 'dx-editor-cell',
  cellModified: 'dx-cell-modified',
  cellFocusDisabled: 'dx-cell-focus-disabled',
  readonly: 'readonly',

  commandEdit: 'dx-command-edit',
  commandEditWithIcons: 'dx-command-edit-with-icons',
  editButton: 'dx-edit-button',
  link: 'dx-link',
  linkIcon: 'dx-link-icon',
  addRowButton: 'addrow-button',
  button: 'dx-button',

  editForm: 'edit-form',
  editFormItem: 'edit-form-item',
  editPopup: 'edit-popup',
  editPopupForm: 'edit-popup-form',
  formButtonsContainer: 'form-buttons-container',

  focusOverlay: 'focus-overlay',
  focusableElement: 'dx-scrollable-container',
  dropDownEditorOverlay: 'dx-dropdowneditor-overlay',
};
export const EDIT_LINK_CLASS: Partial<Record<string, string>> = {
  save: 'dx-link-save',
  cancel: 'dx-link-cancel',
  edit: 'dx-link-edit',
  undelete: 'dx-link-undelete',
  delete: 'dx-link-delete',
  add: 'dx-link-add',
};
export const EDIT_ICON_CLASS: Partial<Record<string, string>> = {
  save: 'save',
  cancel: 'revert',
  edit: 'edit',
  undelete: 'revert',
  delete: 'trash',
  add: 'add',
};

export const DATA_CHANGE_TYPE = {
  insert: 'insert',
  update: 'update',
  remove: 'remove',
} as const satisfies Record<string, DataChangeType>;

export const EDITING_POPUP_OPTION_NAME = 'editing.popup';
export const EDITING_FORM_OPTION_NAME = 'editing.form';
export const EDITING_EDITROWKEY_OPTION_NAME = 'editing.editRowKey';
export const EDITING_EDITCOLUMNNAME_OPTION_NAME = 'editing.editColumnName';
export const EDITING_CHANGES_OPTION_NAME = 'editing.changes';

export const TARGET_COMPONENT_NAME = 'targetComponent';

export const EDITORS_TEXTAREA_SELECTOR = 'textarea:not([hidden])';
export const EDITORS_INPUT_SELECTOR = 'input:not([type=\'hidden\'])';
export const FOCUSABLE_ELEMENT_SELECTOR = `[tabindex]:not([disabled]), ${EDITORS_INPUT_SELECTOR}:not([disabled]), ${EDITORS_TEXTAREA_SELECTOR}:not([disabled])`;

export const EDIT_MODE = {
  batch: 'batch',
  row: 'row',
  cell: 'cell',
  form: 'form',
  popup: 'popup',
} as const satisfies Record<string, GridsEditMode>;

export const NEW_ROW_POSITION = {
  first: 'first',
  last: 'last',
  pageBottom: 'pageBottom',
  pageTop: 'pageTop',
  viewportBottom: 'viewportBottom',
  viewportTop: 'viewportTop',
} as const satisfies Record<string, NewRowPosition>;

export const EDIT_MODES: GridsEditMode[] = [
  EDIT_MODE.batch, EDIT_MODE.row, EDIT_MODE.cell, EDIT_MODE.form, EDIT_MODE.popup,
];
export const ROW_BASED_MODES: GridsEditMode[] = [EDIT_MODE.row, EDIT_MODE.form, EDIT_MODE.popup];
export const CELL_BASED_MODES: GridsEditMode[] = [EDIT_MODE.batch, EDIT_MODE.cell];
export const REQUIRED_EDITOR_LABELLEDBY_MODES: GridsEditMode[] = [
  EDIT_MODE.batch, EDIT_MODE.row, EDIT_MODE.cell,
];
export const MODES_WITH_DELAYED_FOCUS: GridsEditMode[] = [EDIT_MODE.row, EDIT_MODE.form];

export const METHOD_NAMES = {
  edit: 'editRow',
  delete: 'deleteRow',
  undelete: 'undeleteRow',
  save: 'saveEditData',
  cancel: 'cancelEditData',
  add: 'addRowByRowIndex',
};
export const ACTION_OPTION_NAMES: Partial<Record<string, EditActions>> = {
  add: 'allowAdding',
  edit: 'allowUpdating',
  delete: 'allowDeleting',
};
export const BUTTON_NAMES = ['edit', 'save', 'cancel', 'delete', 'undelete'];

export const NEW_ROW_TEMP_KEY_PREFIX = '_DX_KEY_';
export const GUID_LENGTH = 36;
export const INSERT_INDEX = '__DX_INSERT_INDEX__';
export const EDITING_NAMESPACE = 'dxDataGridEditing';

export const DEFAULT_START_EDIT_ACTION = 'click';
