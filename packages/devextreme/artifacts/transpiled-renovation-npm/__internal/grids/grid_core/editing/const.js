"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VIEWPORT_TOP_NEW_ROW_POSITION = exports.VIEWPORT_BOTTOM_NEW_ROW_POSITION = exports.TARGET_COMPONENT_NAME = exports.ROW_SELECTED_CLASS = exports.ROW_SELECTED = exports.ROW_REMOVED = exports.ROW_MODIFIED = exports.ROW_INSERTED = exports.ROW_CLASS = exports.ROW_BASED_MODES = exports.REQUIRED_EDITOR_LABELLEDBY_MODES = exports.READONLY_CLASS = exports.PAGE_TOP_NEW_ROW_POSITION = exports.PAGE_BOTTOM_NEW_ROW_POSITION = exports.MODES_WITH_DELAYED_FOCUS = exports.METHOD_NAMES = exports.LINK_ICON_CLASS = exports.LINK_CLASS = exports.LAST_NEW_ROW_POSITION = exports.INSERT_INDEX = exports.FORM_BUTTONS_CONTAINER_CLASS = exports.FOCUS_OVERLAY_CLASS = exports.FOCUSABLE_ELEMENT_SELECTOR = exports.FOCUSABLE_ELEMENT_CLASS = exports.FIRST_NEW_ROW_POSITION = exports.EDIT_ROW = exports.EDIT_POPUP_FORM_CLASS = exports.EDIT_POPUP_CLASS = exports.EDIT_MODE_ROW = exports.EDIT_MODE_POPUP = exports.EDIT_MODE_FORM = exports.EDIT_MODE_CELL = exports.EDIT_MODE_BATCH = exports.EDIT_MODES = exports.EDIT_LINK_CLASS = exports.EDIT_ICON_CLASS = exports.EDIT_FORM_ITEM_CLASS = exports.EDIT_FORM_CLASS = exports.EDIT_BUTTON_CLASS = exports.EDITOR_CELL_CLASS = exports.EDITORS_INPUT_SELECTOR = exports.EDITING_POPUP_OPTION_NAME = exports.EDITING_NAMESPACE = exports.EDITING_FORM_OPTION_NAME = exports.EDITING_EDITROWKEY_OPTION_NAME = exports.EDITING_EDITCOLUMNNAME_OPTION_NAME = exports.EDITING_CHANGES_OPTION_NAME = exports.DROPDOWN_EDITOR_OVERLAY_CLASS = exports.DEFAULT_START_EDIT_ACTION = exports.DATA_ROW_CLASS = exports.DATA_EDIT_DATA_UPDATE_TYPE = exports.DATA_EDIT_DATA_REMOVE_TYPE = exports.DATA_EDIT_DATA_INSERT_TYPE = exports.COMMAND_EDIT_WITH_ICONS_CLASS = exports.COMMAND_EDIT_CLASS = exports.CELL_MODIFIED_CLASS = exports.CELL_MODIFIED = exports.CELL_FOCUS_DISABLED_CLASS = exports.CELL_BASED_MODES = exports.BUTTON_NAMES = exports.BUTTON_CLASS = exports.ADD_ROW_BUTTON_CLASS = exports.ACTION_OPTION_NAMES = void 0;
var _ui = _interopRequireDefault(require("../../../../ui/scroll_view/ui.scrollable"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const EDITOR_CELL_CLASS = exports.EDITOR_CELL_CLASS = 'dx-editor-cell';
const ROW_CLASS = exports.ROW_CLASS = 'dx-row';
const CELL_MODIFIED_CLASS = exports.CELL_MODIFIED_CLASS = 'dx-cell-modified';
const ROW_SELECTED_CLASS = exports.ROW_SELECTED_CLASS = 'dx-selection';
const EDIT_FORM_CLASS = exports.EDIT_FORM_CLASS = 'edit-form';
const DATA_EDIT_DATA_INSERT_TYPE = exports.DATA_EDIT_DATA_INSERT_TYPE = 'insert';
const DATA_EDIT_DATA_REMOVE_TYPE = exports.DATA_EDIT_DATA_REMOVE_TYPE = 'remove';
const EDITING_POPUP_OPTION_NAME = exports.EDITING_POPUP_OPTION_NAME = 'editing.popup';
const EDITING_FORM_OPTION_NAME = exports.EDITING_FORM_OPTION_NAME = 'editing.form';
const EDITING_EDITROWKEY_OPTION_NAME = exports.EDITING_EDITROWKEY_OPTION_NAME = 'editing.editRowKey';
const EDITING_EDITCOLUMNNAME_OPTION_NAME = exports.EDITING_EDITCOLUMNNAME_OPTION_NAME = 'editing.editColumnName';
const TARGET_COMPONENT_NAME = exports.TARGET_COMPONENT_NAME = 'targetComponent';
const EDITORS_INPUT_SELECTOR = exports.EDITORS_INPUT_SELECTOR = 'input:not([type=\'hidden\'])';
const FOCUSABLE_ELEMENT_SELECTOR = exports.FOCUSABLE_ELEMENT_SELECTOR = `[tabindex]:not([disabled]), ${EDITORS_INPUT_SELECTOR}:not([disabled])`;
const EDIT_MODE_BATCH = exports.EDIT_MODE_BATCH = 'batch';
const EDIT_MODE_ROW = exports.EDIT_MODE_ROW = 'row';
const EDIT_MODE_CELL = exports.EDIT_MODE_CELL = 'cell';
const EDIT_MODE_FORM = exports.EDIT_MODE_FORM = 'form';
const EDIT_MODE_POPUP = exports.EDIT_MODE_POPUP = 'popup';
const FIRST_NEW_ROW_POSITION = exports.FIRST_NEW_ROW_POSITION = 'first';
const LAST_NEW_ROW_POSITION = exports.LAST_NEW_ROW_POSITION = 'last';
const PAGE_BOTTOM_NEW_ROW_POSITION = exports.PAGE_BOTTOM_NEW_ROW_POSITION = 'pageBottom';
const PAGE_TOP_NEW_ROW_POSITION = exports.PAGE_TOP_NEW_ROW_POSITION = 'pageTop';
const VIEWPORT_BOTTOM_NEW_ROW_POSITION = exports.VIEWPORT_BOTTOM_NEW_ROW_POSITION = 'viewportBottom';
const VIEWPORT_TOP_NEW_ROW_POSITION = exports.VIEWPORT_TOP_NEW_ROW_POSITION = 'viewportTop';
// eslint-disable-next-line max-len
const EDIT_MODES = exports.EDIT_MODES = [EDIT_MODE_BATCH, EDIT_MODE_ROW, EDIT_MODE_CELL, EDIT_MODE_FORM, EDIT_MODE_POPUP];
const ROW_BASED_MODES = exports.ROW_BASED_MODES = [EDIT_MODE_ROW, EDIT_MODE_FORM, EDIT_MODE_POPUP];
const CELL_BASED_MODES = exports.CELL_BASED_MODES = [EDIT_MODE_BATCH, EDIT_MODE_CELL];
const REQUIRED_EDITOR_LABELLEDBY_MODES = exports.REQUIRED_EDITOR_LABELLEDBY_MODES = [EDIT_MODE_BATCH, EDIT_MODE_ROW, EDIT_MODE_CELL];
const MODES_WITH_DELAYED_FOCUS = exports.MODES_WITH_DELAYED_FOCUS = [EDIT_MODE_ROW, EDIT_MODE_FORM];
const READONLY_CLASS = exports.READONLY_CLASS = 'readonly';
const LINK_CLASS = exports.LINK_CLASS = 'dx-link';
const LINK_ICON_CLASS = exports.LINK_ICON_CLASS = 'dx-link-icon';
const ROW_SELECTED = exports.ROW_SELECTED = 'dx-selection';
const EDIT_BUTTON_CLASS = exports.EDIT_BUTTON_CLASS = 'dx-edit-button';
const COMMAND_EDIT_CLASS = exports.COMMAND_EDIT_CLASS = 'dx-command-edit';
const COMMAND_EDIT_WITH_ICONS_CLASS = exports.COMMAND_EDIT_WITH_ICONS_CLASS = `${COMMAND_EDIT_CLASS}-with-icons`;
const INSERT_INDEX = exports.INSERT_INDEX = '__DX_INSERT_INDEX__';
const ROW_INSERTED = exports.ROW_INSERTED = 'dx-row-inserted';
const ROW_MODIFIED = exports.ROW_MODIFIED = 'dx-row-modified';
const CELL_MODIFIED = exports.CELL_MODIFIED = 'dx-cell-modified';
const EDITING_NAMESPACE = exports.EDITING_NAMESPACE = 'dxDataGridEditing';
const CELL_FOCUS_DISABLED_CLASS = exports.CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const DATA_EDIT_DATA_UPDATE_TYPE = exports.DATA_EDIT_DATA_UPDATE_TYPE = 'update';
const DEFAULT_START_EDIT_ACTION = exports.DEFAULT_START_EDIT_ACTION = 'click';
const EDIT_LINK_CLASS = exports.EDIT_LINK_CLASS = {
  save: 'dx-link-save',
  cancel: 'dx-link-cancel',
  edit: 'dx-link-edit',
  undelete: 'dx-link-undelete',
  delete: 'dx-link-delete',
  add: 'dx-link-add'
};
const EDIT_ICON_CLASS = exports.EDIT_ICON_CLASS = {
  save: 'save',
  cancel: 'revert',
  edit: 'edit',
  undelete: 'revert',
  delete: 'trash',
  add: 'add'
};
const METHOD_NAMES = exports.METHOD_NAMES = {
  edit: 'editRow',
  delete: 'deleteRow',
  undelete: 'undeleteRow',
  save: 'saveEditData',
  cancel: 'cancelEditData',
  add: 'addRowByRowIndex'
};
const ACTION_OPTION_NAMES = exports.ACTION_OPTION_NAMES = {
  add: 'allowAdding',
  edit: 'allowUpdating',
  delete: 'allowDeleting'
};
const BUTTON_NAMES = exports.BUTTON_NAMES = ['edit', 'save', 'cancel', 'delete', 'undelete'];
const EDITING_CHANGES_OPTION_NAME = exports.EDITING_CHANGES_OPTION_NAME = 'editing.changes';
const FOCUS_OVERLAY_CLASS = exports.FOCUS_OVERLAY_CLASS = 'focus-overlay';
const ADD_ROW_BUTTON_CLASS = exports.ADD_ROW_BUTTON_CLASS = 'addrow-button';
const DROPDOWN_EDITOR_OVERLAY_CLASS = exports.DROPDOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';
const DATA_ROW_CLASS = exports.DATA_ROW_CLASS = 'dx-data-row';
const ROW_REMOVED = exports.ROW_REMOVED = 'dx-row-removed';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isRenovatedScrollable = !!_ui.default.IS_RENOVATED_WIDGET;
const EDIT_FORM_ITEM_CLASS = exports.EDIT_FORM_ITEM_CLASS = 'edit-form-item';
const EDIT_POPUP_CLASS = exports.EDIT_POPUP_CLASS = 'edit-popup';
const EDIT_POPUP_FORM_CLASS = exports.EDIT_POPUP_FORM_CLASS = 'edit-popup-form';
const FOCUSABLE_ELEMENT_CLASS = exports.FOCUSABLE_ELEMENT_CLASS = isRenovatedScrollable ? 'dx-scrollable' : 'dx-scrollable-container';
const BUTTON_CLASS = exports.BUTTON_CLASS = 'dx-button';
const FORM_BUTTONS_CONTAINER_CLASS = exports.FORM_BUTTONS_CONTAINER_CLASS = 'form-buttons-container';
const EDIT_ROW = exports.EDIT_ROW = 'dx-edit-row';