export const ATTRIBUTES = {
  ariaColIndex: 'aria-colindex',
  dragCell: 'dx-drag-cell',
};

export const ROWS_VIEW_CLASS = 'rowsview';
export const TABLE_CLASS = 'table';
export const EDIT_FORM_CLASS = 'edit-form';
export const GROUP_FOOTER_CLASS = 'group-footer';
export const ROW_CLASS = 'dx-row';
export const DATA_ROW_CLASS = 'dx-data-row';
export const GROUP_ROW_CLASS = 'dx-group-row';
export const HEADER_ROW_CLASS = 'dx-header-row';
export const EDIT_FORM_ITEM_CLASS = 'edit-form-item';
export const MASTER_DETAIL_ROW_CLASS = 'dx-master-detail-row';
export const FREESPACE_ROW_CLASS = 'dx-freespace-row';
export const VIRTUAL_ROW_CLASS = 'dx-virtual-row';
export const MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
export const EDITOR_CELL_CLASS = 'dx-editor-cell';
export const DROPDOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';
export const COMMAND_EXPAND_CLASS = 'dx-command-expand';
export const ADAPTIVE_COLUMN_NAME_CLASS = 'dx-command-adaptive';
export const ADAPTIVE_ITEM_TEXT_CLASS = 'dx-adaptive-item-text';
export const COMMAND_SELECT_CLASS = 'dx-command-select';
export const COMMAND_EDIT_CLASS = 'dx-command-edit';
export const COMMAND_CELL_SELECTOR = '[class^=dx-command]';
export const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
export const DATEBOX_WIDGET_NAME = 'dxDateBox';
export const FOCUS_STATE_CLASS = 'dx-state-focused';
export const WIDGET_CLASS = 'dx-widget';
export const REVERT_BUTTON_CLASS = 'dx-revert-button';
export const FOCUSED_CLASS = 'dx-focused';

export const FAST_EDITING_DELETE_KEY = 'delete';

export const INTERACTIVE_ELEMENTS_SELECTOR = `
  input:not([type="hidden"]):not([disabled]),
  textarea:not([disabled]),
  a:not([disabled]),
  select:not([disabled]),
  button:not([disabled]),
  [tabindex]:not([disabled]),
  .dx-checkbox:not([disabled],.dx-state-readonly)
`;
export const NON_FOCUSABLE_ELEMENTS_SELECTOR = `${INTERACTIVE_ELEMENTS_SELECTOR}, .dx-dropdowneditor-icon`;

export const EDIT_MODE_FORM = 'form';

export const FOCUS_TYPE_ROW = 'row';
export const FOCUS_TYPE_CELL = 'cell';

export const COLUMN_HEADERS_VIEW = 'columnHeadersView';
export const ROWS_VIEW = 'rowsView';
export const FUNCTIONAL_KEYS = ['shift', 'control', 'alt'];
