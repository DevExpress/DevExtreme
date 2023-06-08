export const EDITOR_CELL_CLASS = 'dx-editor-cell';
export const ROW_CLASS = 'dx-row';
export const CELL_MODIFIED_CLASS = 'dx-cell-modified';
export const ROW_SELECTED_CLASS = 'dx-selection';
export const EDIT_FORM_CLASS = 'edit-form';

export const DATA_EDIT_DATA_INSERT_TYPE = 'insert';
export const DATA_EDIT_DATA_REMOVE_TYPE = 'remove';

export const EDITING_POPUP_OPTION_NAME = 'editing.popup';
export const EDITING_FORM_OPTION_NAME = 'editing.form';
export const EDITING_EDITROWKEY_OPTION_NAME = 'editing.editRowKey';
export const EDITING_EDITCOLUMNNAME_OPTION_NAME = 'editing.editColumnName';

export const TARGET_COMPONENT_NAME = 'targetComponent';

export const EDITORS_INPUT_SELECTOR = 'input:not([type=\'hidden\'])';
export const FOCUSABLE_ELEMENT_SELECTOR = `[tabindex], ${EDITORS_INPUT_SELECTOR}`;

export const EDIT_MODE_BATCH = 'batch';
export const EDIT_MODE_ROW = 'row';
export const EDIT_MODE_CELL = 'cell';
export const EDIT_MODE_FORM = 'form';
export const EDIT_MODE_POPUP = 'popup';

export const FIRST_NEW_ROW_POSITION = 'first';
export const LAST_NEW_ROW_POSITION = 'last';
export const PAGE_BOTTOM_NEW_ROW_POSITION = 'pageBottom';
export const PAGE_TOP_NEW_ROW_POSITION = 'pageTop';
export const VIEWPORT_BOTTOM_NEW_ROW_POSITION = 'viewportBottom';
export const VIEWPORT_TOP_NEW_ROW_POSITION = 'viewportTop';

// eslint-disable-next-line max-len
export const EDIT_MODES = [EDIT_MODE_BATCH, EDIT_MODE_ROW, EDIT_MODE_CELL, EDIT_MODE_FORM, EDIT_MODE_POPUP];
export const ROW_BASED_MODES = [EDIT_MODE_ROW, EDIT_MODE_FORM, EDIT_MODE_POPUP];
export const MODES_WITH_DELAYED_FOCUS = [EDIT_MODE_ROW, EDIT_MODE_FORM];

export const READONLY_CLASS = 'readonly';
export const LINK_CLASS = 'dx-link';
export const ROW_SELECTED = 'dx-selection';
export const EDIT_BUTTON_CLASS = 'dx-edit-button';
export const COMMAND_EDIT_CLASS = 'dx-command-edit';
export const COMMAND_EDIT_WITH_ICONS_CLASS = `${COMMAND_EDIT_CLASS}-with-icons`;

export const INSERT_INDEX = '__DX_INSERT_INDEX__';
export const ROW_INSERTED = 'dx-row-inserted';
export const ROW_MODIFIED = 'dx-row-modified';
export const CELL_MODIFIED = 'dx-cell-modified';
export const EDITING_NAMESPACE = 'dxDataGridEditing';

export const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';

export const DATA_EDIT_DATA_UPDATE_TYPE = 'update';

export const DEFAULT_START_EDIT_ACTION = 'click';

export const EDIT_LINK_CLASS = {
  save: 'dx-link-save',
  cancel: 'dx-link-cancel',
  edit: 'dx-link-edit',
  undelete: 'dx-link-undelete',
  delete: 'dx-link-delete',
  add: 'dx-link-add',
};
export const EDIT_ICON_CLASS = {
  save: 'save',
  cancel: 'revert',
  edit: 'edit',
  undelete: 'revert',
  delete: 'trash',
  add: 'add',
};
export const METHOD_NAMES = {
  edit: 'editRow',
  delete: 'deleteRow',
  undelete: 'undeleteRow',
  save: 'saveEditData',
  cancel: 'cancelEditData',
  add: 'addRowByRowIndex',
};
export const ACTION_OPTION_NAMES = {
  add: 'allowAdding',
  edit: 'allowUpdating',
  delete: 'allowDeleting',
};
export const BUTTON_NAMES = ['edit', 'save', 'cancel', 'delete', 'undelete'];

export const EDITING_CHANGES_OPTION_NAME = 'editing.changes';
