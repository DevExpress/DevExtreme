import type { DataType, HorizontalAlignment, SortOrder } from '@js/common';
import type { Format } from '@js/common/core/localization';
import numberLocalization from '@js/common/core/localization/number';
import type { ColumnBase, ColumnCustomizeTextArg, FixedPosition } from '@js/common/grids';
import { normalizeIndexes } from '@js/core/utils/array';
import { equalByValue } from '@js/core/utils/common';
import { compileGetter, compileSetter } from '@js/core/utils/data';
import dateSerialization from '@js/core/utils/date_serialization';
import { extend } from '@js/core/utils/extend';
import { deepExtendArraySafe } from '@js/core/utils/object';
import { getDefaultAlignment } from '@js/core/utils/position';
import {
  isDefined, isFunction, isNumeric, isObject, isString, type,
} from '@js/core/utils/type';
import variableWrapper from '@js/core/utils/variable_wrapper';
import type { DataGridCommandColumnType } from '@js/ui/data_grid';
import errors from '@js/ui/widget/ui.errors';

import { AI_COLUMN_NAME } from '../ai_column/const';
import type DataSourceAdapter from '../data_source_adapter/m_data_source_adapter';
import type { RawItemData } from '../data_source_adapter/types';
import gridCoreUtils from '../m_utils';
import { StickyPosition } from '../sticky_columns/const';
import { getColumnFixedPosition } from '../sticky_columns/utils';
import type { ColumnsController } from './columns_controller';
import {
  COLUMN_CHOOSER_LOCATION,
  COLUMN_INDEX_OPTIONS,
  COMMAND_COLUMNS_WITH_REQUIRED_NAMES,
  DEFAULT_COLUMN_OPTIONS,
  GROUP_COMMAND_COLUMN_NAME,
  GROUP_LOCATION,
  IGNORE_COLUMN_OPTION_NAMES,
  UNSUPPORTED_PROPERTIES_FOR_CHILD_COLUMNS,
  USER_STATE_FIELD_NAMES,
  USER_STATE_FIELD_NAMES_15_1,
  VIRTUAL_COMMAND_COLUMN_NAME,
} from './const';
import type {
  BandColumnsCache, Column, ColumnChangeType, ColumnIdentifier, ColumnIndex, ColumnOptionChangeArgs,
  ColumnOptionGetter, ColumnOptionSetter, ColumnsChanges, ColumnsControllerOptions, ColumnUserState,
  DropLocationNames, GroupColumn, ValueSerializers,
} from './types';

const warnFixedInChildColumnsOnce = (
  controller: ColumnsController,
  childColumns: (Column | string)[],
): void => {
  if (controller._isWarnedAboutUnsupportedProperties) {
    return;
  }

  for (const column of childColumns) {
    const unsupportedProperty = isObject(column)
      ? UNSUPPORTED_PROPERTIES_FOR_CHILD_COLUMNS.find((property) => property in column)
      : undefined;

    if (unsupportedProperty) {
      controller._isWarnedAboutUnsupportedProperties = true;
      errors.log('W1028', unsupportedProperty);
      return;
    }
  }
};

export const setFilterOperationsAsDefaultValues = (column: Column): void => {
  column.filterOperations = column.defaultFilterOperations;
};

let globalColumnId = 1;

export function createColumn(
  that: ColumnsController,
  columnOptions: Column,
  userStateColumnOptions?: ColumnUserState,
  bandColumn?: Column,
): Column;
export function createColumn(
  that: ColumnsController,
  columnOptions: Column | string | undefined,
  userStateColumnOptions?: ColumnUserState,
  bandColumn?: Column,
): Column | undefined;
export function createColumn(
  that: ColumnsController,
  columnOptions: Column | string | undefined,
  userStateColumnOptions?: ColumnUserState,
  bandColumn?: Column,
): Column | undefined {
  if (!columnOptions) {
    return undefined;
  }

  const options: Column = isString(columnOptions) ? { dataField: columnOptions } : columnOptions;
  let result: Column = {};

  that.setName(options);

  if (options.command) {
    result = deepExtendArraySafe({}, options);
  } else {
    const commonColumnOptions = that.getCommonSettings(options);
    const userStateDataField = userStateColumnOptions?.name && userStateColumnOptions.dataField;
    const optionsWithUserState: Column = userStateDataField
      ? extend({}, options, { dataField: userStateDataField })
      : options;
    const calculatedColumnOptions = that._createCalculatedColumnOptions(
      optionsWithUserState,
      bandColumn,
    );

    if (!optionsWithUserState.type) {
      result = { headerId: `dx-col-${globalColumnId}` };
      globalColumnId += 1;
    }

    deepExtendArraySafe(result, DEFAULT_COLUMN_OPTIONS, false, true);
    deepExtendArraySafe(result, commonColumnOptions, false, true);
    deepExtendArraySafe(result, calculatedColumnOptions, false, true);
    deepExtendArraySafe(result, optionsWithUserState, false, true);
    deepExtendArraySafe(result, { selector: null }, false, true);
  }

  if (options.filterOperations === options.defaultFilterOperations) {
    setFilterOperationsAsDefaultValues(result);
  }

  return result;
}

export function isUserStateColumn(
  column: ColumnUserState | undefined,
  userStateColumn: ColumnUserState | undefined,
): boolean {
  if (!column || !userStateColumn) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const isNameMatched = userStateColumn.name === (column.name || column.dataField);
  const isDataFieldMatched = userStateColumn.dataField === column.dataField;

  return isNameMatched && (isDataFieldMatched || !!column.name);
}

export const createColumnsFromOptions = (
  that: ColumnsController,
  columnsOptions: (Column | string)[] | undefined,
  bandColumn?: Column,
  createdColumnCount = 0,
): Column[] => {
  if (!columnsOptions) {
    return [];
  }

  const result: Column[] = [];

  columnsOptions.forEach((columnOptions) => {
    const currentIndex = createdColumnCount + result.length;
    const userStateColumnOptions = that._columnsUserState
      && isUserStateColumn(columnOptions as ColumnUserState, that._columnsUserState[currentIndex])
      && that._columnsUserState[currentIndex];
    const column = createColumn(
      that,
      columnOptions,
      userStateColumnOptions || undefined,
      bandColumn,
    );

    if (!column) {
      return;
    }

    if (bandColumn) {
      // @ts-expect-error ownerBand holds the band column until updateColumnIndexes sets its index
      column.ownerBand = bandColumn;
    }

    result.push(column);

    if (!column.columns) {
      return;
    }

    warnFixedInChildColumnsOnce(that, column.columns);
    const childColumns = createColumnsFromOptions(that, column.columns, column, result.length);
    delete column.columns;
    column.hasColumns = true;
    result.push(...childColumns);
  });

  return result;
};

export const getParentBandColumns = (
  columnIndex: number | undefined,
  columnParentByIndex: Record<number, Column>,
): Column[] => {
  const result: Column[] = [];
  let parent = isDefined(columnIndex) ? columnParentByIndex[columnIndex] : undefined;

  while (parent) {
    result.unshift(parent);
    parent = isDefined(parent.index) ? columnParentByIndex[parent.index] : undefined;
  }

  return result;
};

export const getChildrenByBandColumn = (
  columnIndex: number | undefined,
  columnChildrenByIndex: BandColumnsCache['columnChildrenByIndex'],
  recursive: boolean,
): Column[] => {
  const children: Column[] = [];
  const directChildren = isDefined(columnIndex) ? columnChildrenByIndex[columnIndex] : undefined;

  directChildren?.forEach((column) => {
    if (isDefined(column.groupIndex) && !column.showWhenGrouped) {
      return;
    }

    children.push(column);

    if (recursive && column.isBand) {
      children.push(...getChildrenByBandColumn(column.index, columnChildrenByIndex, recursive));
    }
  });

  return children;
};

const hasOwnerBand = (
  column: Column,
  ownerBand: number | undefined,
): boolean => column.ownerBand === ownerBand;

export const getColumnByIndexes = (
  that: ColumnsController,
  columnIndexes: number[],
): Column | undefined => {
  const bandColumnsCache = that.getBandColumnsCache();

  if (bandColumnsCache.isPlain) {
    return that._columns[columnIndexes[0]];
  }

  // eslint-disable-next-line @typescript-eslint/init-declarations
  let targetColumn: Column | undefined;
  let columns: Column[] = that._columns
    .filter((column: Column) => hasOwnerBand(column, undefined));

  columnIndexes.forEach((columnIndex) => {
    targetColumn = columns[columnIndex];

    if (targetColumn) {
      const ownerBand = targetColumn.index;

      columns = that._columns.filter((column: Column) => hasOwnerBand(column, ownerBand));
    }
  });

  return targetColumn;
};

export const getColumnFullPath = (that: ColumnsController, column: Column): string => {
  const bandColumnsCache = that.getBandColumnsCache();

  if (bandColumnsCache.isPlain) {
    const columnIndex = that._columns.indexOf(column);

    return columnIndex >= 0 ? `columns[${columnIndex}]` : '';
  }

  const getSiblingColumns = (target: Column): Column[] => that._columns
    .filter((item) => hasOwnerBand(item, target.ownerBand));

  const result: string[] = [];
  let currentColumn: Column | undefined = column;
  let columns = getSiblingColumns(column);

  while (currentColumn && columns.includes(currentColumn)) {
    result.unshift(`columns[${columns.indexOf(currentColumn)}]`);

    currentColumn = isDefined(currentColumn.index)
      ? bandColumnsCache.columnParentByIndex[currentColumn.index]
      : undefined;
    columns = currentColumn ? getSiblingColumns(currentColumn) : [];
  }

  return result.join('.');
};

export const calculateColspan = (
  that: ColumnsController,
  columnId: number | undefined,
): number => {
  let colspan = 0;
  const columns = that.getChildrenByBandColumn(columnId, true);

  columns.forEach((column) => {
    if (column.isBand) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      column.colspan = column.colspan || calculateColspan(that, column.index);
      colspan += column.colspan || 1;
    } else {
      colspan += 1;
    }
  });

  return colspan;
};

export const processBandColumns = (
  that: ColumnsController,
  columns: Column[],
  bandColumnsCache: BandColumnsCache,
): void => {
  columns.forEach((column) => {
    if (!column.visible && !column.command) {
      return;
    }

    if (column.isBand && !column.colspan) {
      column.colspan = calculateColspan(that, column.index);
    }

    if (column.isBand && column.colspan) {
      return;
    }

    let rowspan: number = that.getRowCount();

    if (!column.command && (!isDefined(column.groupIndex) || column.showWhenGrouped)) {
      rowspan -= getParentBandColumns(column.index, bandColumnsCache.columnParentByIndex).length;
    }

    if (rowspan > 1) {
      column.rowspan = rowspan;
    }
  });
};

export const getValueDataType = (value: unknown): Exclude<DataType, 'datetime'> | undefined => {
  const dataType = type(value);

  if (
    dataType === 'string'
    || dataType === 'boolean'
    || dataType === 'number'
    || dataType === 'date'
    || dataType === 'object'
  ) {
    return dataType;
  }

  return undefined;
};

export const getSerializationFormat = (
  dataType: string | undefined,
  value: unknown,
): string | null | undefined => {
  switch (dataType) {
    case 'date':
    case 'datetime':
      return dateSerialization.getDateSerializationFormat(value) as string;
    case 'number':
      if (isString(value)) {
        return 'string';
      }

      if (isNumeric(value)) {
        return null;
      }

      return undefined;
    default:
      return undefined;
  }
};

export const updateSerializers = (
  options: ValueSerializers,
  dataType: string | undefined,
): void => {
  if (options.deserializeValue) {
    return;
  }

  if (gridCoreUtils.isDateType(dataType)) {
    options.deserializeValue = dateSerialization.deserializeDate;
    options.serializeValue = function serializeDateValue(
      this: ValueSerializers,
      value: unknown,
    ): unknown {
      return isString(value)
        ? value
        : dateSerialization.serializeDate(value, this.serializationFormat);
    };
  }
  if (dataType === 'number') {
    options.deserializeValue = (value): unknown => {
      const parsedValue = parseFloat(value as string);
      return isNaN(parsedValue) ? value : parsedValue;
    };
    options.serializeValue = function serializeNumberValue(
      this: ValueSerializers,
      value: unknown,
      target: string | undefined,
    ): unknown {
      if (target === 'filter') {
        return value;
      }
      return isDefined(value) && this.serializationFormat === 'string' ? (value as number | string).toString() : value;
    };
  }
};

export const getAlignmentByDataType = (
  dataType: string | undefined,
  isRTL?: boolean,
): HorizontalAlignment => {
  switch (dataType) {
    case 'number':
      return 'right';
    case 'boolean':
      return 'center';
    default:
      return getDefaultAlignment(isRTL);
  }
};

export function customizeTextForBooleanDataType(
  this: ColumnBase,
  e: ColumnCustomizeTextArg,
): string {
  if (e.value === true) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return this.trueText || 'true';
  } if (e.value === false) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return this.falseText || 'false';
  }

  return e.valueText ?? '';
}

export const getCustomizeTextByDataType = (dataType: string | undefined): ColumnBase['customizeText'] => {
  if (dataType === 'boolean') {
    return customizeTextForBooleanDataType;
  }

  return undefined;
};

export const createColumnsFromDataSourceAdapter = (
  that: ColumnsController,
  dataSourceAdapter: DataSourceAdapter,
): Column[] => {
  const fieldNames: Record<string, true> = {};

  that._getFirstItems(dataSourceAdapter).forEach((item) => {
    if (!item) {
      return;
    }

    // eslint-disable-next-line guard-for-in -- inherited fields become columns too
    for (const fieldName in item) {
      const value = item[fieldName];

      if (!isFunction(value) || variableWrapper.isWrapped(value)) {
        fieldNames[fieldName] = true;
      }
    }
  });

  return Object.keys(fieldNames)
    .filter((fieldName) => !fieldName.startsWith('__'))
    .map((fieldName) => createColumn(that, fieldName) as Column);
};

export const updateColumnIndexes = (that: ColumnsController): void => {
  that._columns.forEach((column, index) => {
    column.index = index;
  });

  that._columns.forEach((column) => {
    if (isObject(column.ownerBand)) {
      // @ts-expect-error ownerBand holds the band column until updateColumnIndexes sets its index
      column.ownerBand = column.ownerBand.index;
    }
  });

  that._commandColumns.forEach((column, index) => {
    column.index = -(index + 1);
  });
};

export const updateColumnGroupIndexes = (that: ColumnsController, currentColumn?: Column): void => {
  normalizeIndexes(that._columns, 'groupIndex', currentColumn, (column: Column) => {
    const { grouped } = column;

    delete column.grouped;

    return grouped;
  });
};

export const isSortOrderValid = (
  sortOrder: string | null | undefined,
): sortOrder is SortOrder => sortOrder === 'asc' || sortOrder === 'desc';

export const updateColumnSortIndexes = (that: ColumnsController, currentColumn?: Column): void => {
  that._columns.forEach((column) => {
    if (isDefined(column.sortIndex) && !isSortOrderValid(column.sortOrder)) {
      delete column.sortIndex;
    }
  });

  normalizeIndexes(
    that._columns,
    'sortIndex',
    currentColumn,
    (column: Column) => !isDefined(column.groupIndex) && isSortOrderValid(column.sortOrder),
  );
};

export const updateColumnVisibleIndexes = (
  that: ColumnsController,
  currentColumn?: Column,
): void => {
  const topLevelColumns: Column[] = [];
  const bandColumnsCache = that.getBandColumnsCache();
  const bandedColumns: Column[] = [];
  const columns = that._columns.filter((column) => !column.command);

  columns.forEach((column, i) => {
    const parentBandColumns = getParentBandColumns(i, bandColumnsCache.columnParentByIndex);

    if (parentBandColumns.length) {
      bandedColumns.push(column);
    } else {
      topLevelColumns.push(column);
    }
  });

  normalizeIndexes(bandedColumns, 'visibleIndex', currentColumn);
  normalizeIndexes(topLevelColumns, 'visibleIndex', currentColumn);
};

function getColumnsByLocation(
  that: ColumnsController,
  location: DropLocationNames,
  rowIndex: number | null,
): Column[] {
  switch (location) {
    case GROUP_LOCATION:
      return that.getGroupColumns() as Column[];
    case COLUMN_CHOOSER_LOCATION:
      return that.getChooserColumns();
    default:
      return that.getVisibleColumns(rowIndex);
  }
}

function getColumnByVisibleIndex(
  that: ColumnsController,
  visibleIndex: ColumnIndex,
  location: DropLocationNames,
): Column {
  const rowIndex = isObject(visibleIndex) ? visibleIndex.rowIndex : null;
  const columnIndex = isObject(visibleIndex) ? visibleIndex.columnIndex : visibleIndex;
  const columns = getColumnsByLocation(that, location, rowIndex);
  const column = columns[columnIndex];

  if (column?.type === GROUP_COMMAND_COLUMN_NAME) {
    return that._columns.filter((col) => column.type === col.type)[0] || column;
  }

  if (that.isVirtualMode() && (!column || column.command === VIRTUAL_COMMAND_COLUMN_NAME)) {
    const columnIndexOffset = that.getColumnIndexOffset();

    return that.getVisibleColumns(rowIndex, true)[columnIndex + columnIndexOffset];
  }

  return column;
}

export function getColumnIndexByVisibleIndex(
  that: ColumnsController,
  visibleIndex: ColumnIndex,
  location: DropLocationNames,
): number {
  const column = getColumnByVisibleIndex(that, visibleIndex, location);

  return column?.index ?? -1;
}

export const reserveGroupIndex = (
  that: ColumnsController,
  groupIndex: number | undefined,
): number => {
  const groupColumns: GroupColumn[] = that.getGroupColumns();

  if (groupIndex !== undefined && groupIndex >= 0) {
    groupColumns.forEach((groupColumn) => {
      if (groupColumn.groupIndex >= groupIndex) {
        groupColumn.groupIndex += 1;
      }
    });

    return groupIndex;
  }

  return groupColumns.reduce(
    (nextGroupIndex, groupColumn) => Math.max(nextGroupIndex, groupColumn.groupIndex + 1),
    0,
  );
};

function copyColumnStateField<T extends keyof ColumnUserState>(
  column: Column,
  columnState: ColumnUserState,
  fieldName: T,
): void {
  column[fieldName] = columnState[fieldName];
}

export function applyColumnStateFields(
  column: Column,
  columnState: ColumnUserState | undefined,
  ignoreColumnOptionNames: string[],
): void {
  if (!columnState) {
    return;
  }

  USER_STATE_FIELD_NAMES.forEach((fieldName) => {
    if (ignoreColumnOptionNames.includes(fieldName)) {
      return;
    }

    if (fieldName === 'dataType') {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      column.dataType = column.dataType || columnState.dataType;
    } else if ((USER_STATE_FIELD_NAMES_15_1 as readonly string[]).includes(fieldName)) {
      if (fieldName in columnState) {
        copyColumnStateField(column, columnState, fieldName);
      }
    } else {
      if (fieldName === 'selectedFilterOperation' && columnState.selectedFilterOperation) {
        column.defaultSelectedFilterOperation = column.selectedFilterOperation ?? null;
      }
      copyColumnStateField(column, columnState, fieldName);
    }
  });
}

export const resetBandColumnsCache = (that: ColumnsController): void => {
  that._bandColumnsCache = undefined;
};

export const updateIndexes = (that: ColumnsController, column?: Column): void => {
  updateColumnIndexes(that);
  updateColumnGroupIndexes(that, column);
  updateColumnSortIndexes(that, column);

  resetBandColumnsCache(that);
  updateColumnVisibleIndexes(that, column);
};

export function assignColumns(that: ColumnsController, columns: Column[]): void {
  that._previousColumns = that._columns;
  that._columns = columns;
  that.resetColumnsCache();
  that.updateColumnDataTypes();
}

export function updateColumnChanges(
  that: ColumnsController,
  changeType: ColumnChangeType,
  optionName?: string,
  columnIndex?: number,
): ColumnsChanges {
  const columnChanges: ColumnsChanges = that._columnChanges ?? {
    optionNames: { length: 0 },
    changeTypes: { length: 0 },
    columnIndex, // TODO replace columnIndex -> columnIndices
  };

  const normalizedOptionName = (optionName ?? 'all').split('.')[0] as keyof Column | 'all';

  const { changeTypes, optionNames } = columnChanges;

  if (changeType && !changeTypes[changeType]) {
    changeTypes[changeType] = true;
    changeTypes.length += 1;
  }

  if (normalizedOptionName && !optionNames[normalizedOptionName]) {
    optionNames[normalizedOptionName] = true;
    optionNames.length += 1;
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
  that.resetColumnsCache();
  return columnChanges;
}

export const fireColumnsChanged = (that: ColumnsController): void => {
  const { onColumnsChanging } = that.option() as ColumnsControllerOptions;
  const columnChanges = that._columnChanges;
  const reinitOptionNames = ['dataField', 'lookup', 'dataType', 'columns'] as const;
  const needReinit = (
    optionNames: ColumnsChanges['optionNames'],
  ): boolean => reinitOptionNames.some((name) => optionNames[name]);

  if (that.isInitialized() && !that._updateLockCount && columnChanges) {
    if (onColumnsChanging) {
      that._updateLockCount += 1;
      onColumnsChanging({ component: that.component, ...columnChanges });
      that._updateLockCount -= 1;
    }

    that._columnChanges = undefined;

    if (needReinit(columnChanges.optionNames)) {
      that._reinitAfterLookupChanges = columnChanges.optionNames.lookup;
      that.reinit();
      that._reinitAfterLookupChanges = undefined;
    } else {
      that.columnsChanged.fire(columnChanges);
    }
  }
};

export const updateSortOrderWhenGrouping = (
  that: ColumnsController,
  column: Column,
  groupIndex: number | undefined,
  prevGroupIndex: number | undefined,
): void => {
  const columnIsGrouped = groupIndex !== undefined && groupIndex >= 0;
  const columnWasGrouped = prevGroupIndex !== undefined && prevGroupIndex >= 0;

  if (columnIsGrouped) {
    if (!columnWasGrouped) {
      column.lastSortOrder = column.sortOrder;
    }

    return;
  }

  const sortedByAnotherColumn = that.option('sorting.mode') === 'single'
    && that._columns.some((col) => col !== column && isDefined(col.sortIndex));

  column.sortOrder = sortedByAnotherColumn ? undefined : column.lastSortOrder;
};

export const fireOptionChanged = (
  that: ColumnsController,
  options: ColumnOptionChangeArgs,
): void => {
  const { value } = options;
  const { optionName } = options;
  const { prevValue } = options;
  const { fullOptionName } = options;
  const fullOptionPath = `${fullOptionName}.${optionName}`;

  if (
    !IGNORE_COLUMN_OPTION_NAMES[optionName]
    && that._skipProcessingColumnsChange !== fullOptionPath
  ) {
    that._skipProcessingColumnsChange = fullOptionPath;
    that.component._notifyOptionChanged(fullOptionPath, value, prevValue);
    that._skipProcessingColumnsChange = false;
  }
};

export const resolveChangeType = (optionName: string): ColumnChangeType => {
  switch (optionName) {
    case 'groupIndex':
    case 'calculateGroupValue':
      return 'grouping';
    case 'sortIndex':
    case 'sortOrder':
    case 'calculateSortValue':
      return 'sorting';
    default:
      return 'columns';
  }
};

// will be converted to method, no need to create special name for func
// eslint-disable-next-line func-names
export const columnOptionCore = function (
  that: ColumnsController,
  column: Column,
  optionName: string,
  value?: unknown,
  notFireEvent?: boolean,
): unknown {
  const optionGetter = compileGetter(optionName) as ColumnOptionGetter;

  if (arguments.length === 3) {
    return optionGetter(column, { functionsAsIs: true });
  }
  const prevValue = optionGetter(column, { functionsAsIs: true });
  if (equalByValue(prevValue, value, { maxDepth: 5 })) {
    return undefined;
  }

  const changeType = resolveChangeType(optionName);
  const columnIndex = column.index;

  if (optionName === 'groupIndex') {
    // @ts-expect-error value and prevValue hold groupIndex values for this option
    updateSortOrderWhenGrouping(that, column, value, prevValue);
  }

  const optionSetter = compileSetter(optionName) as ColumnOptionSetter;
  optionSetter(column, value, { functionsAsIs: true });
  const fullOptionName = getColumnFullPath(that, column);

  if (COLUMN_INDEX_OPTIONS[optionName]) {
    updateIndexes(that, column);
    // eslint-disable-next-line no-param-reassign
    value = optionGetter(column);
  }

  if (optionName === 'name' || optionName === 'allowEditing') {
    that._checkColumns();
  }

  if (!isDefined(prevValue) && !isDefined(value) && !optionName.startsWith('buffer') && notFireEvent !== false) {
    // eslint-disable-next-line no-param-reassign
    notFireEvent = true;
  }

  if (!notFireEvent) {
    // T346972
    if (!(USER_STATE_FIELD_NAMES as readonly string[]).includes(optionName) && optionName !== 'visibleWidth') {
      const columns = that.option('columns');
      let initialColumn = that.getColumnByPath(fullOptionName, columns);
      if (columns && isString(initialColumn)) {
        initialColumn = { dataField: initialColumn };
        columns[columnIndex as number] = initialColumn;
      }
      if (initialColumn && !isString(initialColumn) && isUserStateColumn(initialColumn, column)) {
        optionSetter(initialColumn, value, { functionsAsIs: true });
      }
    }
    updateColumnChanges(that, changeType, optionName, columnIndex);
  } else {
    that.resetColumnsCache();
  }

  if (fullOptionName) {
    fireOptionChanged(that, {
      fullOptionName,
      optionName,
      value,
      prevValue,
    });
  }

  if (column.type === AI_COLUMN_NAME) {
    that.aiColumnOptionChanged.fire(column, optionName, value);
  }

  return undefined;
};

export const addExpandColumn = (that: ColumnsController): void => {
  const options = that._getExpandColumnOptions();

  that.addCommandColumn(options);
};

export function defaultSetCellValue(this: Column, data: RawItemData, value: unknown): void {
  if (!this.dataField) {
    return;
  }
  const path = this.dataField.split('.');
  const dotCount = path.length - 1;
  const serializedValue = this.serializeValue ? this.serializeValue(value) : value;
  let targetData = data;

  for (let i = 0; i < dotCount; i += 1) {
    const name = path[i];
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const nestedData = (targetData[name] || {}) as RawItemData;
    targetData[name] = nestedData;
    targetData = nestedData;
  }
  targetData[path[dotCount]] = serializedValue;
}

export const getDataColumns = (
  visibleColumnsByRow: Column[][],
  rowIndex = 0,
  bandColumnId?: number,
): Column[] => {
  const dataColumns: Column[] = [];

  visibleColumnsByRow[rowIndex]?.forEach((column) => {
    if (column.ownerBand !== bandColumnId && column.type !== GROUP_COMMAND_COLUMN_NAME) {
      return;
    }

    if (column.isBand && column.colspan) {
      dataColumns.push(...getDataColumns(visibleColumnsByRow, rowIndex + 1, column.index));
      return;
    }

    if (!column.command || rowIndex < 1) {
      dataColumns.push(column);
    }
  });

  return dataColumns;
};

export const getRowCount = (that: ColumnsController): number => {
  let rowCount = 1;
  const bandColumnsCache = that.getBandColumnsCache();
  const { columnParentByIndex } = bandColumnsCache;

  that._columns.forEach((column) => {
    const parents = getParentBandColumns(column.index, columnParentByIndex);
    const invisibleParents = parents.filter((parent) => !parent.visible);

    if (column.visible && !invisibleParents.length) {
      rowCount = Math.max(rowCount, parents.length + 1);
    }
  });

  return rowCount;
};

export const getFixedPosition = (that: ColumnsController, column: Column): FixedPosition => {
  const isDefaultCommandColumn = column.command
    && !gridCoreUtils.isCustomCommandColumn(that._columns, column);

  if (isDefaultCommandColumn || !column.fixedPosition) {
    const rtlEnabled = that.option('rtlEnabled');

    return rtlEnabled ? 'right' : 'left';
  }

  return column.fixedPosition;
};

export const processExpandColumns = (
  columns: Column[],
  expandColumns: Column[],
  commandType: DataGridCommandColumnType,
  columnIndex: number,
  rowspan: number,
): void => {
  const expandColumnsByType = expandColumns
    .filter((column) => column.type === commandType)
    .map((column): Column => (rowspan > 1 ? { ...column, rowspan } : column));

  const customExpandColumnIndex = columns.findIndex((column) => column.type === commandType);
  const targetIndex = customExpandColumnIndex >= 0 ? customExpandColumnIndex : columnIndex;
  const deleteCount = customExpandColumnIndex >= 0 ? 1 : 0;

  columns.splice(targetIndex, deleteCount, ...expandColumnsByType);
};

export const digitsCount = (number: number): number => {
  let count = 0;
  let rest = number;

  while (rest > 1) {
    rest /= 10;
    count += 1;
  }

  return count;
};

export const numberToString = (number: number, length: number): string => {
  const str = number.toString();
  const leadingZeros = '0'.repeat(Math.max(length - str.length, 0));

  return `${leadingZeros}${str}`;
};

export const getCommandColumnIndex = (
  column: Column,
  commandColumns: Column[],
  asExpandColumn = false,
): number => {
  if (!column.type && !column.command) {
    return -1;
  }

  const columnType = asExpandColumn ? 'expand' : column.type;

  return commandColumns.reduce(
    (foundIndex, commandColumn, index) => (
      commandColumn.type === columnType || commandColumn.command === column.command
        ? index
        : foundIndex
    ),
    -1,
  );
};

export const mergeColumns = (
  that: ColumnsController,
  columns: Column[],
  commandColumns: Column[],
  needToExtend?: boolean,
): Column[] => {
  const isColumnFixing = that._isColumnFixing();
  let defaultCommandColumns = commandColumns.map(
    (commandColumn) => extend({ fixed: isColumnFixing }, commandColumn) as Column,
  );

  const mergedColumns = columns.map((column): Column => {
    const isGroupExpandColumn = column.type === GROUP_COMMAND_COLUMN_NAME;
    const commandColumnIndex = getCommandColumnIndex(
      column,
      commandColumns,
      needToExtend && isGroupExpandColumn,
    );

    if (commandColumnIndex < 0) {
      return extend({}, column) as Column;
    }

    const commandColumn = commandColumns[commandColumnIndex];

    if (needToExtend) {
      if (!isGroupExpandColumn) {
        defaultCommandColumns = defaultCommandColumns.filter(
          ({ command }) => command !== commandColumn.command,
        );
      }

      return extend(
        { fixed: isColumnFixing },
        commandColumn,
        column,
        {
          calculateCellValue: commandColumn.calculateCellValue,
          cssClass: [commandColumn.cssClass ?? '', column.cssClass ?? ''].join(' ').trim(),
        },
      ) as Column;
    }

    const columnOptions = {
      visibleIndex: column.visibleIndex,
      index: column.index,
      headerId: column.headerId,
      allowFixing: column.groupIndex === 0,
      allowReordering: column.groupIndex === 0,
      groupIndex: column.groupIndex,
    };

    return extend(
      {},
      column,
      commandColumn,
      isGroupExpandColumn && columnOptions,
    ) as Column;
  });

  if (columns.length && needToExtend && defaultCommandColumns.length) {
    return mergedColumns.concat(defaultCommandColumns);
  }

  return mergedColumns;
};

export const isColumnFixed = (that: ColumnsController, column: Column): boolean => {
  const isFixedCommandColumn = column.type && column.type !== AI_COLUMN_NAME;

  if (isFixedCommandColumn) {
    return !!that._isColumnFixing();
  }

  return !!column.fixed && column.fixedPosition !== StickyPosition.Sticky;
};

export const convertOwnerBandToColumnReference = (columns: Column[]): void => {
  columns.forEach((column) => {
    if (isDefined(column.ownerBand)) {
      // @ts-expect-error ownerBand holds the band column until updateColumnIndexes sets its index
      column.ownerBand = columns[column.ownerBand];
    }
  });
};

export const findColumn = (
  columns: Column[],
  identifier: ColumnIdentifier | undefined,
): Column | undefined => {
  if (identifier === undefined) {
    return undefined;
  }

  if (isString(identifier)) {
    const separatorIndex = identifier.indexOf(':');

    if (separatorIndex > 0) {
      const optionName = identifier.slice(0, separatorIndex);
      const optionValue = identifier.slice(separatorIndex + 1);

      return columns.find((column) => `${column[optionName]}` === optionValue);
    }
  }

  for (const optionName of ['index', 'name', 'dataField', 'caption'] as const) {
    const foundColumn = columns.find((column) => column[optionName] === identifier);

    if (foundColumn) {
      return foundColumn;
    }
  }

  return undefined;
};

export const sortColumnsByCaption = (
  columns: Pick<Column, 'caption'>[],
  sortOrder: SortOrder | undefined,
): void => {
  if (!isSortOrderValid(sortOrder)) {
    return;
  }

  const sign = sortOrder === 'asc' ? 1 : -1;

  columns.sort((column1, column2) => {
    const caption1 = column1.caption ?? '';
    const caption2 = column2.caption ?? '';

    return sign * caption1.localeCompare(caption2);
  });
};

export const strictParseNumber = (text: string, format: Format): number | undefined => {
  const parsedValue = numberLocalization.parse(text);

  if (isNumeric(parsedValue)) {
    const formattedValue = numberLocalization.format(parsedValue, format);
    const formattedValueWithDefaultFormat = numberLocalization.format(parsedValue, 'decimal');

    if (formattedValue === text || formattedValueWithDefaultFormat === text) {
      return parsedValue;
    }
  }

  return undefined;
};

const isFirstOrLastColumnCore = (
  that: ColumnsController,
  column: Column,
  rowIndex: number | null,
  onlyWithinBandColumn = false,
  isLast = false,
  fixedPosition?: StickyPosition,
): boolean => {
  const getColumns = (index: number | null): Column[] => that.getVisibleColumns(index)
    .filter((col) => {
      if (that.isAdaptiveHiddenColumn(col)) {
        return false;
      }

      if (onlyWithinBandColumn) {
        return col.ownerBand === column.ownerBand;
      }

      if (fixedPosition) {
        return !!col.fixed && getColumnFixedPosition(that, col) === fixedPosition;
      }

      return true;
    });

  const columnIndex = column.index;
  const columns = getColumns(rowIndex);
  const visibleColumnIndex = that.getVisibleIndex(columnIndex, rowIndex);

  return isLast
    ? visibleColumnIndex === that.getVisibleIndex(columns[columns.length - 1]?.index, rowIndex)
    : visibleColumnIndex === that.getVisibleIndex(columns[0]?.index, rowIndex);
};

const isFirstOrLastBandColumn = (
  that: ColumnsController,
  bandColumns: Column[],
  onlyWithinBandColumn = false,
  isLast = false,
  fixedPosition?: StickyPosition,
): boolean => bandColumns.every((column, index) => (onlyWithinBandColumn && index === 0)
  || isFirstOrLastColumnCore(that, column, index, onlyWithinBandColumn, isLast, fixedPosition));

export const isFirstOrLastColumn = (
  that: ColumnsController,
  targetColumn: Column,
  rowIndex: number | null,
  onlyWithinBandColumn = false,
  isLast = false,
  fixedPosition?: StickyPosition,
): boolean => {
  const targetColumnIndex = targetColumn.index;
  const bandColumnsCache = that.getBandColumnsCache();
  const parentBandColumns = isDefined(targetColumn.type)
    ? []
    : getParentBandColumns(targetColumnIndex, bandColumnsCache.columnParentByIndex);

  if (parentBandColumns.length) {
    return isFirstOrLastBandColumn(
      that,
      parentBandColumns.concat([targetColumn]),
      onlyWithinBandColumn,
      isLast,
      fixedPosition,
    );
  }

  return onlyWithinBandColumn || isFirstOrLastColumnCore(
    that,
    targetColumn,
    rowIndex,
    onlyWithinBandColumn,
    isLast,
    fixedPosition,
  );
};

export const isColumnNameRequired = (column: Column): boolean => (
  COMMAND_COLUMNS_WITH_REQUIRED_NAMES.includes(column.type ?? '')
);

export const columnHasValue = (column: Column): boolean => (
  !column.command || column.type === AI_COLUMN_NAME
);

export const getColumnHeaderCellSelector = (visibleIndex: number): string => `.dx-header-row td[aria-colindex="${visibleIndex + 1}"]`;
