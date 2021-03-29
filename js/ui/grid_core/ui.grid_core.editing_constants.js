export const EDITOR_CELL_CLASS = 'dx-editor-cell';
export const ROW_CLASS = 'dx-row';
export const CELL_MODIFIED_CLASS = 'dx-cell-modified';
export const ROW_SELECTED_CLASS = 'dx-selection';
export const EDIT_FORM_CLASS = 'edit-form';

export const DATA_EDIT_DATA_INSERT_TYPE = 'insert';
export const DATA_EDIT_DATA_REMOVE_TYPE = 'remove';

export const EDITING_POPUP_OPTION_NAME = 'editing.popup';
export const EDITING_EDITROWKEY_OPTION_NAME = 'editing.editRowKey';
export const EDITING_EDITCOLUMNNAME_OPTION_NAME = 'editing.editColumnName';

export const TARGET_COMPONENT_NAME = 'targetComponent';

export const EDITORS_INPUT_SELECTOR = 'input:not([type=\'hidden\'])';
export const FOCUSABLE_ELEMENT_SELECTOR = '[tabindex], ' + EDITORS_INPUT_SELECTOR;

export const EDIT_MODE_BATCH = 'batch';
export const EDIT_MODE_ROW = 'row';
export const EDIT_MODE_CELL = 'cell';
export const EDIT_MODE_FORM = 'form';
export const EDIT_MODE_POPUP = 'popup';

export const EDIT_MODES = [EDIT_MODE_BATCH, EDIT_MODE_ROW, EDIT_MODE_CELL, EDIT_MODE_FORM, EDIT_MODE_POPUP];
export const ROW_BASED_MODES = [EDIT_MODE_ROW, EDIT_MODE_FORM, EDIT_MODE_POPUP];
export const MODES_WITH_DELAYED_FOCUS = [EDIT_MODE_ROW, EDIT_MODE_FORM];
