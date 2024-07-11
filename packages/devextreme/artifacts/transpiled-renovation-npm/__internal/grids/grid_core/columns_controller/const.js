"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.USER_STATE_FIELD_NAMES_15_1 = exports.USER_STATE_FIELD_NAMES = exports.MAX_SAFE_INTEGER = exports.IGNORE_COLUMN_OPTION_NAMES = exports.GROUP_LOCATION = exports.GROUP_COMMAND_COLUMN_NAME = exports.DETAIL_COMMAND_COLUMN_NAME = exports.DEFAULT_COLUMN_OPTIONS = exports.DATATYPE_OPERATIONS = exports.COMMAND_EXPAND_CLASS = exports.COLUMN_OPTION_REGEXP = exports.COLUMN_INDEX_OPTIONS = exports.COLUMN_CHOOSER_LOCATION = void 0;
const USER_STATE_FIELD_NAMES_15_1 = exports.USER_STATE_FIELD_NAMES_15_1 = ['filterValues', 'filterType', 'fixed', 'fixedPosition'];
const USER_STATE_FIELD_NAMES = exports.USER_STATE_FIELD_NAMES = ['visibleIndex', 'dataField', 'name', 'dataType', 'width', 'visible', 'sortOrder', 'lastSortOrder', 'sortIndex', 'groupIndex', 'filterValue', 'bufferedFilterValue', 'selectedFilterOperation', 'bufferedSelectedFilterOperation', 'added'].concat(USER_STATE_FIELD_NAMES_15_1);
// eslint-disable-next-line max-len
const IGNORE_COLUMN_OPTION_NAMES = exports.IGNORE_COLUMN_OPTION_NAMES = {
  visibleWidth: true,
  bestFitWidth: true,
  bufferedFilterValue: true
};
const COMMAND_EXPAND_CLASS = exports.COMMAND_EXPAND_CLASS = 'dx-command-expand';
const MAX_SAFE_INTEGER = exports.MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991 /* IE11 */;
const GROUP_COMMAND_COLUMN_NAME = exports.GROUP_COMMAND_COLUMN_NAME = 'groupExpand';
const DETAIL_COMMAND_COLUMN_NAME = exports.DETAIL_COMMAND_COLUMN_NAME = 'detailExpand';
const COLUMN_OPTION_REGEXP = exports.COLUMN_OPTION_REGEXP = /columns\[(\d+)\]\.?/gi;
const DEFAULT_COLUMN_OPTIONS = exports.DEFAULT_COLUMN_OPTIONS = {
  visible: true,
  showInColumnChooser: true
};
const DATATYPE_OPERATIONS = exports.DATATYPE_OPERATIONS = {
  number: ['=', '<>', '<', '>', '<=', '>=', 'between'],
  string: ['contains', 'notcontains', 'startswith', 'endswith', '=', '<>'],
  date: ['=', '<>', '<', '>', '<=', '>=', 'between'],
  datetime: ['=', '<>', '<', '>', '<=', '>=', 'between']
};
const COLUMN_INDEX_OPTIONS = exports.COLUMN_INDEX_OPTIONS = {
  visibleIndex: true,
  groupIndex: true,
  grouped: true,
  sortIndex: true,
  sortOrder: true
};
const GROUP_LOCATION = exports.GROUP_LOCATION = 'group';
const COLUMN_CHOOSER_LOCATION = exports.COLUMN_CHOOSER_LOCATION = 'columnChooser';