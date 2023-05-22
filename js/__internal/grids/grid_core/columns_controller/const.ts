export const USER_STATE_FIELD_NAMES_15_1 = ['filterValues', 'filterType', 'fixed', 'fixedPosition'];
export const USER_STATE_FIELD_NAMES = ['visibleIndex', 'dataField', 'name', 'dataType', 'width', 'visible', 'sortOrder', 'lastSortOrder', 'sortIndex', 'groupIndex', 'filterValue', 'bufferedFilterValue', 'selectedFilterOperation', 'bufferedSelectedFilterOperation', 'added'].concat(USER_STATE_FIELD_NAMES_15_1);
// eslint-disable-next-line max-len
export const IGNORE_COLUMN_OPTION_NAMES = { visibleWidth: true, bestFitWidth: true, bufferedFilterValue: true };
export const COMMAND_EXPAND_CLASS = 'dx-command-expand';
export const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991/* IE11 */;
export const GROUP_COMMAND_COLUMN_NAME = 'groupExpand';
export const COLUMN_OPTION_REGEXP = /columns\[(\d+)\]\.?/gi;

export const DEFAULT_COLUMN_OPTIONS = {
  visible: true,
  showInColumnChooser: true,
};
export const DATATYPE_OPERATIONS = {
  number: ['=', '<>', '<', '>', '<=', '>=', 'between'],
  string: ['contains', 'notcontains', 'startswith', 'endswith', '=', '<>'],
  date: ['=', '<>', '<', '>', '<=', '>=', 'between'],
  datetime: ['=', '<>', '<', '>', '<=', '>=', 'between'],
};
export const COLUMN_INDEX_OPTIONS = {
  visibleIndex: true,
  groupIndex: true,
  grouped: true,
  sortIndex: true,
  sortOrder: true,
};
export const GROUP_LOCATION = 'group';
export const COLUMN_CHOOSER_LOCATION = 'columnChooser';
