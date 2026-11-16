import type { FilterRowOperationDescriptions as OperationDescriptions } from '@js/common/grids';

export const CLASSES = {
  filterRow: 'filter-row',
  filterRangeContent: 'dx-filter-range-content',
  filterRangeOverlay: 'filter-range-overlay',
  filterRangeStart: 'filter-range-start',
  filterRangeEnd: 'filter-range-end',
  editorWithMenu: 'dx-editor-with-menu',
  editorContainer: 'dx-editor-container',
  editorCell: 'dx-editor-cell',
  filterMenu: 'dx-filter-menu',
  applyButton: 'dx-apply-button',
  highlightOutline: 'dx-highlight-outline',
  focused: 'dx-focused',
  filterModified: 'dx-filter-modified',
};

export const OPERATION_ICONS: Partial<Record<string, string>> = {
  '=': 'filter-operation-equals',
  '<>': 'filter-operation-not-equals',
  '<': 'filter-operation-less',
  '<=': 'filter-operation-less-equal',
  '>': 'filter-operation-greater',
  '>=': 'filter-operation-greater-equal',
  default: 'filter-operation-default',
  // eslint-disable-next-line spellcheck/spell-checker
  notcontains: 'filter-operation-not-contains',
  contains: 'filter-operation-contains',
  startswith: 'filter-operation-starts-with',
  endswith: 'filter-operation-ends-with',
  between: 'filter-operation-between',
};

export const OPERATION_DESCRIPTORS: Partial<Record<string, keyof OperationDescriptions>> = {
  '=': 'equal',
  '<>': 'notEqual',
  '<': 'lessThan',
  '<=': 'lessThanOrEqual',
  '>': 'greaterThan',
  '>=': 'greaterThanOrEqual',
  startswith: 'startsWith',
  contains: 'contains',
  // eslint-disable-next-line spellcheck/spell-checker
  notcontains: 'notContains',
  endswith: 'endsWith',
  between: 'between',
};

export const FILTERING_TIMEOUT = 700;

export const CORRECT_FILTER_RANGE_OVERLAY_WIDTH = 1;

export const EDITORS_INPUT_SELECTOR = 'input:not([type=\'hidden\'])';

export const BETWEEN_OPERATION_DATA_TYPES = ['date', 'datetime', 'number'];

export const MULTISELECT_EDITOR_NAMES = ['dxTagBox', 'dxDateRangeBox', 'dxCalendar', 'dxRangeSlider'];
