export const ATTRIBUTES = {
  ariaColIndex: 'aria-colindex',
  dragCell: 'dx-drag-cell',
};

export const CLASSES = {
  groupFooter: 'group-footer',
  focusState: 'dx-state-focused',
  widget: 'dx-widget',
  revertButton: 'dx-revert-button',
  focused: 'dx-focused',
};

export const COMMAND_CELL_SELECTOR = '[class^=dx-command]';
export const DATEBOX_WIDGET_NAME = 'dxDateBox';

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

export const FOCUS_TYPE_ROW = 'row';
export const FOCUS_TYPE_CELL = 'cell';

export const COLUMN_HEADERS_VIEW = 'columnHeadersView';
export const ROWS_VIEW = 'rowsView';
export const FUNCTIONAL_KEYS = ['shift', 'control', 'alt'];
export const FOCUSED_CELL_KEYS = [
  'upArrow', 'downArrow', 'leftArrow', 'rightArrow', 'home', 'end',
  'tab', 'enter', 'space', 'F2', 'del', 'backspace',
];
export const DRAG_COLUMN_NAME = 'drag';

export enum Direction {
  Next = 'next',
  Previous = 'previous',
}

export enum ViewName {
  Group = 'group',
  Headers = 'headers',
}

export const KEY_CODES = {
  G: 71,
};
