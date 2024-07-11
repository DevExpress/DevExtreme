"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyUserState = exports.addExpandColumn = void 0;
exports.assignColumns = assignColumns;
exports.isCustomCommandColumn = exports.isColumnFixed = exports.getValueDataType = exports.getSerializationFormat = exports.getRowCount = exports.getParentBandColumns = exports.getFixedPosition = exports.getDataColumns = exports.getCustomizeTextByDataType = exports.getColumnIndexByVisibleIndex = exports.getColumnFullPath = exports.getColumnByIndexes = exports.getChildrenByBandColumn = exports.getAlignmentByDataType = exports.fireOptionChanged = exports.fireColumnsChanged = exports.findColumn = exports.digitsCount = exports.defaultSetCellValue = exports.customizeTextForBooleanDataType = exports.createColumnsFromOptions = exports.createColumnsFromDataSource = exports.createColumn = exports.convertOwnerBandToColumnReference = exports.columnOptionCore = exports.calculateColspan = void 0;
exports.isSortOrderValid = isSortOrderValid;
exports.updateSortOrderWhenGrouping = exports.updateSerializers = exports.updateIndexes = exports.updateColumnVisibleIndexes = exports.updateColumnSortIndexes = exports.updateColumnIndexes = exports.updateColumnGroupIndexes = exports.updateColumnChanges = exports.strictParseNumber = exports.sortColumns = exports.setFilterOperationsAsDefaultValues = exports.resetColumnsCache = exports.resetBandColumnsCache = exports.processExpandColumns = exports.processBandColumns = exports.numberToString = exports.moveColumnToGroup = exports.mergeColumns = void 0;
var _array = require("../../../../core/utils/array");
var _common = require("../../../../core/utils/common");
var _data = require("../../../../core/utils/data");
var _date_serialization = _interopRequireDefault(require("../../../../core/utils/date_serialization"));
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _object = require("../../../../core/utils/object");
var _position = require("../../../../core/utils/position");
var _type = require("../../../../core/utils/type");
var _variable_wrapper = _interopRequireDefault(require("../../../../core/utils/variable_wrapper"));
var _number = _interopRequireDefault(require("../../../../localization/number"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _const = require("./const");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable prefer-destructuring */

const setFilterOperationsAsDefaultValues = function (column) {
  column.filterOperations = column.defaultFilterOperations;
};
exports.setFilterOperationsAsDefaultValues = setFilterOperationsAsDefaultValues;
let globalColumnId = 1;
const createColumn = function (that, columnOptions, userStateColumnOptions, bandColumn) {
  let commonColumnOptions = {};
  if (columnOptions) {
    if ((0, _type.isString)(columnOptions)) {
      columnOptions = {
        dataField: columnOptions
      };
    }
    that.setName(columnOptions);
    let result = {};
    if (columnOptions.command) {
      result = (0, _object.deepExtendArraySafe)(commonColumnOptions, columnOptions);
    } else {
      commonColumnOptions = that.getCommonSettings(columnOptions);
      if (userStateColumnOptions && userStateColumnOptions.name && userStateColumnOptions.dataField) {
        columnOptions = (0, _extend.extend)({}, columnOptions, {
          dataField: userStateColumnOptions.dataField
        });
      }
      const calculatedColumnOptions = that._createCalculatedColumnOptions(columnOptions, bandColumn);
      if (!columnOptions.type) {
        result = {
          headerId: `dx-col-${globalColumnId++}`
        };
      }
      result = (0, _object.deepExtendArraySafe)(result, _const.DEFAULT_COLUMN_OPTIONS);
      (0, _object.deepExtendArraySafe)(result, commonColumnOptions);
      (0, _object.deepExtendArraySafe)(result, calculatedColumnOptions);
      (0, _object.deepExtendArraySafe)(result, columnOptions);
      (0, _object.deepExtendArraySafe)(result, {
        selector: null
      });
    }
    if (columnOptions.filterOperations === columnOptions.defaultFilterOperations) {
      setFilterOperationsAsDefaultValues(result);
    }
    return result;
  }
};
exports.createColumn = createColumn;
const createColumnsFromOptions = function (that, columnsOptions, bandColumn, createdColumnCount) {
  let result = [];
  if (columnsOptions) {
    (0, _iterator.each)(columnsOptions, (index, columnOptions) => {
      const currentIndex = (createdColumnCount ?? 0) + result.length;
      const userStateColumnOptions = that._columnsUserState && checkUserStateColumn(columnOptions, that._columnsUserState[currentIndex]) && that._columnsUserState[currentIndex];
      const column = createColumn(that, columnOptions, userStateColumnOptions, bandColumn);
      if (column) {
        if (bandColumn) {
          column.ownerBand = bandColumn;
        }
        result.push(column);
        if (column.columns) {
          result = result.concat(createColumnsFromOptions(that, column.columns, column, result.length));
          delete column.columns;
          column.hasColumns = true;
        }
      }
    });
  }
  return result;
};
exports.createColumnsFromOptions = createColumnsFromOptions;
const getParentBandColumns = function (columnIndex, columnParentByIndex) {
  const result = [];
  let parent = columnParentByIndex[columnIndex];
  while (parent) {
    result.unshift(parent);
    columnIndex = parent.index;
    parent = columnParentByIndex[columnIndex];
  }
  return result;
};
exports.getParentBandColumns = getParentBandColumns;
const getChildrenByBandColumn = function (columnIndex, columnChildrenByIndex, recursive) {
  let result = [];
  const children = columnChildrenByIndex[columnIndex];
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const column = children[i];
      if (!(0, _type.isDefined)(column.groupIndex) || column.showWhenGrouped) {
        result.push(column);
        if (recursive && column.isBand) {
          result = result.concat(getChildrenByBandColumn(column.index, columnChildrenByIndex, recursive));
        }
      }
    }
  }
  return result;
};
exports.getChildrenByBandColumn = getChildrenByBandColumn;
const getColumnByIndexes = function (that, columnIndexes) {
  let result;
  let columns;
  const bandColumnsCache = that.getBandColumnsCache();
  const callbackFilter = function (column) {
    const ownerBand = result ? result.index : undefined;
    return column.ownerBand === ownerBand;
  };
  if (bandColumnsCache.isPlain) {
    result = that._columns[columnIndexes[0]];
  } else {
    columns = that._columns.filter(callbackFilter);
    for (let i = 0; i < columnIndexes.length; i++) {
      result = columns[columnIndexes[i]];
      if (result) {
        columns = that._columns.filter(callbackFilter);
      }
    }
  }
  return result;
};
exports.getColumnByIndexes = getColumnByIndexes;
const getColumnFullPath = function (that, column) {
  let result = [];
  let columns;
  const bandColumnsCache = that.getBandColumnsCache();
  const callbackFilter = function (item) {
    return item.ownerBand === column.ownerBand;
  };
  if (bandColumnsCache.isPlain) {
    const columnIndex = that._columns.indexOf(column);
    if (columnIndex >= 0) {
      result = [`columns[${columnIndex}]`];
    }
  } else {
    columns = that._columns.filter(callbackFilter);
    while (columns.length && columns.indexOf(column) !== -1) {
      result.unshift(`columns[${columns.indexOf(column)}]`);
      column = bandColumnsCache.columnParentByIndex[column.index];
      columns = column ? that._columns.filter(callbackFilter) : [];
    }
  }
  return result.join('.');
};
exports.getColumnFullPath = getColumnFullPath;
const calculateColspan = function (that, columnID) {
  let colspan = 0;
  const columns = that.getChildrenByBandColumn(columnID, true);
  (0, _iterator.each)(columns, (_, column) => {
    if (column.isBand) {
      column.colspan = column.colspan || calculateColspan(that, column.index);
      colspan += column.colspan || 1;
    } else {
      colspan += 1;
    }
  });
  return colspan;
};
exports.calculateColspan = calculateColspan;
const processBandColumns = function (that, columns, bandColumnsCache) {
  let rowspan;
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.visible || column.command) {
      if (column.isBand) {
        column.colspan = column.colspan || calculateColspan(that, column.index);
      }
      if (!column.isBand || !column.colspan) {
        rowspan = that.getRowCount();
        if (!column.command && (!(0, _type.isDefined)(column.groupIndex) || column.showWhenGrouped)) {
          rowspan -= getParentBandColumns(column.index, bandColumnsCache.columnParentByIndex).length;
        }
        if (rowspan > 1) {
          column.rowspan = rowspan;
        }
      }
    }
  }
};
exports.processBandColumns = processBandColumns;
const getValueDataType = function (value) {
  let dataType = (0, _type.type)(value);
  if (dataType !== 'string' && dataType !== 'boolean' && dataType !== 'number' && dataType !== 'date' && dataType !== 'object') {
    dataType = undefined;
  }
  return dataType;
};
exports.getValueDataType = getValueDataType;
const getSerializationFormat = function (dataType, value) {
  // eslint-disable-next-line default-case
  switch (dataType) {
    case 'date':
    case 'datetime':
      return _date_serialization.default.getDateSerializationFormat(value);
    case 'number':
      if ((0, _type.isString)(value)) {
        return 'string';
      }
      if ((0, _type.isNumeric)(value)) {
        return null;
      }
  }
};
exports.getSerializationFormat = getSerializationFormat;
const updateSerializers = function (options, dataType) {
  if (!options.deserializeValue) {
    if (_m_utils.default.isDateType(dataType)) {
      options.deserializeValue = function (value) {
        return _date_serialization.default.deserializeDate(value);
      };
      options.serializeValue = function (value) {
        return (0, _type.isString)(value) ? value : _date_serialization.default.serializeDate(value, this.serializationFormat);
      };
    }
    if (dataType === 'number') {
      options.deserializeValue = function (value) {
        const parsedValue = parseFloat(value);
        return isNaN(parsedValue) ? value : parsedValue;
      };
      options.serializeValue = function (value, target) {
        if (target === 'filter') return value;
        return (0, _type.isDefined)(value) && this.serializationFormat === 'string' ? value.toString() : value;
      };
    }
  }
};
exports.updateSerializers = updateSerializers;
const getAlignmentByDataType = function (dataType, isRTL) {
  switch (dataType) {
    case 'number':
      return 'right';
    case 'boolean':
      return 'center';
    default:
      return (0, _position.getDefaultAlignment)(isRTL);
  }
};
exports.getAlignmentByDataType = getAlignmentByDataType;
const customizeTextForBooleanDataType = function (e) {
  if (e.value === true) {
    return this.trueText || 'true';
  }
  if (e.value === false) {
    return this.falseText || 'false';
  }
  return e.valueText || '';
};
exports.customizeTextForBooleanDataType = customizeTextForBooleanDataType;
const getCustomizeTextByDataType = function (dataType) {
  if (dataType === 'boolean') {
    return customizeTextForBooleanDataType;
  }
};
exports.getCustomizeTextByDataType = getCustomizeTextByDataType;
const createColumnsFromDataSource = function (that, dataSource) {
  const firstItems = that._getFirstItems(dataSource);
  let fieldName;
  const processedFields = {};
  const result = [];
  for (let i = 0; i < firstItems.length; i++) {
    if (firstItems[i]) {
      // eslint-disable-next-line no-restricted-syntax
      for (fieldName in firstItems[i]) {
        if (!(0, _type.isFunction)(firstItems[i][fieldName]) || _variable_wrapper.default.isWrapped(firstItems[i][fieldName])) {
          processedFields[fieldName] = true;
        }
      }
    }
  }
  // eslint-disable-next-line no-restricted-syntax
  for (fieldName in processedFields) {
    if (fieldName.indexOf('__') !== 0) {
      const column = createColumn(that, fieldName);
      result.push(column);
    }
  }
  return result;
};
exports.createColumnsFromDataSource = createColumnsFromDataSource;
const updateColumnIndexes = function (that) {
  (0, _iterator.each)(that._columns, (index, column) => {
    column.index = index;
  });
  (0, _iterator.each)(that._columns, (index, column) => {
    if ((0, _type.isObject)(column.ownerBand)) {
      column.ownerBand = column.ownerBand.index;
    }
  });
  (0, _iterator.each)(that._commandColumns, (index, column) => {
    column.index = -(index + 1);
  });
};
exports.updateColumnIndexes = updateColumnIndexes;
const updateColumnGroupIndexes = function (that, currentColumn) {
  (0, _array.normalizeIndexes)(that._columns, 'groupIndex', currentColumn, column => {
    const {
      grouped
    } = column;
    delete column.grouped;
    return grouped;
  });
};
exports.updateColumnGroupIndexes = updateColumnGroupIndexes;
const updateColumnSortIndexes = function (that, currentColumn) {
  (0, _iterator.each)(that._columns, (index, column) => {
    if ((0, _type.isDefined)(column.sortIndex) && !isSortOrderValid(column.sortOrder)) {
      delete column.sortIndex;
    }
  });
  (0, _array.normalizeIndexes)(that._columns, 'sortIndex', currentColumn, column => !(0, _type.isDefined)(column.groupIndex) && isSortOrderValid(column.sortOrder));
};
exports.updateColumnSortIndexes = updateColumnSortIndexes;
const updateColumnVisibleIndexes = function (that, currentColumn) {
  let column;
  const result = [];
  const bandColumnsCache = that.getBandColumnsCache();
  const bandedColumns = [];
  const columns = that._columns.filter(column => !column.command);
  for (let i = 0; i < columns.length; i++) {
    column = columns[i];
    const parentBandColumns = getParentBandColumns(i, bandColumnsCache.columnParentByIndex);
    if (parentBandColumns.length) {
      bandedColumns.push(column);
    } else {
      result.push(column);
    }
  }
  (0, _array.normalizeIndexes)(bandedColumns, 'visibleIndex', currentColumn);
  (0, _array.normalizeIndexes)(result, 'visibleIndex', currentColumn);
};
exports.updateColumnVisibleIndexes = updateColumnVisibleIndexes;
const getColumnIndexByVisibleIndex = function (that, visibleIndex, location) {
  // @ts-expect-error
  const rowIndex = (0, _type.isObject)(visibleIndex) ? visibleIndex.rowIndex : null;
  const columns = location === _const.GROUP_LOCATION ? that.getGroupColumns() : location === _const.COLUMN_CHOOSER_LOCATION ? that.getChooserColumns() : that.getVisibleColumns(rowIndex);
  let column;
  // @ts-expect-error
  visibleIndex = (0, _type.isObject)(visibleIndex) ? visibleIndex.columnIndex : visibleIndex;
  column = columns[visibleIndex];
  if (column && column.type === _const.GROUP_COMMAND_COLUMN_NAME) {
    column = that._columns.filter(col => column.type === col.type)[0] || column;
  }
  return column && (0, _type.isDefined)(column.index) ? column.index : -1;
};
exports.getColumnIndexByVisibleIndex = getColumnIndexByVisibleIndex;
const moveColumnToGroup = function (that, column, groupIndex) {
  const groupColumns = that.getGroupColumns();
  let i;
  if (groupIndex >= 0) {
    for (i = 0; i < groupColumns.length; i++) {
      if (groupColumns[i].groupIndex >= groupIndex) {
        groupColumns[i].groupIndex++;
      }
    }
  } else {
    groupIndex = 0;
    for (i = 0; i < groupColumns.length; i++) {
      groupIndex = Math.max(groupIndex, groupColumns[i].groupIndex + 1);
    }
  }
  return groupIndex;
};
exports.moveColumnToGroup = moveColumnToGroup;
function checkUserStateColumn(column, userStateColumn) {
  return column && userStateColumn && userStateColumn.name === (column.name || column.dataField) && (userStateColumn.dataField === column.dataField || column.name);
}
const applyUserState = function (that) {
  const columnsUserState = that._columnsUserState;
  const ignoreColumnOptionNames = that._ignoreColumnOptionNames || [];
  const columns = that._columns;
  const columnCountById = {};
  let resultColumns = [];
  let allColumnsHaveState = true;
  const userStateColumnIndexes = [];
  let column;
  let userStateColumnIndex;
  let i;
  function applyFieldsState(column, userStateColumn) {
    if (!userStateColumn) return;
    for (let index = 0; index < _const.USER_STATE_FIELD_NAMES.length; index++) {
      const fieldName = _const.USER_STATE_FIELD_NAMES[index];
      if (ignoreColumnOptionNames.includes(fieldName)) continue;
      if (fieldName === 'dataType') {
        column[fieldName] = column[fieldName] || userStateColumn[fieldName];
      } else if (_const.USER_STATE_FIELD_NAMES_15_1.includes(fieldName)) {
        if (fieldName in userStateColumn) {
          column[fieldName] = userStateColumn[fieldName];
        }
      } else {
        if (fieldName === 'selectedFilterOperation' && userStateColumn[fieldName]) {
          column.defaultSelectedFilterOperation = column[fieldName] || null;
        }
        column[fieldName] = userStateColumn[fieldName];
      }
    }
  }
  function findUserStateColumn(columnsUserState, column) {
    const id = column.name || column.dataField;
    let count = columnCountById[id] || 0;
    for (let j = 0; j < columnsUserState.length; j++) {
      if (checkUserStateColumn(column, columnsUserState[j])) {
        if (count) {
          count--;
        } else {
          columnCountById[id] = columnCountById[id] || 0;
          columnCountById[id]++;
          return j;
        }
      }
    }
    return -1;
  }
  if (columnsUserState) {
    for (i = 0; i < columns.length; i++) {
      userStateColumnIndex = findUserStateColumn(columnsUserState, columns[i]);
      allColumnsHaveState = allColumnsHaveState && userStateColumnIndex >= 0;
      userStateColumnIndexes.push(userStateColumnIndex);
    }
    for (i = 0; i < columns.length; i++) {
      column = columns[i];
      userStateColumnIndex = userStateColumnIndexes[i];
      if (that._hasUserState || allColumnsHaveState) {
        applyFieldsState(column, columnsUserState[userStateColumnIndex]);
      }
      if (userStateColumnIndex >= 0 && (0, _type.isDefined)(columnsUserState[userStateColumnIndex].initialIndex)) {
        resultColumns[userStateColumnIndex] = column;
      } else {
        resultColumns.push(column);
      }
    }
    let hasAddedBands = false;
    for (i = 0; i < columnsUserState.length; i++) {
      const columnUserState = columnsUserState[i];
      if (columnUserState.added && findUserStateColumn(columns, columnUserState) < 0) {
        column = createColumn(that, columnUserState.added);
        applyFieldsState(column, columnUserState);
        resultColumns.push(column);
        if (columnUserState.added.columns) {
          hasAddedBands = true;
        }
      }
    }
    if (hasAddedBands) {
      updateColumnIndexes(that);
      resultColumns = createColumnsFromOptions(that, resultColumns);
    }
    assignColumns(that, resultColumns);
  }
};
exports.applyUserState = applyUserState;
const updateIndexes = function (that, column) {
  updateColumnIndexes(that);
  updateColumnGroupIndexes(that, column);
  updateColumnSortIndexes(that, column);
  resetBandColumnsCache(that);
  updateColumnVisibleIndexes(that, column);
};
exports.updateIndexes = updateIndexes;
const resetColumnsCache = function (that) {
  that.resetColumnsCache();
};
exports.resetColumnsCache = resetColumnsCache;
function assignColumns(that, columns) {
  that._previousColumns = that._columns;
  that._columns = columns;
  resetColumnsCache(that);
  that.updateColumnDataTypes();
}
const updateColumnChanges = function (that, changeType, optionName, columnIndex) {
  const columnChanges = that._columnChanges || {
    optionNames: {
      length: 0
    },
    changeTypes: {
      length: 0
    },
    columnIndex // TODO replace columnIndex -> columnIndices
  };
  optionName = optionName || 'all';
  optionName = optionName.split('.')[0];
  const {
    changeTypes
  } = columnChanges;
  if (changeType && !changeTypes[changeType]) {
    changeTypes[changeType] = true;
    changeTypes.length++;
  }
  const {
    optionNames
  } = columnChanges;
  if (optionName && !optionNames[optionName]) {
    optionNames[optionName] = true;
    optionNames.length++;
  }
  if (columnIndex === undefined || columnIndex !== columnChanges.columnIndex) {
    if ((0, _type.isDefined)(columnIndex)) {
      columnChanges.columnIndices ?? (columnChanges.columnIndices = []);
      if ((0, _type.isDefined)(columnChanges.columnIndex)) {
        columnChanges.columnIndices.push(columnChanges.columnIndex);
      }
      columnChanges.columnIndices.push(columnIndex);
    }
    delete columnChanges.columnIndex;
  }
  that._columnChanges = columnChanges;
  resetColumnsCache(that);
};
exports.updateColumnChanges = updateColumnChanges;
const fireColumnsChanged = function (that) {
  const onColumnsChanging = that.option('onColumnsChanging');
  const columnChanges = that._columnChanges;
  const reinitOptionNames = ['dataField', 'lookup', 'dataType', 'columns'];
  const needReinit = options => options && reinitOptionNames.some(name => options[name]);
  if (that.isInitialized() && !that._updateLockCount && columnChanges) {
    if (onColumnsChanging) {
      that._updateLockCount++;
      onColumnsChanging((0, _extend.extend)({
        component: that.component
      }, columnChanges));
      that._updateLockCount--;
    }
    that._columnChanges = undefined;
    if (needReinit(columnChanges.optionNames)) {
      that._reinitAfterLookupChanges = columnChanges === null || columnChanges === void 0 ? void 0 : columnChanges.optionNames.lookup;
      that.reinit();
      that._reinitAfterLookupChanges = undefined;
    } else {
      that.columnsChanged.fire(columnChanges);
    }
  }
};
exports.fireColumnsChanged = fireColumnsChanged;
const updateSortOrderWhenGrouping = function (that, column, groupIndex, prevGroupIndex) {
  const columnWasGrouped = prevGroupIndex >= 0;
  if (groupIndex >= 0) {
    if (!columnWasGrouped) {
      column.lastSortOrder = column.sortOrder;
    }
  } else {
    const sortMode = that.option('sorting.mode');
    let sortOrder = column.lastSortOrder;
    if (sortMode === 'single') {
      const sortedByAnotherColumn = that._columns.some(col => col !== column && (0, _type.isDefined)(col.sortIndex));
      if (sortedByAnotherColumn) {
        sortOrder = undefined;
      }
    }
    column.sortOrder = sortOrder;
  }
};
exports.updateSortOrderWhenGrouping = updateSortOrderWhenGrouping;
const fireOptionChanged = function (that, options) {
  const {
    value
  } = options;
  const {
    optionName
  } = options;
  const {
    prevValue
  } = options;
  const {
    fullOptionName
  } = options;
  const fullOptionPath = `${fullOptionName}.${optionName}`;
  if (!_const.IGNORE_COLUMN_OPTION_NAMES[optionName] && that._skipProcessingColumnsChange !== fullOptionPath) {
    that._skipProcessingColumnsChange = fullOptionPath;
    that.component._notifyOptionChanged(fullOptionPath, value, prevValue);
    that._skipProcessingColumnsChange = false;
  }
};
exports.fireOptionChanged = fireOptionChanged;
const columnOptionCore = function (that, column, optionName, value, notFireEvent) {
  const optionGetter = (0, _data.compileGetter)(optionName);
  const columnIndex = column.index;
  let columns;
  let changeType;
  let initialColumn;
  if (arguments.length === 3) {
    // @ts-expect-error
    return optionGetter(column, {
      functionsAsIs: true
    });
  }
  // @ts-expect-error
  const prevValue = optionGetter(column, {
    functionsAsIs: true
  });
  if (!(0, _common.equalByValue)(prevValue, value, {
    maxDepth: 5
  })) {
    if (optionName === 'groupIndex' || optionName === 'calculateGroupValue') {
      changeType = 'grouping';
      updateSortOrderWhenGrouping(that, column, value, prevValue);
    } else if (optionName === 'sortIndex' || optionName === 'sortOrder' || optionName === 'calculateSortValue') {
      changeType = 'sorting';
    } else {
      changeType = 'columns';
    }
    const optionSetter = (0, _data.compileSetter)(optionName);
    // @ts-expect-error
    optionSetter(column, value, {
      functionsAsIs: true
    });
    const fullOptionName = getColumnFullPath(that, column);
    if (_const.COLUMN_INDEX_OPTIONS[optionName]) {
      updateIndexes(that, column);
      // @ts-expect-error
      value = optionGetter(column);
    }
    if (optionName === 'name' || optionName === 'allowEditing') {
      that._checkColumns();
    }
    if (!(0, _type.isDefined)(prevValue) && !(0, _type.isDefined)(value) && optionName.indexOf('buffer') !== 0) {
      notFireEvent = true;
    }
    if (!notFireEvent) {
      // T346972
      if (!_const.USER_STATE_FIELD_NAMES.includes(optionName) && optionName !== 'visibleWidth') {
        columns = that.option('columns');
        initialColumn = that.getColumnByPath(fullOptionName, columns);
        if ((0, _type.isString)(initialColumn)) {
          initialColumn = columns[columnIndex] = {
            dataField: initialColumn
          };
        }
        if (initialColumn && checkUserStateColumn(initialColumn, column)) {
          // @ts-expect-error
          optionSetter(initialColumn, value, {
            functionsAsIs: true
          });
        }
      }
      updateColumnChanges(that, changeType, optionName, columnIndex);
    } else {
      resetColumnsCache(that);
    }
    fullOptionName && fireOptionChanged(that, {
      fullOptionName,
      optionName,
      value,
      prevValue
    });
  }
};
exports.columnOptionCore = columnOptionCore;
function isSortOrderValid(sortOrder) {
  return sortOrder === 'asc' || sortOrder === 'desc';
}
const addExpandColumn = function (that) {
  const options = that._getExpandColumnOptions();
  that.addCommandColumn(options);
};
exports.addExpandColumn = addExpandColumn;
const defaultSetCellValue = function (data, value) {
  if (!this.dataField) {
    return;
  }
  const path = this.dataField.split('.');
  const dotCount = path.length - 1;
  if (this.serializeValue) {
    value = this.serializeValue(value);
  }
  for (let i = 0; i < dotCount; i++) {
    const name = path[i];
    data = data[name] = data[name] || {};
  }
  data[path[dotCount]] = value;
};
exports.defaultSetCellValue = defaultSetCellValue;
const getDataColumns = function (columns, rowIndex, bandColumnID) {
  const result = [];
  rowIndex = rowIndex || 0;
  columns[rowIndex] && (0, _iterator.each)(columns[rowIndex], (_, column) => {
    if (column.ownerBand === bandColumnID || column.type === _const.GROUP_COMMAND_COLUMN_NAME) {
      if (!column.isBand || !column.colspan) {
        if (!column.command || rowIndex < 1) {
          result.push(column);
        }
      } else {
        result.push.apply(result, getDataColumns(columns, rowIndex + 1, column.index));
      }
    }
  });
  return result;
};
exports.getDataColumns = getDataColumns;
const getRowCount = function (that) {
  let rowCount = 1;
  const bandColumnsCache = that.getBandColumnsCache();
  const {
    columnParentByIndex
  } = bandColumnsCache;
  that._columns.forEach(column => {
    const parents = getParentBandColumns(column.index, columnParentByIndex);
    const invisibleParents = parents.filter(column => !column.visible);
    if (column.visible && !invisibleParents.length) {
      rowCount = Math.max(rowCount, parents.length + 1);
    }
  });
  return rowCount;
};
exports.getRowCount = getRowCount;
const isCustomCommandColumn = (that, commandColumn) => {
  const customCommandColumns = that._columns.filter(column => column.type === commandColumn.type);
  return !!customCommandColumns.length;
};
exports.isCustomCommandColumn = isCustomCommandColumn;
const getFixedPosition = function (that, column) {
  const rtlEnabled = that.option('rtlEnabled');
  if (column.command && !isCustomCommandColumn(that, column) || !column.fixedPosition) {
    return rtlEnabled ? 'right' : 'left';
  }
  return column.fixedPosition;
};
exports.getFixedPosition = getFixedPosition;
const processExpandColumns = function (columns, expandColumns, type, columnIndex) {
  let customColumnIndex;
  const rowCount = this.getRowCount();
  let rowspan = columns[columnIndex] && columns[columnIndex].rowspan;
  let expandColumnsByType = expandColumns.filter(column => column.type === type);
  columns.forEach((column, index) => {
    if (column.type === type) {
      customColumnIndex = index;
      rowspan = columns[index + 1] ? columns[index + 1].rowspan : rowCount;
    }
  });
  if (rowspan > 1) {
    expandColumnsByType = (0, _iterator.map)(expandColumnsByType, expandColumn => (0, _extend.extend)({}, expandColumn, {
      rowspan
    }));
  }
  expandColumnsByType.unshift.apply(expandColumnsByType, (0, _type.isDefined)(customColumnIndex) ? [customColumnIndex, 1] : [columnIndex, 0]);
  columns.splice.apply(columns, expandColumnsByType);
  return rowspan || 1;
};
exports.processExpandColumns = processExpandColumns;
const digitsCount = function (number) {
  let i;
  for (i = 0; number > 1; i++) {
    number /= 10;
  }
  return i;
};
exports.digitsCount = digitsCount;
const numberToString = function (number, digitsCount) {
  let str = number ? number.toString() : '0';
  while (str.length < digitsCount) {
    str = `0${str}`;
  }
  return str;
};
exports.numberToString = numberToString;
const mergeColumns = (that, columns, commandColumns, needToExtend) => {
  let column;
  let commandColumnIndex;
  let result = columns.slice().map(column => (0, _extend.extend)({}, column));
  const isColumnFixing = that._isColumnFixing();
  let defaultCommandColumns = commandColumns.slice().map(column => (0, _extend.extend)({
    fixed: isColumnFixing
  }, column));
  const getCommandColumnIndex = column => commandColumns.reduce((result, commandColumn, index) => {
    const columnType = needToExtend && column.type === _const.GROUP_COMMAND_COLUMN_NAME ? 'expand' : column.type;
    return commandColumn.type === columnType || commandColumn.command === column.command ? index : result;
  }, -1);
  const callbackFilter = commandColumn => commandColumn.command !== commandColumns[commandColumnIndex].command;
  for (let i = 0; i < columns.length; i++) {
    column = columns[i];
    commandColumnIndex = column && (column.type || column.command) ? getCommandColumnIndex(column) : -1;
    if (commandColumnIndex >= 0) {
      if (needToExtend) {
        result[i] = (0, _extend.extend)({
          fixed: isColumnFixing
        }, commandColumns[commandColumnIndex], column);
        if (column.type !== _const.GROUP_COMMAND_COLUMN_NAME) {
          defaultCommandColumns = defaultCommandColumns.filter(callbackFilter);
        }
      } else {
        const columnOptions = {
          visibleIndex: column.visibleIndex,
          index: column.index,
          headerId: column.headerId,
          allowFixing: column.groupIndex === 0,
          allowReordering: column.groupIndex === 0,
          groupIndex: column.groupIndex
        };
        result[i] = (0, _extend.extend)({}, column, commandColumns[commandColumnIndex], column.type === _const.GROUP_COMMAND_COLUMN_NAME && columnOptions);
      }
    }
  }
  if (columns.length && needToExtend && defaultCommandColumns.length) {
    result = result.concat(defaultCommandColumns);
  }
  return result;
};
exports.mergeColumns = mergeColumns;
const isColumnFixed = (that, column) => (0, _type.isDefined)(column.fixed) || !column.type ? column.fixed : that._isColumnFixing();
exports.isColumnFixed = isColumnFixed;
const convertOwnerBandToColumnReference = columns => {
  columns.forEach(column => {
    if ((0, _type.isDefined)(column.ownerBand)) {
      column.ownerBand = columns[column.ownerBand];
    }
  });
};
exports.convertOwnerBandToColumnReference = convertOwnerBandToColumnReference;
const resetBandColumnsCache = that => {
  that._bandColumnsCache = undefined;
};
exports.resetBandColumnsCache = resetBandColumnsCache;
const findColumn = (columns, identifier) => {
  const identifierOptionName = (0, _type.isString)(identifier) && identifier.substr(0, identifier.indexOf(':'));
  let column;
  if (identifier === undefined) return;
  if (identifierOptionName) {
    identifier = identifier.substr(identifierOptionName.length + 1);
  }
  if (identifierOptionName) {
    column = columns.filter(column => `${column[identifierOptionName]}` === identifier)[0];
  } else {
    ['index', 'name', 'dataField', 'caption'].some(optionName => {
      column = columns.filter(column => column[optionName] === identifier)[0];
      return !!column;
    });
  }
  return column;
};
exports.findColumn = findColumn;
const sortColumns = (columns, sortOrder) => {
  if (sortOrder !== 'asc' && sortOrder !== 'desc') {
    return columns;
  }
  const sign = sortOrder === 'asc' ? 1 : -1;
  columns.sort((column1, column2) => {
    const caption1 = column1.caption || '';
    const caption2 = column2.caption || '';
    return sign * caption1.localeCompare(caption2);
  });
  return columns;
};
exports.sortColumns = sortColumns;
const strictParseNumber = function (text, format) {
  const parsedValue = _number.default.parse(text);
  if ((0, _type.isNumeric)(parsedValue)) {
    const formattedValue = _number.default.format(parsedValue, format);
    const formattedValueWithDefaultFormat = _number.default.format(parsedValue, 'decimal');
    if (formattedValue === text || formattedValueWithDefaultFormat === text) {
      return parsedValue;
    }
  }
};
exports.strictParseNumber = strictParseNumber;