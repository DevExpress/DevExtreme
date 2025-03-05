/* eslint-disable prefer-destructuring */
import numberLocalization from '@js/common/core/localization/number';
import { normalizeIndexes } from '@js/core/utils/array';
import { equalByValue } from '@js/core/utils/common';
import { compileGetter, compileSetter } from '@js/core/utils/data';
import dateSerialization from '@js/core/utils/date_serialization';
import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';
import { deepExtendArraySafe } from '@js/core/utils/object';
import { getDefaultAlignment } from '@js/core/utils/position';
import {
  isDefined, isFunction, isNumeric, isObject, isString, type,
} from '@js/core/utils/type';
import variableWrapper from '@js/core/utils/variable_wrapper';

import { HIDDEN_COLUMNS_WIDTH } from '../adaptivity/const';
import gridCoreUtils from '../m_utils';
import { StickyPosition } from '../sticky_columns/const';
import { getColumnFixedPosition } from '../sticky_columns/utils';
import {
  COLUMN_CHOOSER_LOCATION,
  COLUMN_INDEX_OPTIONS,
  DEFAULT_COLUMN_OPTIONS,
  GROUP_COMMAND_COLUMN_NAME,
  GROUP_LOCATION,
  IGNORE_COLUMN_OPTION_NAMES,
  USER_STATE_FIELD_NAMES,
  USER_STATE_FIELD_NAMES_15_1,
} from './const';
import type { ColumnsController } from './m_columns_controller';

export const setFilterOperationsAsDefaultValues = function (column) {
  column.filterOperations = column.defaultFilterOperations;
};

let globalColumnId = 1;

export const createColumn = function (that: ColumnsController, columnOptions, userStateColumnOptions?, bandColumn?): any {
  let commonColumnOptions = {};

  if (columnOptions) {
    if (isString(columnOptions)) {
      columnOptions = {
        dataField: columnOptions,
      };
    }

    that.setName(columnOptions);

    let result = { };
    if (columnOptions.command) {
      result = deepExtendArraySafe(commonColumnOptions, columnOptions);
    } else {
      commonColumnOptions = that.getCommonSettings(columnOptions);
      if (userStateColumnOptions && userStateColumnOptions.name && userStateColumnOptions.dataField) {
        columnOptions = extend({}, columnOptions, { dataField: userStateColumnOptions.dataField });
      }
      const calculatedColumnOptions = that._createCalculatedColumnOptions(columnOptions, bandColumn);
      if (!columnOptions.type) {
        result = { headerId: `dx-col-${globalColumnId++}` };
      }
      result = deepExtendArraySafe(result, DEFAULT_COLUMN_OPTIONS, false, true);
      deepExtendArraySafe(result, commonColumnOptions, false, true);
      deepExtendArraySafe(result, calculatedColumnOptions, false, true);
      deepExtendArraySafe(result, columnOptions, false, true);
      deepExtendArraySafe(result, { selector: null }, false, true);
    }
    if (columnOptions.filterOperations === columnOptions.defaultFilterOperations) {
      setFilterOperationsAsDefaultValues(result);
    }
    return result;
  }
};

export const createColumnsFromOptions = function (that: ColumnsController, columnsOptions, bandColumn?, createdColumnCount?) {
  let result: any = [];

  if (columnsOptions) {
    each(columnsOptions, (index, columnOptions) => {
      const currentIndex = (createdColumnCount ?? 0) + result.length;
      const userStateColumnOptions = that._columnsUserState
        && checkUserStateColumn(columnOptions, that._columnsUserState[currentIndex])
        && that._columnsUserState[currentIndex];
      const column: any = createColumn(that, columnOptions, userStateColumnOptions, bandColumn);

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

export const getParentBandColumns = function (columnIndex, columnParentByIndex) {
  const result: any = [];
  let parent = columnParentByIndex[columnIndex];

  while (parent) {
    result.unshift(parent);
    columnIndex = parent.index;
    parent = columnParentByIndex[columnIndex];
  }

  return result;
};

export const getChildrenByBandColumn = function (columnIndex, columnChildrenByIndex, recursive) {
  let result: any = [];
  const children = columnChildrenByIndex[columnIndex];

  if (children) {
    for (let i = 0; i < children.length; i++) {
      const column = children[i];
      if (!isDefined(column.groupIndex) || column.showWhenGrouped) {
        result.push(column);
        if (recursive && column.isBand) {
          result = result.concat(getChildrenByBandColumn(column.index, columnChildrenByIndex, recursive));
        }
      }
    }
  }

  return result;
};

export const getColumnByIndexes = function (that: ColumnsController, columnIndexes) {
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

export const getColumnFullPath = function (that: ColumnsController, column) {
  let result: any = [];
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

export const calculateColspan = function (that: ColumnsController, columnID) {
  let colspan = 0;
  const columns = that.getChildrenByBandColumn(columnID, true);

  each(columns, (_, column) => {
    if (column.isBand) {
      column.colspan = column.colspan || calculateColspan(that, column.index);
      colspan += column.colspan || 1;
    } else {
      colspan += 1;
    }
  });

  return colspan;
};

export const processBandColumns = function (that: ColumnsController, columns, bandColumnsCache) {
  let rowspan;

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];

    if (column.visible || column.command) {
      if (column.isBand) {
        column.colspan = column.colspan || calculateColspan(that, column.index);
      }

      if (!column.isBand || !column.colspan) {
        rowspan = that.getRowCount();

        if (!column.command && (!isDefined(column.groupIndex) || column.showWhenGrouped)) {
          rowspan -= getParentBandColumns(column.index, bandColumnsCache.columnParentByIndex).length;
        }

        if (rowspan > 1) {
          column.rowspan = rowspan;
        }
      }
    }
  }
};

export const getValueDataType = function (value) {
  let dataType: any = type(value);
  if (dataType !== 'string' && dataType !== 'boolean' && dataType !== 'number' && dataType !== 'date' && dataType !== 'object') {
    dataType = undefined;
  }
  return dataType;
};

export const getSerializationFormat = function (dataType, value): any {
  // eslint-disable-next-line default-case
  switch (dataType) {
    case 'date':
    case 'datetime':
      return dateSerialization.getDateSerializationFormat(value);
    case 'number':
      if (isString(value)) {
        return 'string';
      }

      if (isNumeric(value)) {
        return null;
      }
  }
};

export const updateSerializers = function (options, dataType) {
  if (!options.deserializeValue) {
    if (gridCoreUtils.isDateType(dataType)) {
      options.deserializeValue = function (value) {
        return dateSerialization.deserializeDate(value);
      };
      options.serializeValue = function (value) {
        return isString(value) ? value : dateSerialization.serializeDate(value, this.serializationFormat);
      };
    }
    if (dataType === 'number') {
      options.deserializeValue = function (value) {
        const parsedValue = parseFloat(value);
        return isNaN(parsedValue) ? value : parsedValue;
      };
      options.serializeValue = function (value, target) {
        if (target === 'filter') return value;
        return isDefined(value) && this.serializationFormat === 'string' ? value.toString() : value;
      };
    }
  }
};

export const getAlignmentByDataType = function (dataType, isRTL) {
  switch (dataType) {
    case 'number':
      return 'right';
    case 'boolean':
      return 'center';
    default:
      return getDefaultAlignment(isRTL);
  }
};

export const customizeTextForBooleanDataType = function (e) {
  if (e.value === true) {
    return this.trueText || 'true';
  } if (e.value === false) {
    return this.falseText || 'false';
  }
  return e.valueText || '';
};

export const getCustomizeTextByDataType = function (dataType): any {
  if (dataType === 'boolean') {
    return customizeTextForBooleanDataType;
  }
};

export const createColumnsFromDataSource = function (that: ColumnsController, dataSource) {
  const firstItems = that._getFirstItems(dataSource);
  let fieldName;
  const processedFields = {};
  const result: any = [];

  for (let i = 0; i < firstItems.length; i++) {
    if (firstItems[i]) {
      // eslint-disable-next-line no-restricted-syntax
      for (fieldName in firstItems[i]) {
        if (!isFunction(firstItems[i][fieldName]) || variableWrapper.isWrapped(firstItems[i][fieldName])) {
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

export const updateColumnIndexes = function (that: ColumnsController) {
  each(that._columns, (index, column) => {
    column.index = index;
  });

  each(that._columns, (index, column) => {
    if (isObject(column.ownerBand)) {
      column.ownerBand = column.ownerBand.index;
    }
  });

  each(that._commandColumns, (index: any, column) => {
    column.index = -(index + 1);
  });
};

export const updateColumnGroupIndexes = function (that: ColumnsController, currentColumn?) {
  normalizeIndexes(that._columns, 'groupIndex', currentColumn, (column) => {
    const { grouped } = column;
    delete column.grouped;
    return grouped;
  });
};

export const updateColumnSortIndexes = function (that: ColumnsController, currentColumn) {
  each(that._columns, (index, column) => {
    if (isDefined(column.sortIndex) && !isSortOrderValid(column.sortOrder)) {
      delete column.sortIndex;
    }
  });

  normalizeIndexes(that._columns, 'sortIndex', currentColumn, (column) => !isDefined(column.groupIndex) && isSortOrderValid(column.sortOrder));
};

export const updateColumnVisibleIndexes = function (that: ColumnsController, currentColumn) {
  let column;
  const result: any = [];
  const bandColumnsCache = that.getBandColumnsCache();
  const bandedColumns: any = [];
  const columns = that._columns.filter((column) => !column.command);

  for (let i = 0; i < columns.length; i++) {
    column = columns[i];
    const parentBandColumns = getParentBandColumns(i, bandColumnsCache.columnParentByIndex);

    if (parentBandColumns.length) {
      bandedColumns.push(column);
    } else {
      result.push(column);
    }
  }

  normalizeIndexes(bandedColumns, 'visibleIndex', currentColumn);

  normalizeIndexes(result, 'visibleIndex', currentColumn);
};

export const getColumnIndexByVisibleIndex = function (that: ColumnsController, visibleIndex, location) {
  // @ts-expect-error
  const rowIndex = isObject(visibleIndex) ? visibleIndex.rowIndex : null;
  const columns = location === GROUP_LOCATION ? that.getGroupColumns() : location === COLUMN_CHOOSER_LOCATION ? that.getChooserColumns() : that.getVisibleColumns(rowIndex);
  let column;

  // @ts-expect-error
  visibleIndex = isObject(visibleIndex) ? visibleIndex.columnIndex : visibleIndex;
  column = columns[visibleIndex];

  if (column && column.type === GROUP_COMMAND_COLUMN_NAME) {
    column = that._columns.filter((col) => column.type === col.type)[0] || column;
  }

  return column && isDefined(column.index) ? column.index : -1;
};

export const moveColumnToGroup = function (that: ColumnsController, column, groupIndex) {
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

function checkUserStateColumn(column, userStateColumn) {
  return column && userStateColumn && (userStateColumn.name === (column.name || column.dataField)) && (userStateColumn.dataField === column.dataField || column.name);
}

export const applyUserState = function (that: ColumnsController) {
  const columnsUserState = that._columnsUserState;
  const ignoreColumnOptionNames = that._ignoreColumnOptionNames || [];
  const columns = that._columns;
  const columnCountById = {};
  let resultColumns: any = [];
  let allColumnsHaveState = true;
  const userStateColumnIndexes: any = [];
  let column;
  let userStateColumnIndex;
  let i;

  function applyFieldsState(column, userStateColumn) {
    if (!userStateColumn) return;

    for (let index = 0; index < USER_STATE_FIELD_NAMES.length; index++) {
      const fieldName = USER_STATE_FIELD_NAMES[index];

      if (ignoreColumnOptionNames.includes(fieldName)) continue;

      if (fieldName === 'dataType') {
        column[fieldName] = column[fieldName] || userStateColumn[fieldName];
      } else if (USER_STATE_FIELD_NAMES_15_1.includes(fieldName)) {
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
      if (userStateColumnIndex >= 0 && isDefined(columnsUserState[userStateColumnIndex].initialIndex)) {
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

export const updateIndexes = function (that: ColumnsController, column?) {
  updateColumnIndexes(that);
  updateColumnGroupIndexes(that, column);
  updateColumnSortIndexes(that, column);

  resetBandColumnsCache(that);
  updateColumnVisibleIndexes(that, column);
};

export const resetColumnsCache = function (that: ColumnsController) {
  that.resetColumnsCache();
};

export function assignColumns(that, columns) {
  that._previousColumns = that._columns;
  that._columns = columns;
  resetColumnsCache(that);
  that.updateColumnDataTypes();
}

export const updateColumnChanges = function (that: ColumnsController, changeType, optionName?, columnIndex?) {
  const columnChanges = that._columnChanges || {
    optionNames: { length: 0 },
    changeTypes: { length: 0 },
    columnIndex, // TODO replace columnIndex -> columnIndices
  };

  optionName = optionName || 'all';

  optionName = optionName.split('.')[0];

  const { changeTypes } = columnChanges;

  if (changeType && !changeTypes[changeType]) {
    changeTypes[changeType] = true;
    changeTypes.length++;
  }

  const { optionNames } = columnChanges;

  if (optionName && !optionNames[optionName]) {
    optionNames[optionName] = true;
    optionNames.length++;
  }
  if (columnIndex === undefined || columnIndex !== columnChanges.columnIndex) {
    if (isDefined(columnIndex)) {
      columnChanges.columnIndices ??= [];

      if (isDefined(columnChanges.columnIndex)) {
        columnChanges.columnIndices.push(columnChanges.columnIndex);
      }

      columnChanges.columnIndices.push(columnIndex);
    }

    delete columnChanges.columnIndex;
  }
  that._columnChanges = columnChanges;
  resetColumnsCache(that);
};

export const fireColumnsChanged = function (that: ColumnsController) {
  const onColumnsChanging: any = that.option('onColumnsChanging');
  const columnChanges = that._columnChanges;
  const reinitOptionNames = ['dataField', 'lookup', 'dataType', 'columns'];
  const needReinit = (options) => options && reinitOptionNames.some((name) => options[name]);

  if (that.isInitialized() && !that._updateLockCount && columnChanges) {
    if (onColumnsChanging) {
      that._updateLockCount++;
      onColumnsChanging(extend({ component: that.component }, columnChanges));
      that._updateLockCount--;
    }
    that._columnChanges = undefined;
    if (needReinit(columnChanges.optionNames)) {
      that._reinitAfterLookupChanges = columnChanges?.optionNames.lookup;
      that.reinit();
      that._reinitAfterLookupChanges = undefined;
    } else {
      that.columnsChanged.fire(columnChanges);
    }
  }
};

export const updateSortOrderWhenGrouping = function (that: ColumnsController, column, groupIndex, prevGroupIndex) {
  const columnWasGrouped = prevGroupIndex >= 0;

  if (groupIndex >= 0) {
    if (!columnWasGrouped) {
      column.lastSortOrder = column.sortOrder;
    }
  } else {
    const sortMode = that.option('sorting.mode');
    let sortOrder = column.lastSortOrder;

    if (sortMode === 'single') {
      const sortedByAnotherColumn = that._columns.some((col) => col !== column && isDefined(col.sortIndex));
      if (sortedByAnotherColumn) {
        sortOrder = undefined;
      }
    }

    column.sortOrder = sortOrder;
  }
};

export const fireOptionChanged = function (that: ColumnsController, options) {
  const { value } = options;
  const { optionName } = options;
  const { prevValue } = options;
  const { fullOptionName } = options;
  const fullOptionPath = `${fullOptionName}.${optionName}`;

  if (!IGNORE_COLUMN_OPTION_NAMES[optionName] && that._skipProcessingColumnsChange !== fullOptionPath) {
    that._skipProcessingColumnsChange = fullOptionPath;
    that.component._notifyOptionChanged(fullOptionPath, value, prevValue);
    that._skipProcessingColumnsChange = false;
  }
};

export const columnOptionCore = function (that: ColumnsController, column, optionName, value?, notFireEvent?) {
  const optionGetter = compileGetter(optionName);
  const columnIndex = column.index;
  let columns;
  let changeType;
  let initialColumn;

  if (arguments.length === 3) {
    // @ts-expect-error
    return optionGetter(column, { functionsAsIs: true });
  }
  // @ts-expect-error
  const prevValue = optionGetter(column, { functionsAsIs: true });
  if (!equalByValue(prevValue, value, { maxDepth: 5 })) {
    if (optionName === 'groupIndex' || optionName === 'calculateGroupValue') {
      changeType = 'grouping';
      updateSortOrderWhenGrouping(that, column, value, prevValue);
    } else if (optionName === 'sortIndex' || optionName === 'sortOrder' || optionName === 'calculateSortValue') {
      changeType = 'sorting';
    } else {
      changeType = 'columns';
    }

    const optionSetter = compileSetter(optionName);
    // @ts-expect-error
    optionSetter(column, value, { functionsAsIs: true });
    const fullOptionName = getColumnFullPath(that, column);

    if (COLUMN_INDEX_OPTIONS[optionName]) {
      updateIndexes(that, column);
      // @ts-expect-error
      value = optionGetter(column);
    }

    if (optionName === 'name' || optionName === 'allowEditing') {
      that._checkColumns();
    }

    if (!isDefined(prevValue) && !isDefined(value) && optionName.indexOf('buffer') !== 0 && notFireEvent !== false) {
      notFireEvent = true;
    }

    if (!notFireEvent) {
      // T346972
      if (!USER_STATE_FIELD_NAMES.includes(optionName) && optionName !== 'visibleWidth') {
        columns = that.option('columns');
        initialColumn = that.getColumnByPath(fullOptionName, columns);
        if (isString(initialColumn)) {
          initialColumn = columns[columnIndex] = { dataField: initialColumn };
        }
        if (initialColumn && checkUserStateColumn(initialColumn, column)) {
          // @ts-expect-error
          optionSetter(initialColumn, value, { functionsAsIs: true });
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
      prevValue,
    });
  }
};

export function isSortOrderValid(sortOrder) {
  return sortOrder === 'asc' || sortOrder === 'desc';
}

export const addExpandColumn = function (that: ColumnsController) {
  const options = that._getExpandColumnOptions();

  that.addCommandColumn(options);
};

export const defaultSetCellValue = function (data, value) {
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

export const getDataColumns = function (columns, rowIndex?, bandColumnID?) {
  const result: any = [];

  rowIndex = rowIndex || 0;
  columns[rowIndex] && each(columns[rowIndex], (_, column) => {
    if (column.ownerBand === bandColumnID || column.type === GROUP_COMMAND_COLUMN_NAME) {
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

export const getRowCount = function (that: ColumnsController) {
  let rowCount = 1;
  const bandColumnsCache = that.getBandColumnsCache();
  const { columnParentByIndex } = bandColumnsCache;

  that._columns.forEach((column) => {
    const parents = getParentBandColumns(column.index, columnParentByIndex);
    const invisibleParents = parents.filter((column) => !column.visible);

    if (column.visible && !invisibleParents.length) {
      rowCount = Math.max(rowCount, parents.length + 1);
    }
  });

  return rowCount;
};

export const getFixedPosition = function (that: ColumnsController, column) {
  const rtlEnabled = that.option('rtlEnabled');

  if (column.command && !gridCoreUtils.isCustomCommandColumn(that._columns, column) || !column.fixedPosition) {
    return rtlEnabled ? 'right' : 'left';
  }

  return column.fixedPosition;
};

export const processExpandColumns = function (columns, expandColumns, type, columnIndex) {
  let customColumnIndex;
  const rowCount = this.getRowCount();
  let rowspan = columns[columnIndex] && columns[columnIndex].rowspan;
  let expandColumnsByType = expandColumns.filter((column) => column.type === type);

  columns.forEach((column, index) => {
    if (column.type === type) {
      customColumnIndex = index;
      rowspan = columns[index + 1] ? columns[index + 1].rowspan : rowCount;
    }
  });

  if (rowspan > 1) {
    expandColumnsByType = map(expandColumnsByType, (expandColumn) => extend({}, expandColumn, { rowspan }));
  }
  expandColumnsByType.unshift.apply(expandColumnsByType, isDefined(customColumnIndex) ? [customColumnIndex, 1] : [columnIndex, 0]);
  columns.splice.apply(columns, expandColumnsByType);

  return rowspan || 1;
};

export const digitsCount = function (number) {
  let i;

  for (i = 0; number > 1; i++) {
    number /= 10;
  }

  return i;
};

export const numberToString = function (number, digitsCount) {
  let str = number ? number.toString() : '0';

  while (str.length < digitsCount) {
    str = `0${str}`;
  }

  return str;
};

export const mergeColumns = (that: ColumnsController, columns, commandColumns, needToExtend?) => {
  let column;
  let commandColumnIndex;
  let result = columns.slice().map((column) => extend({}, column));
  const isColumnFixing = that._isColumnFixing();
  let defaultCommandColumns = commandColumns.slice().map((column) => extend({ fixed: isColumnFixing }, column));
  const getCommandColumnIndex = (column) => commandColumns.reduce((result, commandColumn, index) => {
    const columnType = needToExtend && column.type === GROUP_COMMAND_COLUMN_NAME ? 'expand' : column.type;
    return commandColumn.type === columnType || commandColumn.command === column.command ? index : result;
  }, -1);
  const callbackFilter = (commandColumn) => commandColumn.command !== commandColumns[commandColumnIndex].command;

  for (let i = 0; i < columns.length; i++) {
    column = columns[i];

    commandColumnIndex = column && (column.type || column.command) ? getCommandColumnIndex(column) : -1;
    if (commandColumnIndex >= 0) {
      if (needToExtend) {
        result[i] = extend({ fixed: isColumnFixing }, commandColumns[commandColumnIndex], column);
        if (column.type !== GROUP_COMMAND_COLUMN_NAME) {
          defaultCommandColumns = defaultCommandColumns.filter(callbackFilter);
        }
      } else {
        const columnOptions = {
          visibleIndex: column.visibleIndex,
          index: column.index,
          headerId: column.headerId,
          allowFixing: column.groupIndex === 0,
          allowReordering: column.groupIndex === 0,
          groupIndex: column.groupIndex,
        };
        result[i] = extend({}, column, commandColumns[commandColumnIndex], column.type === GROUP_COMMAND_COLUMN_NAME && columnOptions);
      }
    }
  }

  if (columns.length && needToExtend && defaultCommandColumns.length) {
    result = result.concat(defaultCommandColumns);
  }

  return result;
};

export const isColumnFixed = (that: ColumnsController, column) => (isDefined(column.fixed) || !column.type ? column.fixed && column.fixedPosition !== StickyPosition.Sticky : that._isColumnFixing());

export const convertOwnerBandToColumnReference = (columns) => {
  columns.forEach((column) => {
    if (isDefined(column.ownerBand)) {
      column.ownerBand = columns[column.ownerBand];
    }
  });
};

export const resetBandColumnsCache = (that: ColumnsController) => {
  that._bandColumnsCache = undefined;
};

export const findColumn = (columns, identifier) => {
  const identifierOptionName = isString(identifier) && identifier.substr(0, identifier.indexOf(':'));
  let column;

  if (identifier === undefined) return;

  if (identifierOptionName) {
    identifier = identifier.substr(identifierOptionName.length + 1);
  }

  if (identifierOptionName) {
    column = columns.filter((column) => `${column[identifierOptionName]}` === identifier)[0];
  } else {
    ['index', 'name', 'dataField', 'caption'].some((optionName) => {
      column = columns.filter((column) => column[optionName] === identifier)[0];
      return !!column;
    });
  }

  return column;
};

export const sortColumns = (columns, sortOrder) => {
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

export const strictParseNumber = function (text, format): any {
  const parsedValue = numberLocalization.parse(text);

  if (isNumeric(parsedValue)) {
    const formattedValue = numberLocalization.format(parsedValue, format);
    const formattedValueWithDefaultFormat = numberLocalization.format(parsedValue, 'decimal');

    if (formattedValue === text || formattedValueWithDefaultFormat === text) {
      return parsedValue;
    }
  }
};

const isFirstOrLastBandColumn = function (
  that: ColumnsController,
  bandColumns: any[],
  onlyWithinBandColumn = false,
  isLast = false,
  fixedPosition?: StickyPosition,
): boolean {
  return bandColumns.every((column, index) => onlyWithinBandColumn && index === 0
        || isFirstOrLastColumnCore(that, column, index, onlyWithinBandColumn, isLast, fixedPosition));
};

const isFirstOrLastColumnCore = function (
  that: ColumnsController,
  column: any,
  rowIndex: number | null,
  onlyWithinBandColumn = false,
  isLast = false,
  fixedPosition?: StickyPosition,
): boolean {
  const getColumns = (index: number | null): any => that.getVisibleColumns(index)
    .filter((col) => {
      let res = true;

      if (col.visibleWidth === HIDDEN_COLUMNS_WIDTH) {
        return false;
      }

      if (onlyWithinBandColumn && column) {
        res &&= col.ownerBand === column.ownerBand;
      } else if (fixedPosition) {
        res &&= col.fixed && getColumnFixedPosition(that, col) === fixedPosition;
      }

      return res;
    });
  const columnIndex = column.index;
  const columns = getColumns(rowIndex);
  const visibleColumnIndex = that.getVisibleIndex(columnIndex, rowIndex);

  return isLast
    ? visibleColumnIndex === that.getVisibleIndex(columns[columns.length - 1]?.index, rowIndex)
    : visibleColumnIndex === that.getVisibleIndex(columns[0]?.index, rowIndex);
};

export const isFirstOrLastColumn = function (
  that: ColumnsController,
  targetColumn: any,
  rowIndex: number | null,
  onlyWithinBandColumn = false,
  isLast = false,
  fixedPosition?: StickyPosition,
): boolean {
  const targetColumnIndex = targetColumn.index;
  const bandColumnsCache = that.getBandColumnsCache();
  const parentBandColumns = getParentBandColumns(targetColumnIndex, bandColumnsCache.columnParentByIndex);

  if (parentBandColumns?.length) {
    return isFirstOrLastBandColumn(that, parentBandColumns.concat([targetColumn]), onlyWithinBandColumn, isLast, fixedPosition);
  }

  return onlyWithinBandColumn || isFirstOrLastColumnCore(that, targetColumn, rowIndex, onlyWithinBandColumn, isLast, fixedPosition);
};
