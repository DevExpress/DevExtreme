"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WIDGET_CLASS = exports.VIRTUAL_ROW_CLASS = exports.ROW_CLASS = exports.ROWS_VIEW_CLASS = exports.ROWS_VIEW = exports.REVERT_BUTTON_CLASS = exports.NON_FOCUSABLE_ELEMENTS_SELECTOR = exports.MASTER_DETAIL_ROW_CLASS = exports.MASTER_DETAIL_CELL_CLASS = exports.INTERACTIVE_ELEMENTS_SELECTOR = exports.HEADER_ROW_CLASS = exports.GROUP_ROW_CLASS = exports.GROUP_FOOTER_CLASS = exports.FUNCTIONAL_KEYS = exports.FREESPACE_ROW_CLASS = exports.FOCUS_TYPE_ROW = exports.FOCUS_TYPE_CELL = exports.FOCUS_STATE_CLASS = exports.FOCUSED_CLASS = exports.FAST_EDITING_DELETE_KEY = exports.EDIT_MODE_FORM = exports.EDIT_FORM_ITEM_CLASS = exports.EDIT_FORM_CLASS = exports.EDITOR_CELL_CLASS = exports.DROPDOWN_EDITOR_OVERLAY_CLASS = exports.DATEBOX_WIDGET_NAME = exports.DATA_ROW_CLASS = exports.COMMAND_SELECT_CLASS = exports.COMMAND_EXPAND_CLASS = exports.COMMAND_EDIT_CLASS = exports.COMMAND_CELL_SELECTOR = exports.COLUMN_HEADERS_VIEW = exports.CELL_FOCUS_DISABLED_CLASS = exports.ATTRIBUTES = exports.ADAPTIVE_COLUMN_NAME_CLASS = void 0;
const ATTRIBUTES = exports.ATTRIBUTES = {
  ariaColIndex: 'aria-colindex',
  dragCell: 'dx-drag-cell'
};
const ROWS_VIEW_CLASS = exports.ROWS_VIEW_CLASS = 'rowsview';
const EDIT_FORM_CLASS = exports.EDIT_FORM_CLASS = 'edit-form';
const GROUP_FOOTER_CLASS = exports.GROUP_FOOTER_CLASS = 'group-footer';
const ROW_CLASS = exports.ROW_CLASS = 'dx-row';
const DATA_ROW_CLASS = exports.DATA_ROW_CLASS = 'dx-data-row';
const GROUP_ROW_CLASS = exports.GROUP_ROW_CLASS = 'dx-group-row';
const HEADER_ROW_CLASS = exports.HEADER_ROW_CLASS = 'dx-header-row';
const EDIT_FORM_ITEM_CLASS = exports.EDIT_FORM_ITEM_CLASS = 'edit-form-item';
const MASTER_DETAIL_ROW_CLASS = exports.MASTER_DETAIL_ROW_CLASS = 'dx-master-detail-row';
const FREESPACE_ROW_CLASS = exports.FREESPACE_ROW_CLASS = 'dx-freespace-row';
const VIRTUAL_ROW_CLASS = exports.VIRTUAL_ROW_CLASS = 'dx-virtual-row';
const MASTER_DETAIL_CELL_CLASS = exports.MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
const EDITOR_CELL_CLASS = exports.EDITOR_CELL_CLASS = 'dx-editor-cell';
const DROPDOWN_EDITOR_OVERLAY_CLASS = exports.DROPDOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';
const COMMAND_EXPAND_CLASS = exports.COMMAND_EXPAND_CLASS = 'dx-command-expand';
const ADAPTIVE_COLUMN_NAME_CLASS = exports.ADAPTIVE_COLUMN_NAME_CLASS = 'dx-command-adaptive';
const COMMAND_SELECT_CLASS = exports.COMMAND_SELECT_CLASS = 'dx-command-select';
const COMMAND_EDIT_CLASS = exports.COMMAND_EDIT_CLASS = 'dx-command-edit';
const COMMAND_CELL_SELECTOR = exports.COMMAND_CELL_SELECTOR = '[class^=dx-command]';
const CELL_FOCUS_DISABLED_CLASS = exports.CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const DATEBOX_WIDGET_NAME = exports.DATEBOX_WIDGET_NAME = 'dxDateBox';
const FOCUS_STATE_CLASS = exports.FOCUS_STATE_CLASS = 'dx-state-focused';
const WIDGET_CLASS = exports.WIDGET_CLASS = 'dx-widget';
const REVERT_BUTTON_CLASS = exports.REVERT_BUTTON_CLASS = 'dx-revert-button';
const FOCUSED_CLASS = exports.FOCUSED_CLASS = 'dx-focused';
const FAST_EDITING_DELETE_KEY = exports.FAST_EDITING_DELETE_KEY = 'delete';
const INTERACTIVE_ELEMENTS_SELECTOR = exports.INTERACTIVE_ELEMENTS_SELECTOR = `
  input:not([type="hidden"]):not([disabled]),
  textarea:not([disabled]),
  a:not([disabled]),
  select:not([disabled]),
  button:not([disabled]),
  [tabindex]:not([disabled]),
  .dx-checkbox:not([disabled],.dx-state-readonly)
`;
const NON_FOCUSABLE_ELEMENTS_SELECTOR = exports.NON_FOCUSABLE_ELEMENTS_SELECTOR = `${INTERACTIVE_ELEMENTS_SELECTOR}, .dx-dropdowneditor-icon`;
const EDIT_MODE_FORM = exports.EDIT_MODE_FORM = 'form';
const FOCUS_TYPE_ROW = exports.FOCUS_TYPE_ROW = 'row';
const FOCUS_TYPE_CELL = exports.FOCUS_TYPE_CELL = 'cell';
const COLUMN_HEADERS_VIEW = exports.COLUMN_HEADERS_VIEW = 'columnHeadersView';
const ROWS_VIEW = exports.ROWS_VIEW = 'rowsView';
const FUNCTIONAL_KEYS = exports.FUNCTIONAL_KEYS = ['shift', 'control', 'alt'];