import $ from '../../core/renderer';
import Callbacks from '../../core/utils/callbacks';
import variableWrapper from '../../core/utils/variable_wrapper';
import { compileGetter, compileSetter } from '../../core/utils/data';
import { grep } from '../../core/utils/common';
import { isDefined, isString, isNumeric, isFunction, isObject, isPlainObject, type } from '../../core/utils/type';
import { each, map } from '../../core/utils/iterator';
import { getDefaultAlignment } from '../../core/utils/position';
import { extend } from '../../core/utils/extend';
import { inArray, normalizeIndexes } from '../../core/utils/array';
import config from '../../core/config';
import { orderEach, deepExtendArraySafe } from '../../core/utils/object';
import errors from '../widget/ui.errors';
import modules from './ui.grid_core.modules';
import gridCoreUtils from './ui.grid_core.utils';
import { captionize } from '../../core/utils/inflector';
import dateSerialization from '../../core/utils/date_serialization';
import numberLocalization from '../../localization/number';
import dateLocalization from '../../localization/date';
import messageLocalization from '../../localization/message';
import { when, Deferred } from '../../core/utils/deferred';
import Store from '../../data/abstract_store';
import { DataSource } from '../../data/data_source/data_source';
import { normalizeDataSourceOptions } from '../../data/data_source/utils';
import filterUtils from '../shared/filtering';

const USER_STATE_FIELD_NAMES_15_1 = ['filterValues', 'filterType', 'fixed', 'fixedPosition'];
const USER_STATE_FIELD_NAMES = ['visibleIndex', 'dataField', 'name', 'dataType', 'width', 'visible', 'sortOrder', 'lastSortOrder', 'sortIndex', 'groupIndex', 'filterValue', 'selectedFilterOperation', 'added'].concat(USER_STATE_FIELD_NAMES_15_1);
const IGNORE_COLUMN_OPTION_NAMES = { visibleWidth: true, bestFitWidth: true, bufferedFilterValue: true };
const COMMAND_EXPAND_CLASS = 'dx-command-expand';
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991/* IE11 */;
const GROUP_COMMAND_COLUMN_NAME = 'groupExpand';

const regExp = /columns\[(\d+)\]\.?/gi;

let globalColumnId = 1;

export default {
    defaultOptions: function() {
        return {
            commonColumnSettings: {
                allowFiltering: true,
                allowHiding: true,
                allowSorting: true,
                allowEditing: true,
                encodeHtml: true,
                trueText: messageLocalization.format('dxDataGrid-trueText'),
                falseText: messageLocalization.format('dxDataGrid-falseText')
            },
            allowColumnReordering: false,
            allowColumnResizing: false,
            columnResizingMode: 'nextColumn',
            columnMinWidth: undefined,
            columnWidth: undefined,
            adaptColumnWidthByRatio: true,

            /**
             * @name GridBaseColumn
             * @type Object
             */
            /**
             * @name dxDataGridColumn
             * @inherits GridBaseColumn
             * @type Object
             */
            /**
             * @name dxTreeListColumn
             * @inherits GridBaseColumn
             * @type Object
             */
            columns: undefined,


            /**
             * @name dxDataGridColumn.grouped
             * @type boolean
             * @hidden
             * @default false
             */
            /**
             * @name dxDataGridColumn.resized
             * @type function
             * @hidden
             * @default undefined
             */
            /**
             * @name GridBaseColumn.lookup.dataSource
             * @type Array<any>|DataSourceOptions|Store|function(options)
             * @type_function_param1 options:object
             * @type_function_param1_field1 data:object
             * @type_function_param1_field2 key:any
             * @type_function_return Array<any>|DataSourceOptions|Store
             * @default undefined
             */
            /**
             * @name GridBaseColumn.lookup.valueExpr
             * @type string
             * @default undefined
             */
            /**
             * @name GridBaseColumn.lookup.displayExpr
             * @type string|function(data)
             * @default undefined
             * @type_function_param1 data:object
             * @type_function_return string
             */
            /**
             * @name GridBaseColumn.lookup.allowClearing
             * @type boolean
             * @default false
             */
            /**
             * @name dxDataGridOptions.regenerateColumnsByVisibleItems
             * @type boolean
             * @hidden
             * @default false
             */
            /**
             * @name GridBaseColumn.headerFilter.dataSource
             * @type Array<any>|function(options)|DataSourceOptions
             * @type_function_param1 options:object
             * @type_function_param1_field1 component:object
             * @type_function_param1_field2 dataSource:DataSourceOptions
             * @default undefined
             */
            /**
             * @name GridBaseColumn.headerFilter.groupInterval
             * @type Enums.HeaderFilterGroupInterval|number
             * @default undefined
             */
            /**
             * @name GridBaseColumn.headerFilter.allowSearch
             * @type boolean
             * @default false
             */
            /**
             * @name GridBaseColumn.headerFilter.searchMode
             * @type Enums.CollectionSearchMode
             * @default 'contains'
             */
            /**
             * @name GridBaseColumn.headerFilter.width
             * @type number
             * @default undefined
             */
            /**
             * @name GridBaseColumn.headerFilter.height
             * @type number
             * @default undefined
             */
            /**
             * @name GridBaseColumnButton
             * @type Object
             */
            /**
             * @name dxDataGridColumnButton
             * @inherits GridBaseColumnButton
             * @type Object
             */
            /**
             * @name dxTreeListColumnButton
             * @inherits GridBaseColumnButton
             * @type Object
             */
            regenerateColumnsByVisibleItems: false,
            customizeColumns: null,
            dateSerializationFormat: undefined
        };
    },
    controllers: {
        columns: modules.Controller.inherit((function() {
            const DEFAULT_COLUMN_OPTIONS = {
                visible: true,
                showInColumnChooser: true
            };
            const DATATYPE_OPERATIONS = {
                'number': ['=', '<>', '<', '>', '<=', '>=', 'between'],
                'string': ['contains', 'notcontains', 'startswith', 'endswith', '=', '<>'],
                'date': ['=', '<>', '<', '>', '<=', '>=', 'between'],
                'datetime': ['=', '<>', '<', '>', '<=', '>=', 'between']
            };
            const COLUMN_INDEX_OPTIONS = {
                visibleIndex: true,
                groupIndex: true,
                grouped: true,
                sortIndex: true,
                sortOrder: true
            };
            const GROUP_LOCATION = 'group';
            const COLUMN_CHOOSER_LOCATION = 'columnChooser';

            const setFilterOperationsAsDefaultValues = function(column) {
                column.filterOperations = column.defaultFilterOperations;
            };

            const createColumn = function(that, columnOptions, userStateColumnOptions, bandColumn) {
                let commonColumnOptions = {};

                if(columnOptions) {
                    if(isString(columnOptions)) {
                        columnOptions = {
                            dataField: columnOptions
                        };
                    }

                    that.setName(columnOptions);

                    let result = { };
                    if(columnOptions.command) {
                        result = deepExtendArraySafe(commonColumnOptions, columnOptions);
                    } else {
                        commonColumnOptions = that.getCommonSettings(columnOptions);
                        if(userStateColumnOptions && userStateColumnOptions.name && userStateColumnOptions.dataField) {
                            columnOptions = extend({}, columnOptions, { dataField: userStateColumnOptions.dataField });
                        }
                        const calculatedColumnOptions = that._createCalculatedColumnOptions(columnOptions, bandColumn);
                        if(!columnOptions.type) {
                            result = { headerId: `dx-col-${globalColumnId++}` };
                        }
                        result = deepExtendArraySafe(result, DEFAULT_COLUMN_OPTIONS);
                        deepExtendArraySafe(result, commonColumnOptions);
                        deepExtendArraySafe(result, calculatedColumnOptions);
                        deepExtendArraySafe(result, columnOptions);
                        deepExtendArraySafe(result, { selector: null });
                    }
                    if(columnOptions.filterOperations === columnOptions.defaultFilterOperations) {
                        setFilterOperationsAsDefaultValues(result);
                    }
                    return result;
                }
            };

            const createColumnsFromOptions = function(that, columnsOptions, bandColumn) {
                let result = [];

                if(columnsOptions) {
                    each(columnsOptions, function(index, columnOptions) {
                        const userStateColumnOptions = that._columnsUserState && checkUserStateColumn(columnOptions, that._columnsUserState[index]) && that._columnsUserState[index];
                        const column = createColumn(that, columnOptions, userStateColumnOptions, bandColumn);

                        if(column) {
                            if(bandColumn) {
                                column.ownerBand = bandColumn;
                            }
                            result.push(column);

                            if(column.columns) {
                                result = result.concat(createColumnsFromOptions(that, column.columns, column));
                                delete column.columns;
                                column.hasColumns = true;
                            }
                        }
                    });
                }

                return result;
            };

            const getParentBandColumns = function(columnIndex, columnParentByIndex) {
                const result = [];
                let parent = columnParentByIndex[columnIndex];

                while(parent) {
                    result.unshift(parent);
                    columnIndex = parent.index;
                    parent = columnParentByIndex[columnIndex];
                }

                return result;
            };

            const getChildrenByBandColumn = function(columnIndex, columnChildrenByIndex, recursive) {
                let result = [];
                const children = columnChildrenByIndex[columnIndex];

                if(children) {
                    for(let i = 0; i < children.length; i++) {
                        const column = children[i];
                        if(!isDefined(column.groupIndex) || column.showWhenGrouped) {
                            result.push(column);
                            if(recursive && column.isBand) {
                                result = result.concat(getChildrenByBandColumn(column.index, columnChildrenByIndex, recursive));
                            }
                        }
                    }
                }

                return result;
            };

            const getColumnByIndexes = function(that, columnIndexes) {
                let result;
                let columns;
                const bandColumnsCache = that.getBandColumnsCache();
                const callbackFilter = function(column) {
                    const ownerBand = result ? result.index : undefined;
                    return column.ownerBand === ownerBand;
                };

                if(bandColumnsCache.isPlain) {
                    result = that._columns[columnIndexes[0]];
                } else {
                    columns = that._columns.filter(callbackFilter);

                    for(let i = 0; i < columnIndexes.length; i++) {
                        result = columns[columnIndexes[i]];

                        if(result) {
                            columns = that._columns.filter(callbackFilter);
                        }
                    }
                }

                return result;
            };

            const getColumnFullPath = function(that, column) {
                let result = [];
                let columns;
                const bandColumnsCache = that.getBandColumnsCache();
                const callbackFilter = function(item) {
                    return item.ownerBand === column.ownerBand;
                };

                if(bandColumnsCache.isPlain) {
                    const columnIndex = that._columns.indexOf(column);

                    if(columnIndex >= 0) {
                        result = [`columns[${columnIndex}]`];
                    }
                } else {
                    columns = that._columns.filter(callbackFilter);

                    while(columns.length && columns.indexOf(column) !== -1) {
                        result.unshift(`columns[${columns.indexOf(column)}]`);

                        column = bandColumnsCache.columnParentByIndex[column.index];
                        columns = column ? that._columns.filter(callbackFilter) : [];
                    }
                }

                return result.join('.');
            };

            const calculateColspan = function(that, columnID) {
                let colspan = 0;
                const columns = that.getChildrenByBandColumn(columnID, true);

                each(columns, function(_, column) {
                    if(column.isBand) {
                        column.colspan = column.colspan || calculateColspan(that, column.index);
                        colspan += column.colspan || 1;
                    } else {
                        colspan += 1;
                    }
                });

                return colspan;
            };

            const processBandColumns = function(that, columns, bandColumnsCache) {
                let rowspan;

                for(let i = 0; i < columns.length; i++) {
                    const column = columns[i];

                    if(column.visible || column.command) {
                        if(column.isBand) {
                            column.colspan = column.colspan || calculateColspan(that, column.index);
                        }

                        if(!column.isBand || !column.colspan) {
                            rowspan = that.getRowCount();

                            if(!column.command && (!isDefined(column.groupIndex) || column.showWhenGrouped)) {
                                rowspan -= getParentBandColumns(column.index, bandColumnsCache.columnParentByIndex).length;
                            }

                            if(rowspan > 1) {
                                column.rowspan = rowspan;
                            }
                        }
                    }
                }
            };

            const getValueDataType = function(value) {
                let dataType = type(value);
                if(dataType !== 'string' && dataType !== 'boolean' && dataType !== 'number' && dataType !== 'date' && dataType !== 'object') {
                    dataType = undefined;
                }
                return dataType;
            };

            const getSerializationFormat = function(dataType, value) {
                switch(dataType) {
                    case 'date':
                    case 'datetime':
                        return dateSerialization.getDateSerializationFormat(value);
                    case 'number':
                        if(isString(value)) {
                            return 'string';
                        }

                        if(isNumeric(value)) {
                            return null;
                        }
                }
            };

            const updateSerializers = function(options, dataType) {
                if(!options.deserializeValue) {
                    if(gridCoreUtils.isDateType(dataType)) {
                        options.deserializeValue = function(value) {
                            return dateSerialization.deserializeDate(value);
                        };
                        options.serializeValue = function(value) {
                            return isString(value) ? value : dateSerialization.serializeDate(value, this.serializationFormat);
                        };
                    }
                    if(dataType === 'number') {
                        options.deserializeValue = function(value) {
                            const parsedValue = parseFloat(value);
                            return isNaN(parsedValue) ? value : parsedValue;
                        };
                        options.serializeValue = function(value, target) {
                            if(target === 'filter') return value;
                            return isDefined(value) && this.serializationFormat === 'string' ? value.toString() : value;
                        };
                    }
                }
            };

            const getAlignmentByDataType = function(dataType, isRTL) {
                switch(dataType) {
                    case 'number':
                        return 'right';
                    case 'boolean':
                        return 'center';
                    default:
                        return getDefaultAlignment(isRTL);
                }
            };

            const customizeTextForBooleanDataType = function(e) {
                if(e.value === true) {
                    return this.trueText || 'true';
                } else if(e.value === false) {
                    return this.falseText || 'false';
                } else {
                    return e.valueText || '';
                }
            };

            const getCustomizeTextByDataType = function(dataType) {
                if(dataType === 'boolean') {
                    return customizeTextForBooleanDataType;
                }
            };

            const createColumnsFromDataSource = function(that, dataSource) {
                const firstItems = that._getFirstItems(dataSource);
                let fieldName;
                const processedFields = {};
                const result = [];

                for(let i = 0; i < firstItems.length; i++) {
                    if(firstItems[i]) {
                        for(fieldName in firstItems[i]) {
                            if(!isFunction(firstItems[i][fieldName]) || variableWrapper.isWrapped(firstItems[i][fieldName])) {
                                processedFields[fieldName] = true;
                            }
                        }
                    }
                }

                for(fieldName in processedFields) {
                    if(fieldName.indexOf('__') !== 0) {
                        const column = createColumn(that, fieldName);
                        result.push(column);
                    }
                }
                return result;
            };

            const updateColumnIndexes = function(that) {
                each(that._columns, function(index, column) {
                    column.index = index;
                });

                each(that._columns, function(index, column) {
                    if(isObject(column.ownerBand)) {
                        column.ownerBand = column.ownerBand.index;
                    }
                });

                each(that._commandColumns, function(index, column) {
                    column.index = -(index + 1);
                });
            };

            const updateColumnGroupIndexes = function(that, currentColumn) {
                normalizeIndexes(that._columns, 'groupIndex', currentColumn, function(column) {
                    const grouped = column.grouped;
                    delete column.grouped;
                    return grouped;
                });
            };

            const updateColumnSortIndexes = function(that, currentColumn) {
                each(that._columns, function(index, column) {
                    if(isDefined(column.sortIndex) && !isSortOrderValid(column.sortOrder)) {
                        delete column.sortIndex;
                    }
                });

                normalizeIndexes(that._columns, 'sortIndex', currentColumn, function(column) {
                    return !isDefined(column.groupIndex) && isSortOrderValid(column.sortOrder);
                });
            };

            const updateColumnVisibleIndexes = function(that, currentColumn) {
                let key;
                let column;
                const bandColumns = {};
                const result = [];
                const bandColumnsCache = that.getBandColumnsCache();
                const columns = that._columns.filter((column) => !column.command);

                for(let i = 0; i < columns.length; i++) {
                    column = columns[i];
                    const parentBandColumns = getParentBandColumns(i, bandColumnsCache.columnParentByIndex);

                    if(parentBandColumns.length) {
                        const bandColumnIndex = parentBandColumns[parentBandColumns.length - 1].index;
                        bandColumns[bandColumnIndex] = bandColumns[bandColumnIndex] || [];
                        bandColumns[bandColumnIndex].push(column);
                    } else {
                        result.push(column);
                    }
                }

                for(key in bandColumns) {
                    normalizeIndexes(bandColumns[key], 'visibleIndex', currentColumn);
                }

                normalizeIndexes(result, 'visibleIndex', currentColumn);
            };

            const getColumnIndexByVisibleIndex = function(that, visibleIndex, location) {
                const rowIndex = isObject(visibleIndex) ? visibleIndex.rowIndex : null;
                const columns = location === GROUP_LOCATION ? that.getGroupColumns() : location === COLUMN_CHOOSER_LOCATION ? that.getChooserColumns() : that.getVisibleColumns(rowIndex);
                let column;

                visibleIndex = isObject(visibleIndex) ? visibleIndex.columnIndex : visibleIndex;
                column = columns[visibleIndex];

                if(column && column.type === GROUP_COMMAND_COLUMN_NAME) {
                    column = that._columns.filter((col) => column.type === col.type)[0] || column;
                }

                return column && isDefined(column.index) ? column.index : -1;
            };

            const moveColumnToGroup = function(that, column, groupIndex) {
                const groupColumns = that.getGroupColumns();
                let i;

                if(groupIndex >= 0) {
                    for(i = 0; i < groupColumns.length; i++) {
                        if(groupColumns[i].groupIndex >= groupIndex) {
                            groupColumns[i].groupIndex++;
                        }
                    }
                } else {
                    groupIndex = 0;
                    for(i = 0; i < groupColumns.length; i++) {
                        groupIndex = Math.max(groupIndex, groupColumns[i].groupIndex + 1);
                    }
                }

                return groupIndex;
            };

            function checkUserStateColumn(column, userStateColumn) {
                return column && userStateColumn && (userStateColumn.name === column.name || !column.name) && (userStateColumn.dataField === column.dataField || column.name);
            }

            const applyUserState = function(that) {
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

                    if(!userStateColumn) return;

                    for(let index = 0; index < USER_STATE_FIELD_NAMES.length; index++) {
                        const fieldName = USER_STATE_FIELD_NAMES[index];

                        if(inArray(fieldName, ignoreColumnOptionNames) >= 0) continue;

                        if(fieldName === 'dataType') {
                            column[fieldName] = column[fieldName] || userStateColumn[fieldName];
                        } else if(inArray(fieldName, USER_STATE_FIELD_NAMES_15_1) >= 0) {
                            if(fieldName in userStateColumn) {
                                column[fieldName] = userStateColumn[fieldName];
                            }
                        } else {
                            if(fieldName === 'selectedFilterOperation' && userStateColumn[fieldName]) {
                                column.defaultSelectedFilterOperation = column[fieldName] || null;
                            }
                            column[fieldName] = userStateColumn[fieldName];
                        }
                    }
                }

                function findUserStateColumn(columnsUserState, column) {
                    const id = column.name || column.dataField;
                    let count = columnCountById[id] || 0;

                    for(let j = 0; j < columnsUserState.length; j++) {
                        if(checkUserStateColumn(column, columnsUserState[j])) {
                            if(count) {
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

                if(columnsUserState) {
                    for(i = 0; i < columns.length; i++) {
                        userStateColumnIndex = findUserStateColumn(columnsUserState, columns[i]);
                        allColumnsHaveState = allColumnsHaveState && userStateColumnIndex >= 0;
                        userStateColumnIndexes.push(userStateColumnIndex);
                    }

                    for(i = 0; i < columns.length; i++) {
                        column = columns[i];
                        userStateColumnIndex = userStateColumnIndexes[i];
                        if(that._hasUserState || allColumnsHaveState) {
                            applyFieldsState(column, columnsUserState[userStateColumnIndex]);
                        }
                        if(userStateColumnIndex >= 0 && isDefined(columnsUserState[userStateColumnIndex].initialIndex)) {
                            resultColumns[userStateColumnIndex] = column;
                        } else {
                            resultColumns.push(column);
                        }
                    }

                    let hasAddedBands = false;
                    for(i = 0; i < columnsUserState.length; i++) {
                        const columnUserState = columnsUserState[i];
                        if(columnUserState.added && findUserStateColumn(columns, columnUserState) < 0) {
                            column = createColumn(that, columnUserState.added);
                            applyFieldsState(column, columnUserState);
                            resultColumns.push(column);
                            if(columnUserState.added.columns) {
                                hasAddedBands = true;
                            }
                        }
                    }

                    if(hasAddedBands) {
                        updateColumnIndexes(that);
                        resultColumns = createColumnsFromOptions(that, resultColumns);
                    }

                    assignColumns(that, resultColumns);
                }
            };

            const updateIndexes = function(that, column) {
                updateColumnIndexes(that);
                updateColumnGroupIndexes(that, column);
                updateColumnSortIndexes(that, column);

                resetBandColumnsCache(that);
                updateColumnVisibleIndexes(that, column);
            };

            const resetColumnsCache = function(that) {
                that.resetColumnsCache();
            };

            function assignColumns(that, columns) {
                that._columns = columns;
                resetColumnsCache(that);
                that.updateColumnDataTypes();
            }

            const updateColumnChanges = function(that, changeType, optionName, columnIndex) {
                const columnChanges = that._columnChanges || {
                    optionNames: { length: 0 },
                    changeTypes: { length: 0 },
                    columnIndex: columnIndex
                };

                optionName = optionName || 'all';

                optionName = optionName.split('.')[0];

                const changeTypes = columnChanges.changeTypes;

                if(changeType && !changeTypes[changeType]) {
                    changeTypes[changeType] = true;
                    changeTypes.length++;
                }

                const optionNames = columnChanges.optionNames;

                if(optionName && !optionNames[optionName]) {
                    optionNames[optionName] = true;
                    optionNames.length++;
                }
                if(columnIndex === undefined || columnIndex !== columnChanges.columnIndex) {
                    delete columnChanges.columnIndex;
                }
                that._columnChanges = columnChanges;
                resetColumnsCache(that);
            };

            const fireColumnsChanged = function(that) {
                const onColumnsChanging = that.option('onColumnsChanging');
                const columnChanges = that._columnChanges;
                const reinitOptionNames = ['dataField', 'lookup', 'dataType', 'columns'];
                const needReinit = (options) => options && reinitOptionNames.some(name => options[name]);

                if(that.isInitialized() && !that._updateLockCount && columnChanges) {
                    if(onColumnsChanging) {
                        that._updateLockCount++;
                        onColumnsChanging(extend({ component: that.component }, columnChanges));
                        that._updateLockCount--;
                    }
                    that._columnChanges = undefined;
                    if(needReinit(columnChanges.optionNames)) {
                        that.reinit();
                    } else {
                        that.columnsChanged.fire(columnChanges);
                    }
                }
            };

            const updateSortOrderWhenGrouping = function(that, column, groupIndex, prevGroupIndex) {
                const columnWasGrouped = prevGroupIndex >= 0;

                if(groupIndex >= 0) {
                    if(!columnWasGrouped) {
                        column.lastSortOrder = column.sortOrder;
                    }
                } else {
                    const sortMode = that.option('sorting.mode');
                    let sortOrder = column.lastSortOrder;

                    if(sortMode === 'single') {
                        const sortedByAnotherColumn = that._columns.some(col => col !== column && isDefined(col.sortIndex));
                        if(sortedByAnotherColumn) {
                            sortOrder = undefined;
                        }
                    }

                    column.sortOrder = sortOrder;
                }
            };

            const fireOptionChanged = function(that, options) {
                const value = options.value;
                const optionName = options.optionName;
                const prevValue = options.prevValue;
                const fullOptionName = options.fullOptionName;
                const fullOptionPath = `${fullOptionName}.${optionName}`;


                if(!IGNORE_COLUMN_OPTION_NAMES[optionName] && that._skipProcessingColumnsChange !== fullOptionPath) {
                    that._skipProcessingColumnsChange = fullOptionPath;
                    that.component._notifyOptionChanged(fullOptionPath, value, prevValue);
                    that._skipProcessingColumnsChange = false;
                }
            };

            const columnOptionCore = function(that, column, optionName, value, notFireEvent) {
                const optionGetter = compileGetter(optionName);
                const columnIndex = column.index;
                let columns;
                let changeType;
                let initialColumn;

                if(arguments.length === 3) {
                    return optionGetter(column, { functionsAsIs: true });
                }
                const prevValue = optionGetter(column, { functionsAsIs: true });
                if(prevValue !== value) {
                    if(optionName === 'groupIndex' || optionName === 'calculateGroupValue') {
                        changeType = 'grouping';
                        updateSortOrderWhenGrouping(that, column, value, prevValue);
                    } else if(optionName === 'sortIndex' || optionName === 'sortOrder' || optionName === 'calculateSortValue') {
                        changeType = 'sorting';
                    } else {
                        changeType = 'columns';
                    }

                    const optionSetter = compileSetter(optionName);
                    optionSetter(column, value, { functionsAsIs: true });
                    const fullOptionName = getColumnFullPath(that, column);

                    if(COLUMN_INDEX_OPTIONS[optionName]) {
                        updateIndexes(that, column);
                        value = optionGetter(column);
                    }

                    if(optionName === 'name' || optionName === 'allowEditing') {
                        that._checkColumns();
                    }

                    fullOptionName && fireOptionChanged(that, {
                        fullOptionName: fullOptionName,
                        optionName: optionName,
                        value: value,
                        prevValue: prevValue
                    });

                    if(!isDefined(prevValue) && !isDefined(value) && optionName.indexOf('buffer') !== 0) {
                        notFireEvent = true;
                    }

                    if(!notFireEvent) {
                        // T346972
                        if(inArray(optionName, USER_STATE_FIELD_NAMES) < 0 && optionName !== 'visibleWidth') {
                            columns = that.option('columns');
                            initialColumn = that.getColumnByPath(fullOptionName, columns);
                            if(isString(initialColumn)) {
                                initialColumn = columns[columnIndex] = { dataField: initialColumn };
                            }
                            if(initialColumn && checkUserStateColumn(initialColumn, column)) {
                                optionSetter(initialColumn, value, { functionsAsIs: true });
                            }
                        }
                        updateColumnChanges(that, changeType, optionName, columnIndex);
                    } else {
                        resetColumnsCache(that);
                    }
                }
            };

            function isSortOrderValid(sortOrder) {
                return sortOrder === 'asc' || sortOrder === 'desc';
            }

            const addExpandColumn = function(that) {
                const options = that._getExpandColumnOptions();

                that.addCommandColumn(options);
            };

            const defaultSetCellValue = function(data, value) {
                const path = this.dataField.split('.');
                const dotCount = path.length - 1;

                if(this.serializeValue) {
                    value = this.serializeValue(value);
                }

                for(let i = 0; i < dotCount; i++) {
                    const name = path[i];
                    data = data[name] = data[name] || {};
                }
                data[path[dotCount]] = value;
            };

            const getDataColumns = function(columns, rowIndex, bandColumnID) {
                const result = [];

                rowIndex = rowIndex || 0;
                columns[rowIndex] && each(columns[rowIndex], function(_, column) {
                    if(column.ownerBand === bandColumnID || column.type === GROUP_COMMAND_COLUMN_NAME) {
                        if(!column.isBand || !column.colspan) {
                            if((!column.command || rowIndex < 1)) {
                                result.push(column);
                            }
                        } else {
                            result.push.apply(result, getDataColumns(columns, rowIndex + 1, column.index));
                        }
                    }
                });

                return result;
            };

            const getRowCount = function(that) {
                let rowCount = 1;
                const bandColumnsCache = that.getBandColumnsCache();
                const columnParentByIndex = bandColumnsCache.columnParentByIndex;

                that._columns.forEach(function(column) {
                    const parents = getParentBandColumns(column.index, columnParentByIndex);
                    const invisibleParents = parents.filter(function(column) { return !column.visible; });

                    if(column.visible && !invisibleParents.length) {
                        rowCount = Math.max(rowCount, parents.length + 1);
                    }
                });

                return rowCount;
            };

            const isCustomCommandColumn = (that, commandColumn) => !!that._columns.filter((column) => column.type === commandColumn.type).length;

            const getFixedPosition = function(that, column) {
                const rtlEnabled = that.option('rtlEnabled');

                if(column.command && !isCustomCommandColumn(that, column) || !column.fixedPosition) {
                    return rtlEnabled ? 'right' : 'left';
                }

                return column.fixedPosition;
            };

            const processExpandColumns = function(columns, expandColumns, type, columnIndex) {
                let customColumnIndex;
                const rowCount = this.getRowCount();
                let rowspan = columns[columnIndex] && columns[columnIndex].rowspan;
                let expandColumnsByType = expandColumns.filter((column) => column.type === type);

                columns.forEach((column, index) => {
                    if(column.type === type) {
                        customColumnIndex = index;
                        rowspan = columns[index + 1] ? columns[index + 1].rowspan : rowCount;
                    }
                });

                if(rowspan > 1) {
                    expandColumnsByType = map(expandColumnsByType, function(expandColumn) { return extend({}, expandColumn, { rowspan: rowspan }); });
                }
                expandColumnsByType.unshift.apply(expandColumnsByType, isDefined(customColumnIndex) ? [customColumnIndex, 1] : [columnIndex, 0]);
                columns.splice.apply(columns, expandColumnsByType);

                return rowspan || 1;
            };

            const digitsCount = function(number) {
                let i;

                for(i = 0; number > 1; i++) {
                    number /= 10;
                }

                return i;
            };

            const numberToString = function(number, digitsCount) {
                let str = number ? number.toString() : '0';

                while(str.length < digitsCount) {
                    str = '0' + str;
                }

                return str;
            };

            const mergeColumns = (that, columns, commandColumns, needToExtend) => {
                let column;
                let commandColumnIndex;
                let result = columns.slice().map(column => extend({}, column));
                const isColumnFixing = that._isColumnFixing();
                let defaultCommandColumns = commandColumns.slice().map(column => extend({ fixed: isColumnFixing }, column));
                const getCommandColumnIndex = (column) => commandColumns.reduce((result, commandColumn, index) => {
                    const columnType = needToExtend && column.type === GROUP_COMMAND_COLUMN_NAME ? 'expand' : column.type;
                    return commandColumn.type === columnType || commandColumn.command === column.command ? index : result;
                }, -1);
                const callbackFilter = (commandColumn) => commandColumn.command !== commandColumns[commandColumnIndex].command;

                for(let i = 0; i < columns.length; i++) {
                    column = columns[i];

                    commandColumnIndex = column && (column.type || column.command) ? getCommandColumnIndex(column) : -1;
                    if(commandColumnIndex >= 0) {
                        if(needToExtend) {
                            result[i] = extend({ fixed: isColumnFixing }, commandColumns[commandColumnIndex], column);
                            if(column.type !== GROUP_COMMAND_COLUMN_NAME) {
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
                            result[i] = extend({}, column, commandColumns[commandColumnIndex], column.type === GROUP_COMMAND_COLUMN_NAME && columnOptions);
                        }
                    }
                }

                if(columns.length && needToExtend && defaultCommandColumns.length) {
                    result = result.concat(defaultCommandColumns);
                }

                return result;
            };

            const isColumnFixed = (that, column) => isDefined(column.fixed) || !column.type ? column.fixed : that._isColumnFixing();

            const convertOwnerBandToColumnReference = (columns) => {
                columns.forEach((column) => {
                    if(isDefined(column.ownerBand)) {
                        column.ownerBand = columns[column.ownerBand];
                    }
                });
            };

            const resetBandColumnsCache = (that) => {
                that._bandColumnsCache = undefined;
            };

            const findColumn = (columns, identifier) => {
                const identifierOptionName = isString(identifier) && identifier.substr(0, identifier.indexOf(':'));
                let column;

                if(identifier === undefined) return;

                if(identifierOptionName) {
                    identifier = identifier.substr(identifierOptionName.length + 1);
                }

                if(identifierOptionName) {
                    column = columns.filter(column => ('' + column[identifierOptionName]) === identifier)[0];
                } else {
                    ['index', 'name', 'dataField', 'caption'].some((optionName) => {
                        column = columns.filter(column => column[optionName] === identifier)[0];
                        return !!column;
                    });
                }

                return column;
            };

            return {
                _getExpandColumnOptions: function() {
                    return {
                        type: 'expand',
                        command: 'expand',
                        width: 'auto',
                        cssClass: COMMAND_EXPAND_CLASS,
                        allowEditing: false, // T165142
                        allowGrouping: false,
                        allowSorting: false,
                        allowResizing: false,
                        allowReordering: false,
                        allowHiding: false
                    };
                },

                _getFirstItems: function(dataSource) {
                    let groupsCount;
                    let items = [];

                    const getFirstItemsCore = function(items, groupsCount) {

                        if(!items || !groupsCount) {
                            return items;
                        }
                        for(let i = 0; i < items.length; i++) {
                            const childItems = getFirstItemsCore(items[i].items || items[i].collapsedItems, groupsCount - 1);
                            if(childItems && childItems.length) {
                                return childItems;
                            }
                        }
                    };

                    if(dataSource && dataSource.items().length > 0) {
                        groupsCount = gridCoreUtils.normalizeSortingInfo(dataSource.group()).length;
                        items = getFirstItemsCore(dataSource.items(), groupsCount) || [];
                    }
                    return items;
                },
                _endUpdateCore: function() {
                    !this._skipProcessingColumnsChange && fireColumnsChanged(this);
                },
                init: function() {
                    const that = this;
                    const columns = that.option('columns');

                    that._commandColumns = that._commandColumns || [];

                    that._columns = that._columns || [];

                    that._isColumnsFromOptions = !!columns;

                    if(that._isColumnsFromOptions) {
                        assignColumns(that, columns ? createColumnsFromOptions(that, columns) : []);
                        applyUserState(that);
                    } else {
                        assignColumns(that, that._columnsUserState ? createColumnsFromOptions(that, that._columnsUserState) : that._columns);
                    }

                    addExpandColumn(that);

                    if(that._dataSourceApplied) {
                        that.applyDataSource(that._dataSource, true);
                    } else {
                        updateIndexes(that);
                    }

                    that._checkColumns();
                },
                callbackNames: function() {
                    return ['columnsChanged'];
                },

                getColumnByPath: function(path, columns) {
                    const that = this;
                    let column;
                    const columnIndexes = [];

                    path.replace(regExp, function(_, columnIndex) {
                        columnIndexes.push(parseInt(columnIndex));
                        return '';
                    });

                    if(columnIndexes.length) {
                        if(columns) {
                            column = columnIndexes.reduce(function(column, index) {
                                return column && column.columns && column.columns[index];
                            }, { columns: columns });
                        } else {
                            column = getColumnByIndexes(that, columnIndexes);
                        }
                    }

                    return column;
                },

                optionChanged: function(args) {
                    let needUpdateRequireResize;

                    switch(args.name) {
                        case 'adaptColumnWidthByRatio':
                            args.handled = true;
                            break;
                        case 'dataSource':
                            if(args.value !== args.previousValue && !this.option('columns') && (!Array.isArray(args.value) || !Array.isArray(args.previousValue))) {
                                this._columns = [];
                            }
                            break;
                        case 'columns':
                            needUpdateRequireResize = this._skipProcessingColumnsChange;
                            args.handled = true;

                            if(!this._skipProcessingColumnsChange) {
                                if(args.name === args.fullName) {
                                    this._columnsUserState = null;
                                    this._ignoreColumnOptionNames = null;
                                    this.init();
                                } else {
                                    this._columnOptionChanged(args);
                                    needUpdateRequireResize = true;
                                }
                            }

                            if(needUpdateRequireResize) {
                                this._updateRequireResize(args);
                            }
                            break;
                        case 'commonColumnSettings':
                        case 'columnAutoWidth':
                        case 'allowColumnResizing':
                        case 'allowColumnReordering':
                        case 'columnFixing':
                        case 'grouping':
                        case 'groupPanel':
                        case 'regenerateColumnsByVisibleItems':
                        case 'customizeColumns':
                        case 'editing':
                        case 'columnHidingEnabled':
                        case 'dateSerializationFormat':
                        case 'columnResizingMode':
                        case 'columnMinWidth':
                        case 'columnWidth': {
                            args.handled = true;
                            const ignoreColumnOptionNames = args.fullName === 'columnWidth' && ['width'];
                            const isEditingPopup = args.fullName?.indexOf('editing.popup') === 0;
                            const isEditingForm = args.fullName?.indexOf('editing.form') === 0;
                            const isEditRowKey = args.fullName?.indexOf('editing.editRowKey') === 0;
                            const isEditColumnName = args.fullName?.indexOf('editing.editColumnName') === 0;
                            const isChanges = args.fullName?.indexOf('editing.changes') === 0;
                            const needReinit = !isEditingPopup && !isEditingForm && !isEditRowKey && !isChanges && !isEditColumnName;

                            if(needReinit) {
                                this.reinit(ignoreColumnOptionNames);
                            }
                            break;
                        }
                        case 'rtlEnabled':
                            this.reinit();
                            break;
                        default:
                            this.callBase(args);
                    }
                },

                _columnOptionChanged: function(args) {
                    let columnOptionValue = {};
                    const column = this.getColumnByPath(args.fullName);
                    const columnOptionName = args.fullName.replace(regExp, '');

                    if(column) {
                        if(columnOptionName) {
                            columnOptionValue[columnOptionName] = args.value;
                        } else {
                            columnOptionValue = args.value;
                        }

                        this._skipProcessingColumnsChange = args.fullName;
                        this.columnOption(column.index, columnOptionValue);
                        this._skipProcessingColumnsChange = false;
                    }
                },

                _updateRequireResize: function(args) {
                    const component = this.component;

                    if(args.fullName.replace(regExp, '') === 'width' && component._updateLockCount) {
                        component._requireResize = true;
                    }
                },

                publicMethods: function() {
                    return ['addColumn', 'deleteColumn', 'columnOption', 'columnCount', 'clearSorting', 'clearGrouping', 'getVisibleColumns', 'getVisibleColumnIndex'];
                },
                applyDataSource: function(dataSource, forceApplying) {
                    const that = this;
                    const isDataSourceLoaded = dataSource && dataSource.isLoaded();

                    that._dataSource = dataSource;

                    if(!that._dataSourceApplied || that._dataSourceColumnsCount === 0 || forceApplying || that.option('regenerateColumnsByVisibleItems')) {
                        if(isDataSourceLoaded) {
                            if(!that._isColumnsFromOptions) {
                                const columnsFromDataSource = createColumnsFromDataSource(that, dataSource);
                                if(columnsFromDataSource.length) {
                                    assignColumns(that, columnsFromDataSource);
                                    that._dataSourceColumnsCount = that._columns.length;
                                    applyUserState(that);
                                }
                            }
                            return that.updateColumns(dataSource, forceApplying);
                        } else {
                            that._dataSourceApplied = false;
                        }
                    } else if(isDataSourceLoaded && !that.isAllDataTypesDefined(true) && that.updateColumnDataTypes(dataSource)) {
                        updateColumnChanges(that, 'columns');
                        fireColumnsChanged(that);
                        return new Deferred().reject().promise();
                    }
                },
                reset: function() {
                    this._dataSourceApplied = false;
                    this._dataSourceColumnsCount = undefined;
                    this.reinit();
                },
                resetColumnsCache: function() {
                    const that = this;
                    that._visibleColumns = undefined;
                    that._fixedColumns = undefined;
                    that._rowCount = undefined;
                    resetBandColumnsCache(that);
                },
                reinit: function(ignoreColumnOptionNames) {
                    this._columnsUserState = this.getUserState();
                    this._ignoreColumnOptionNames = ignoreColumnOptionNames || null;
                    this.init();

                    if(ignoreColumnOptionNames) {
                        this._ignoreColumnOptionNames = null;
                    }
                },
                isInitialized: function() {
                    return !!this._columns.length || !!this.option('columns');
                },
                isDataSourceApplied: function() {
                    return this._dataSourceApplied;
                },
                getCommonSettings: function(column) {
                    const commonColumnSettings = (!column || !column.type) && this.option('commonColumnSettings') || {};
                    const groupingOptions = this.option('grouping') || {};
                    const groupPanelOptions = this.option('groupPanel') || {};

                    return extend({
                        allowFixing: this.option('columnFixing.enabled'),
                        allowResizing: this.option('allowColumnResizing') || undefined,
                        allowReordering: this.option('allowColumnReordering'),
                        minWidth: this.option('columnMinWidth'),
                        width: this.option('columnWidth'),
                        autoExpandGroup: groupingOptions.autoExpandAll,
                        allowCollapsing: groupingOptions.allowCollapsing,
                        allowGrouping: groupPanelOptions.allowColumnDragging && groupPanelOptions.visible || groupingOptions.contextMenuEnabled
                    }, commonColumnSettings);
                },
                isColumnOptionUsed: function(optionName) {
                    for(let i = 0; i < this._columns.length; i++) {
                        if(this._columns[i][optionName]) {
                            return true;
                        }
                    }
                },
                isAllDataTypesDefined: function(checkSerializers) {
                    const columns = this._columns;

                    if(!columns.length) {
                        return false;
                    }

                    for(let i = 0; i < columns.length; i++) {
                        if(!columns[i].dataField && columns[i].calculateCellValue === columns[i].defaultCalculateCellValue) {
                            continue;
                        }
                        if(!columns[i].dataType || (checkSerializers && columns[i].deserializeValue && columns[i].serializationFormat === undefined)) {
                            return false;
                        }
                    }

                    return true;
                },
                getColumns: function() {
                    return this._columns;
                },
                isBandColumnsUsed: function() {
                    return this.getColumns().some(function(column) {
                        return column.isBand;
                    });
                },
                getGroupColumns: function() {
                    const result = [];

                    each(this._columns, function() {
                        const column = this;
                        if(isDefined(column.groupIndex)) {
                            result[column.groupIndex] = column;
                        }
                    });
                    return result;
                },

                getVisibleColumns: function(rowIndex) {
                    this._visibleColumns = this._visibleColumns || this._getVisibleColumnsCore();
                    rowIndex = isDefined(rowIndex) ? rowIndex : this._visibleColumns.length - 1;

                    return this._visibleColumns[rowIndex] || [];
                },
                getFixedColumns: function(rowIndex) {
                    this._fixedColumns = this._fixedColumns || this._getFixedColumnsCore();
                    rowIndex = isDefined(rowIndex) ? rowIndex : this._fixedColumns.length - 1;

                    return this._fixedColumns[rowIndex] || [];

                },
                getFilteringColumns: function() {
                    return this.getColumns().filter(item => (item.dataField || item.name) && (item.allowFiltering || item.allowHeaderFiltering)).map(item => {
                        const field = extend(true, {}, item);
                        if(!isDefined(field.dataField)) {
                            field.dataField = field.name;
                        }
                        field.filterOperations = item.filterOperations !== item.defaultFilterOperations ? field.filterOperations : null;
                        return field;
                    });
                },
                getColumnIndexOffset: function() {
                    return 0;
                },
                _getFixedColumnsCore: function() {
                    const that = this;
                    const result = [];
                    const rowCount = that.getRowCount();
                    const isColumnFixing = that._isColumnFixing();
                    const transparentColumn = { command: 'transparent' };
                    let transparentColspan = 0;
                    let notFixedColumnCount;
                    let transparentColumnIndex;
                    let lastFixedPosition;

                    if(isColumnFixing) {
                        for(let i = 0; i <= rowCount; i++) {
                            notFixedColumnCount = 0;
                            lastFixedPosition = null;
                            transparentColumnIndex = null;
                            const visibleColumns = that.getVisibleColumns(i, true);

                            for(let j = 0; j < visibleColumns.length; j++) {
                                const prevColumn = visibleColumns[j - 1];
                                const column = visibleColumns[j];

                                if(!column.fixed) {
                                    if(i === 0) {
                                        if(column.isBand && column.colspan) {
                                            transparentColspan += column.colspan;
                                        } else {
                                            transparentColspan++;
                                        }
                                    }

                                    notFixedColumnCount++;
                                    if(!isDefined(transparentColumnIndex)) {
                                        transparentColumnIndex = j;
                                    }
                                } else if(prevColumn && prevColumn.fixed && getFixedPosition(that, prevColumn) !== getFixedPosition(that, column)) {
                                    if(!isDefined(transparentColumnIndex)) {
                                        transparentColumnIndex = j;
                                    }
                                } else {
                                    lastFixedPosition = column.fixedPosition;
                                }
                            }

                            if(i === 0 && (notFixedColumnCount === 0 || notFixedColumnCount >= visibleColumns.length)) {
                                return [];
                            }

                            if(!isDefined(transparentColumnIndex)) {
                                transparentColumnIndex = lastFixedPosition === 'right' ? 0 : visibleColumns.length;
                            }

                            result[i] = visibleColumns.slice(0);
                            if(!transparentColumn.colspan) {
                                transparentColumn.colspan = transparentColspan;
                            }
                            result[i].splice(transparentColumnIndex, notFixedColumnCount, transparentColumn);
                        }
                    }

                    return result.map(columns => {
                        return columns.map(column => {
                            const newColumn = { ...column };
                            if(newColumn.headerId) {
                                newColumn.headerId += '-fixed';
                            }
                            return newColumn;
                        });
                    });
                },
                _isColumnFixing: function() {
                    let isColumnFixing = this.option('columnFixing.enabled');

                    !isColumnFixing && each(this._columns, function(_, column) {
                        if(column.fixed) {
                            isColumnFixing = true;
                            return false;
                        }
                    });

                    return isColumnFixing;
                },
                _getExpandColumnsCore: function() {
                    return this.getGroupColumns();
                },
                getExpandColumns: function() {
                    let expandColumns = this._getExpandColumnsCore();
                    let expandColumn;
                    const firstGroupColumn = expandColumns.filter((column) => column.groupIndex === 0)[0];
                    const isFixedFirstGroupColumn = firstGroupColumn && firstGroupColumn.fixed;
                    const isColumnFixing = this._isColumnFixing();

                    if(expandColumns.length) {
                        expandColumn = this.columnOption('command:expand');
                    }

                    expandColumns = map(expandColumns, (column) => {
                        return extend({}, column, {
                            visibleWidth: null,
                            minWidth: null,
                            cellTemplate: !isDefined(column.groupIndex) ? column.cellTemplate : null,
                            headerCellTemplate: null,
                            fixed: !isDefined(column.groupIndex) || !isFixedFirstGroupColumn ? isColumnFixing : true,
                        }, expandColumn, {
                            index: column.index,
                            type: column.type || GROUP_COMMAND_COLUMN_NAME
                        });
                    });

                    return expandColumns;
                },
                getBandColumnsCache: function() {
                    if(!this._bandColumnsCache) {
                        const columns = this._columns;
                        const columnChildrenByIndex = {};
                        const columnParentByIndex = {};
                        let isPlain = true;

                        columns.forEach(function(column) {
                            let parentIndex = column.ownerBand;
                            const parent = columns[parentIndex];

                            if(column.hasColumns) {
                                isPlain = false;
                            }

                            if(column.colspan) {
                                column.colspan = undefined;
                            }

                            if(column.rowspan) {
                                column.rowspan = undefined;
                            }

                            if(parent) {
                                columnParentByIndex[column.index] = parent;
                            } else {
                                parentIndex = -1;
                            }

                            columnChildrenByIndex[parentIndex] = columnChildrenByIndex[parentIndex] || [];
                            columnChildrenByIndex[parentIndex].push(column);
                        });

                        this._bandColumnsCache = {
                            isPlain: isPlain,
                            columnChildrenByIndex: columnChildrenByIndex,
                            columnParentByIndex: columnParentByIndex
                        };
                    }

                    return this._bandColumnsCache;
                },
                _isColumnVisible: function(column) {
                    return column.visible && this.isParentColumnVisible(column.index);
                },
                _getVisibleColumnsCore: function() {
                    const that = this;
                    let i;
                    const result = [];
                    let rowspanGroupColumns = 0;
                    let rowspanExpandColumns = 0;
                    const rowCount = that.getRowCount();
                    const positiveIndexedColumns = [];
                    const negativeIndexedColumns = [];
                    let notGroupedColumnsCount = 0;
                    let isFixedToEnd;
                    const rtlEnabled = that.option('rtlEnabled');
                    const bandColumnsCache = that.getBandColumnsCache();
                    const expandColumns = mergeColumns(that, that.getExpandColumns(), that._columns);
                    const columns = mergeColumns(that, that._columns, that._commandColumns, true);
                    const columnDigitsCount = digitsCount(columns.length);

                    processBandColumns(that, columns, bandColumnsCache);

                    for(i = 0; i < rowCount; i++) {
                        result[i] = [];
                        negativeIndexedColumns[i] = [{}];
                        positiveIndexedColumns[i] = [{}, {}, {}];
                    }

                    each(columns, function() {
                        const column = this;
                        let visibleIndex = column.visibleIndex;
                        let indexedColumns;
                        const parentBandColumns = getParentBandColumns(column.index, bandColumnsCache.columnParentByIndex);
                        const visible = that._isColumnVisible(column);

                        if(visible && (!isDefined(column.groupIndex) || column.showWhenGrouped)) {
                            const rowIndex = parentBandColumns.length;

                            if(visibleIndex < 0) {
                                visibleIndex = -visibleIndex;
                                indexedColumns = negativeIndexedColumns[rowIndex];
                            } else {
                                column.fixed = parentBandColumns.length ? parentBandColumns[0].fixed : column.fixed;
                                column.fixedPosition = parentBandColumns.length ? parentBandColumns[0].fixedPosition : column.fixedPosition;

                                if(column.fixed) {
                                    isFixedToEnd = column.fixedPosition === 'right';

                                    if(rtlEnabled && (!column.command || isCustomCommandColumn(that, column))) {
                                        isFixedToEnd = !isFixedToEnd;
                                    }

                                    if(isFixedToEnd) {
                                        indexedColumns = positiveIndexedColumns[rowIndex][2];
                                    } else {
                                        indexedColumns = positiveIndexedColumns[rowIndex][0];
                                    }
                                } else {
                                    indexedColumns = positiveIndexedColumns[rowIndex][1];
                                }
                            }

                            if(parentBandColumns.length) {
                                visibleIndex = numberToString(visibleIndex, columnDigitsCount);
                                for(i = parentBandColumns.length - 1; i >= 0; i--) {
                                    visibleIndex = numberToString(parentBandColumns[i].visibleIndex, columnDigitsCount) + visibleIndex;
                                }
                            }
                            indexedColumns[visibleIndex] = indexedColumns[visibleIndex] || [];
                            indexedColumns[visibleIndex].push(column);

                            notGroupedColumnsCount++;
                        }
                    });

                    each(result, function(rowIndex) {
                        orderEach(negativeIndexedColumns[rowIndex], function(_, columns) {
                            result[rowIndex].unshift.apply(result[rowIndex], columns);
                        });

                        const firstPositiveIndexColumn = result[rowIndex].length;
                        each(positiveIndexedColumns[rowIndex], function(index, columnsByFixing) {
                            orderEach(columnsByFixing, function(_, columnsByVisibleIndex) {
                                result[rowIndex].push.apply(result[rowIndex], columnsByVisibleIndex);
                            });
                        });

                        // The order of processing is important
                        if(rowspanExpandColumns < (rowIndex + 1)) {
                            rowspanExpandColumns += processExpandColumns.call(that, result[rowIndex], expandColumns, 'detailExpand', firstPositiveIndexColumn);
                        }

                        if(rowspanGroupColumns < (rowIndex + 1)) {
                            rowspanGroupColumns += processExpandColumns.call(that, result[rowIndex], expandColumns, GROUP_COMMAND_COLUMN_NAME, firstPositiveIndexColumn);
                        }
                    });

                    result.push(getDataColumns(result));

                    if(!notGroupedColumnsCount && that._columns.length) {
                        result[rowCount].push({ command: 'empty' });
                    }

                    return result;
                },
                getInvisibleColumns: function(columns, bandColumnIndex) {
                    const that = this;
                    let result = [];
                    let hiddenColumnsByBand;

                    columns = columns || that._columns;

                    each(columns, function(_, column) {
                        if(column.ownerBand !== bandColumnIndex) {
                            return;
                        }
                        if(column.isBand) {
                            if(!column.visible) {
                                hiddenColumnsByBand = that.getChildrenByBandColumn(column.index);
                            } else {
                                hiddenColumnsByBand = that.getInvisibleColumns(that.getChildrenByBandColumn(column.index), column.index);
                            }

                            if(hiddenColumnsByBand.length) {
                                result.push(column);
                                result = result.concat(hiddenColumnsByBand);
                            }
                            return;
                        }
                        if(!column.visible) {
                            result.push(column);
                        }
                    });

                    return result;
                },
                getChooserColumns: function(getAllColumns) {
                    const columns = getAllColumns ? this.getColumns() : this.getInvisibleColumns();

                    return grep(columns, function(column) { return column.showInColumnChooser; });
                },
                allowMoveColumn: function(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation) {
                    const that = this;
                    const columnIndex = getColumnIndexByVisibleIndex(that, fromVisibleIndex, sourceLocation);
                    const sourceColumn = that._columns[columnIndex];

                    if(sourceColumn && (sourceColumn.allowReordering || sourceColumn.allowGrouping || sourceColumn.allowHiding)) {
                        if(sourceLocation === targetLocation) {
                            if(sourceLocation === COLUMN_CHOOSER_LOCATION) {
                                return false;
                            }

                            fromVisibleIndex = isObject(fromVisibleIndex) ? fromVisibleIndex.columnIndex : fromVisibleIndex;
                            toVisibleIndex = isObject(toVisibleIndex) ? toVisibleIndex.columnIndex : toVisibleIndex;

                            return fromVisibleIndex !== toVisibleIndex && fromVisibleIndex + 1 !== toVisibleIndex;
                        } else if((sourceLocation === GROUP_LOCATION && targetLocation !== COLUMN_CHOOSER_LOCATION) || targetLocation === GROUP_LOCATION) {
                            return sourceColumn && sourceColumn.allowGrouping;
                        } else if(sourceLocation === COLUMN_CHOOSER_LOCATION || targetLocation === COLUMN_CHOOSER_LOCATION) {
                            return sourceColumn && sourceColumn.allowHiding;
                        }
                        return true;
                    }
                    return false;
                },
                moveColumn: function(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation) {
                    const that = this;
                    const options = {};
                    let prevGroupIndex;
                    const fromIndex = getColumnIndexByVisibleIndex(that, fromVisibleIndex, sourceLocation);
                    const toIndex = getColumnIndexByVisibleIndex(that, toVisibleIndex, targetLocation);
                    let targetGroupIndex;

                    if(fromIndex >= 0) {
                        const column = that._columns[fromIndex];
                        toVisibleIndex = isObject(toVisibleIndex) ? toVisibleIndex.columnIndex : toVisibleIndex;
                        targetGroupIndex = toIndex >= 0 ? that._columns[toIndex].groupIndex : -1;

                        if(isDefined(column.groupIndex) && sourceLocation === GROUP_LOCATION) {
                            if(targetGroupIndex > column.groupIndex) {
                                targetGroupIndex--;
                            }
                            if(targetLocation !== GROUP_LOCATION) {
                                options.groupIndex = undefined;
                            } else {
                                prevGroupIndex = column.groupIndex;
                                delete column.groupIndex;
                                updateColumnGroupIndexes(that);
                            }
                        }

                        if(targetLocation === GROUP_LOCATION) {
                            options.groupIndex = moveColumnToGroup(that, column, targetGroupIndex);
                            column.groupIndex = prevGroupIndex;
                        } else if(toVisibleIndex >= 0) {
                            const targetColumn = that._columns[toIndex];

                            if(!targetColumn || column.ownerBand !== targetColumn.ownerBand) {
                                options.visibleIndex = MAX_SAFE_INTEGER;
                            } else {
                                if(isColumnFixed(that, column) ^ isColumnFixed(that, targetColumn)) {
                                    options.visibleIndex = MAX_SAFE_INTEGER;
                                } else {
                                    options.visibleIndex = targetColumn.visibleIndex;
                                }
                            }
                        }

                        const isVisible = targetLocation !== COLUMN_CHOOSER_LOCATION;

                        if(column.visible !== isVisible) {
                            options.visible = isVisible;
                        }

                        that.columnOption(column.index, options);
                    }
                },
                changeSortOrder: function(columnIndex, sortOrder) {
                    const that = this;
                    const options = {};
                    const sortingOptions = that.option('sorting');
                    const sortingMode = sortingOptions && sortingOptions.mode;
                    const needResetSorting = sortingMode === 'single' || !sortOrder;
                    const allowSorting = sortingMode === 'single' || sortingMode === 'multiple';
                    const column = that._columns[columnIndex];
                    const nextSortOrder = function(column) {
                        if(sortOrder === 'ctrl') {
                            if(!(('sortOrder' in column) && ('sortIndex' in column))) {
                                return false;
                            }

                            options.sortOrder = undefined;
                            options.sortIndex = undefined;
                        } else if(isDefined(column.groupIndex) || isDefined(column.sortIndex)) {
                            options.sortOrder = column.sortOrder === 'desc' ? 'asc' : 'desc';
                        } else {
                            options.sortOrder = 'asc';
                        }

                        return true;
                    };

                    if(allowSorting && column && column.allowSorting) {
                        if(needResetSorting && !isDefined(column.groupIndex)) {
                            each(that._columns, function(index) {
                                if(index !== columnIndex && this.sortOrder) {
                                    if(!isDefined(this.groupIndex)) {
                                        delete this.sortOrder;
                                    }
                                    delete this.sortIndex;
                                }
                            });
                        }
                        if(isSortOrderValid(sortOrder)) {
                            if(column.sortOrder !== sortOrder) {
                                options.sortOrder = sortOrder;
                            }
                        } else if(sortOrder === 'none') {
                            if(column.sortOrder) {
                                options.sortIndex = undefined;
                                options.sortOrder = undefined;
                            }
                        } else {
                            nextSortOrder(column);
                        }
                    }

                    that.columnOption(column.index, options);
                },
                getSortDataSourceParameters: function(useLocalSelector) {
                    const that = this;
                    const sortColumns = [];
                    const sort = [];

                    each(that._columns, function() {
                        if((this.dataField || this.selector || this.calculateCellValue) && isDefined(this.sortIndex) && !isDefined(this.groupIndex)) {
                            sortColumns[this.sortIndex] = this;
                        }
                    });
                    each(sortColumns, function() {
                        const sortOrder = this && this.sortOrder;
                        if(isSortOrderValid(sortOrder)) {
                            const sortItem = {
                                selector: this.calculateSortValue || this.displayField || this.calculateDisplayValue || (useLocalSelector && this.selector) || this.dataField || this.calculateCellValue,
                                desc: (this.sortOrder === 'desc')
                            };

                            if(this.sortingMethod) {
                                sortItem.compare = this.sortingMethod.bind(this);
                            }

                            sort.push(sortItem);
                        }
                    });
                    return sort.length > 0 ? sort : null;
                },
                getGroupDataSourceParameters: function(useLocalSelector) {
                    const group = [];

                    each(this.getGroupColumns(), function() {
                        const selector = this.calculateGroupValue || this.displayField || this.calculateDisplayValue || (useLocalSelector && this.selector) || this.dataField || this.calculateCellValue;
                        if(selector) {
                            const groupItem = {
                                selector: selector,
                                desc: (this.sortOrder === 'desc'),
                                isExpanded: !!this.autoExpandGroup
                            };

                            if(this.sortingMethod) {
                                groupItem.compare = this.sortingMethod.bind(this);
                            }

                            group.push(groupItem);
                        }
                    });
                    return group.length > 0 ? group : null;
                },
                refresh: function(updateNewLookupsOnly) {
                    const deferreds = [];

                    each(this._columns, function() {
                        const lookup = this.lookup;

                        if(lookup && !this.calculateDisplayValue) {
                            if(updateNewLookupsOnly && lookup.valueMap) {
                                return;
                            }

                            if(lookup.update) {
                                deferreds.push(lookup.update());
                            }
                        }
                    });
                    return when.apply($, deferreds).done(resetColumnsCache.bind(null, this));
                },
                _updateColumnOptions: function(column, columnIndex) {
                    column.selector = column.selector || function(data) { return column.calculateCellValue(data); };

                    each(['calculateSortValue', 'calculateGroupValue', 'calculateDisplayValue'], function(_, calculateCallbackName) {
                        const calculateCallback = column[calculateCallbackName];
                        if(isFunction(calculateCallback) && !calculateCallback.originalCallback) {
                            column[calculateCallbackName] = function(data) { return calculateCallback.call(column, data); };
                            column[calculateCallbackName].originalCallback = calculateCallback;
                            column[calculateCallbackName].columnIndex = columnIndex;
                        }
                    });

                    if(isString(column.calculateDisplayValue)) {
                        column.displayField = column.calculateDisplayValue;
                        column.calculateDisplayValue = compileGetter(column.displayField);
                    }
                    if(column.calculateDisplayValue) {
                        column.displayValueMap = column.displayValueMap || {};
                    }

                    updateSerializers(column, column.dataType);

                    const lookup = column.lookup;
                    if(lookup) {
                        updateSerializers(lookup, lookup.dataType);
                    }

                    const dataType = lookup ? lookup.dataType : column.dataType;
                    if(dataType) {
                        column.alignment = column.alignment || getAlignmentByDataType(dataType, this.option('rtlEnabled'));
                        column.format = column.format || gridCoreUtils.getFormatByDataType(dataType);
                        column.customizeText = column.customizeText || getCustomizeTextByDataType(dataType);
                        column.defaultFilterOperations = column.defaultFilterOperations || !lookup && DATATYPE_OPERATIONS[dataType] || [];
                        if(!isDefined(column.filterOperations)) {
                            setFilterOperationsAsDefaultValues(column);
                        }
                        column.defaultFilterOperation = column.filterOperations && column.filterOperations[0] || '=';
                        column.showEditorAlways = isDefined(column.showEditorAlways) ? column.showEditorAlways : (dataType === 'boolean' && !column.cellTemplate);
                    }
                },
                updateColumnDataTypes: function(dataSource) {
                    const that = this;
                    const dateSerializationFormat = that.option('dateSerializationFormat');
                    const firstItems = that._getFirstItems(dataSource);
                    let isColumnDataTypesUpdated = false;

                    each(that._columns, function(index, column) {
                        let i;
                        let value;
                        let dataType;
                        let lookupDataType;
                        let valueDataType;
                        const lookup = column.lookup;

                        if(gridCoreUtils.isDateType(column.dataType) && column.serializationFormat === undefined) {
                            column.serializationFormat = dateSerializationFormat;
                        }
                        if(lookup && gridCoreUtils.isDateType(lookup.dataType) && column.serializationFormat === undefined) {
                            lookup.serializationFormat = dateSerializationFormat;
                        }

                        if(column.calculateCellValue && firstItems.length) {
                            if(!column.dataType || (lookup && !lookup.dataType)) {
                                for(i = 0; i < firstItems.length; i++) {
                                    value = column.calculateCellValue(firstItems[i]);

                                    if(!column.dataType) {
                                        valueDataType = getValueDataType(value);
                                        dataType = dataType || valueDataType;
                                        if(dataType && valueDataType && dataType !== valueDataType) {
                                            dataType = 'string';
                                        }
                                    }

                                    if(lookup && !lookup.dataType) {
                                        valueDataType = getValueDataType(gridCoreUtils.getDisplayValue(column, value, firstItems[i]));
                                        lookupDataType = lookupDataType || valueDataType;
                                        if(lookupDataType && valueDataType && lookupDataType !== valueDataType) {
                                            lookupDataType = 'string';
                                        }
                                    }
                                }
                                if(dataType || lookupDataType) {
                                    if(dataType) {
                                        column.dataType = dataType;
                                    }

                                    if(lookup && lookupDataType) {
                                        lookup.dataType = lookupDataType;
                                    }
                                    isColumnDataTypesUpdated = true;
                                }
                            }
                            if(column.serializationFormat === undefined || (lookup && lookup.serializationFormat === undefined)) {
                                for(i = 0; i < firstItems.length; i++) {
                                    value = column.calculateCellValue(firstItems[i], true);

                                    if(column.serializationFormat === undefined) {
                                        column.serializationFormat = getSerializationFormat(column.dataType, value);
                                    }

                                    if(lookup && lookup.serializationFormat === undefined) {
                                        lookup.serializationFormat = getSerializationFormat(lookup.dataType, lookup.calculateCellValue(value, true));
                                    }
                                }
                            }
                        }

                        that._updateColumnOptions(column, index);
                    });

                    return isColumnDataTypesUpdated;
                },
                _customizeColumns: function(columns) {
                    const that = this;
                    const customizeColumns = that.option('customizeColumns');

                    if(customizeColumns) {
                        const hasOwnerBand = columns.some(function(column) {
                            return isObject(column.ownerBand);
                        });

                        if(hasOwnerBand) {
                            updateIndexes(that);
                        }

                        customizeColumns(columns);
                        assignColumns(that, createColumnsFromOptions(that, columns));
                    }
                },
                updateColumns: function(dataSource, forceApplying) {
                    if(!forceApplying) {
                        this.updateSortingGrouping(dataSource);
                    }

                    if(!dataSource || dataSource.isLoaded()) {
                        const sortParameters = dataSource ? dataSource.sort() || [] : this.getSortDataSourceParameters();
                        const groupParameters = dataSource ? dataSource.group() || [] : this.getGroupDataSourceParameters();
                        const filterParameters = dataSource?.lastLoadOptions().filter;

                        this._customizeColumns(this._columns);

                        updateIndexes(this);

                        const columns = this._columns;
                        return when(this.refresh(true)).always(() => {
                            if(this._columns !== columns) return;

                            this._updateChanges(dataSource, { sorting: sortParameters, grouping: groupParameters, filtering: filterParameters });

                            fireColumnsChanged(this);
                        });
                    }
                },
                _updateChanges: function(dataSource, parameters) {
                    if(dataSource) {
                        this.updateColumnDataTypes(dataSource);
                        this._dataSourceApplied = true;
                    }

                    if(!gridCoreUtils.equalSortParameters(parameters.sorting, this.getSortDataSourceParameters())) {
                        updateColumnChanges(this, 'sorting');
                    }
                    if(!gridCoreUtils.equalSortParameters(parameters.grouping, this.getGroupDataSourceParameters())) {
                        updateColumnChanges(this, 'grouping');
                    }

                    const dataController = this.getController('data');
                    if(dataController && !gridCoreUtils.equalFilterParameters(parameters.filtering, dataController.getCombinedFilter())) {
                        updateColumnChanges(this, 'filtering');
                    }
                    updateColumnChanges(this, 'columns');
                },
                updateSortingGrouping: function(dataSource, fromDataSource) {
                    const that = this;
                    let sortParameters;
                    let isColumnsChanged;
                    const updateSortGroupParameterIndexes = function(columns, sortParameters, indexParameterName) {

                        each(columns, function(index, column) {
                            delete column[indexParameterName];
                            if(sortParameters) {
                                for(let i = 0; i < sortParameters.length; i++) {
                                    const selector = sortParameters[i].selector;
                                    const isExpanded = sortParameters[i].isExpanded;

                                    if(selector === column.dataField ||
                                        selector === column.name ||
                                        selector === column.selector ||
                                        selector === column.calculateCellValue ||
                                        selector === column.calculateGroupValue ||
                                        selector === column.calculateDisplayValue
                                    ) {
                                        column.sortOrder = column.sortOrder || (sortParameters[i].desc ? 'desc' : 'asc');

                                        if(isExpanded !== undefined) {
                                            column.autoExpandGroup = isExpanded;
                                        }

                                        column[indexParameterName] = i;
                                        break;
                                    }
                                }
                            }
                        });
                    };

                    if(dataSource) {
                        sortParameters = gridCoreUtils.normalizeSortingInfo(dataSource.sort());
                        const groupParameters = gridCoreUtils.normalizeSortingInfo(dataSource.group());
                        const columnsGroupParameters = that.getGroupDataSourceParameters();
                        const columnsSortParameters = that.getSortDataSourceParameters();
                        if(!that._columns.length) {
                            each(groupParameters, function(index, group) {
                                that._columns.push(group.selector);
                            });
                            each(sortParameters, function(index, sort) {
                                that._columns.push(sort.selector);
                            });
                            assignColumns(that, createColumnsFromOptions(that, that._columns));
                        }
                        if((fromDataSource || (!columnsGroupParameters && !that._hasUserState)) && !gridCoreUtils.equalSortParameters(groupParameters, columnsGroupParameters)) {
                            ///#DEBUG
                            that.__groupingUpdated = true;
                            ///#ENDDEBUG
                            updateSortGroupParameterIndexes(that._columns, groupParameters, 'groupIndex');
                            if(fromDataSource) {
                                updateColumnChanges(that, 'grouping');
                                isColumnsChanged = true;
                            }
                        }
                        if((fromDataSource || (!columnsSortParameters && !that._hasUserState)) && !gridCoreUtils.equalSortParameters(sortParameters, columnsSortParameters)) {
                            ///#DEBUG
                            that.__sortingUpdated = true;
                            ///#ENDDEBUG
                            updateSortGroupParameterIndexes(that._columns, sortParameters, 'sortIndex');
                            if(fromDataSource) {
                                updateColumnChanges(that, 'sorting');
                                isColumnsChanged = true;
                            }
                        }
                        if(isColumnsChanged) {
                            fireColumnsChanged(that);
                        }
                    }
                },

                updateFilter: function(filter, remoteFiltering, columnIndex, filterValue) {
                    const that = this;

                    if(!Array.isArray(filter)) return filter;


                    filter = extend([], filter);

                    columnIndex = filter.columnIndex !== undefined ? filter.columnIndex : columnIndex;
                    filterValue = filter.filterValue !== undefined ? filter.filterValue : filterValue;

                    if(isString(filter[0]) && filter[0] !== '!') {
                        const column = that.columnOption(filter[0]);

                        if(remoteFiltering) {
                            if(config().forceIsoDateParsing && column && column.serializeValue && filter.length > 1) {
                                filter[filter.length - 1] = column.serializeValue(filter[filter.length - 1], 'filter');
                            }
                        } else {
                            if(column && column.selector) {
                                filter[0] = column.selector;
                                filter[0].columnIndex = column.index;
                            }
                        }
                    } else if(isFunction(filter[0])) {
                        filter[0].columnIndex = columnIndex;
                        filter[0].filterValue = filterValue;
                    }

                    for(let i = 0; i < filter.length; i++) {
                        filter[i] = that.updateFilter(filter[i], remoteFiltering, columnIndex, filterValue);
                    }

                    return filter;
                },
                columnCount: function() {
                    return this._columns ? this._columns.length : 0;
                },
                columnOption: function(identifier, option, value, notFireEvent) {
                    const that = this;
                    const columns = that._columns.concat(that._commandColumns);
                    const column = findColumn(columns, identifier);

                    if(column) {
                        if(arguments.length === 1) {
                            return extend({}, column);
                        }
                        if(isString(option)) {
                            if(arguments.length === 2) {
                                return columnOptionCore(that, column, option);
                            } else {
                                columnOptionCore(that, column, option, value, notFireEvent);
                            }
                        } else if(isObject(option)) {
                            each(option, function(optionName, value) {
                                columnOptionCore(that, column, optionName, value, notFireEvent);
                            });
                        }

                        fireColumnsChanged(that);
                    }
                },
                clearSorting: function() {
                    const that = this;
                    const columnCount = this.columnCount();

                    that.beginUpdate();

                    for(let i = 0; i < columnCount; i++) {
                        that.columnOption(i, 'sortOrder', undefined);
                    }
                    that.endUpdate();
                },
                clearGrouping: function() {
                    const that = this;
                    const columnCount = this.columnCount();

                    that.beginUpdate();

                    for(let i = 0; i < columnCount; i++) {
                        that.columnOption(i, 'groupIndex', undefined);
                    }
                    that.endUpdate();
                },

                getVisibleIndex: function(index, rowIndex) {
                    const columns = this.getVisibleColumns(rowIndex);

                    for(let i = columns.length - 1; i >= 0; i--) {
                        if(columns[i].index === index) {
                            return i;
                        }
                    }
                    return -1;
                },

                getVisibleColumnIndex: function(id, rowIndex) {
                    const index = this.columnOption(id, 'index');

                    return this.getVisibleIndex(index, rowIndex);
                },

                addColumn: function(options) {
                    const that = this;
                    let column = createColumn(that, options);
                    const index = that._columns.length;

                    that._columns.push(column);

                    if(column.isBand) {
                        that._columns = createColumnsFromOptions(that, that._columns);
                        column = that._columns[index];
                    }

                    column.added = options;
                    updateIndexes(that, column);
                    that.updateColumns(that._dataSource);
                    that._checkColumns();
                },
                deleteColumn: function(id) {
                    const that = this;
                    const column = that.columnOption(id);

                    if(column && column.index >= 0) {
                        convertOwnerBandToColumnReference(that._columns);
                        that._columns.splice(column.index, 1);

                        if(column.isBand) {
                            const childIndexes = that.getChildrenByBandColumn(column.index).map((column) => column.index);
                            that._columns = that._columns.filter((column) => childIndexes.indexOf(column.index) < 0);
                        }

                        updateIndexes(that);
                        that.updateColumns(that._dataSource);
                    }
                },
                addCommandColumn: function(options) {
                    let commandColumn = this._commandColumns.filter((column) => column.command === options.command)[0];

                    if(!commandColumn) {
                        commandColumn = options;
                        this._commandColumns.push(commandColumn);
                    }
                },
                getUserState: function() {
                    const columns = this._columns;
                    const result = [];
                    let i;

                    function handleStateField(index, value) {
                        if(columns[i][value] !== undefined) {
                            result[i][value] = columns[i][value];
                        }
                    }

                    for(i = 0; i < columns.length; i++) {
                        result[i] = {};
                        each(USER_STATE_FIELD_NAMES, handleStateField);
                    }
                    return result;
                },
                setName: function(column) {
                    const dataField = column.dataField;

                    if(!isDefined(column.name) && isDefined(dataField)) {
                        column.name = dataField;
                    }
                },
                setUserState: function(state) {
                    const that = this;
                    const dataSource = that._dataSource;
                    let ignoreColumnOptionNames = that.option('stateStoring.ignoreColumnOptionNames');

                    state?.forEach(this.setName);

                    if(!ignoreColumnOptionNames) {
                        ignoreColumnOptionNames = [];
                        const commonColumnSettings = that.getCommonSettings();

                        if(!that.option('columnChooser.enabled')) ignoreColumnOptionNames.push('visible');
                        if(that.option('sorting.mode') === 'none') ignoreColumnOptionNames.push('sortIndex', 'sortOrder');
                        if(!commonColumnSettings.allowGrouping) ignoreColumnOptionNames.push('groupIndex');
                        if(!commonColumnSettings.allowFixing) ignoreColumnOptionNames.push('fixed', 'fixedPosition');
                        if(!commonColumnSettings.allowResizing) ignoreColumnOptionNames.push('width', 'visibleWidth');

                        const isFilterPanelHidden = !that.option('filterPanel.visible');
                        if(!that.option('filterRow.visible') && isFilterPanelHidden) ignoreColumnOptionNames.push('filterValue', 'selectedFilterOperation');
                        if(!that.option('headerFilter.visible') && isFilterPanelHidden) ignoreColumnOptionNames.push('filterValues', 'filterType');
                    }

                    that._columnsUserState = state;
                    that._ignoreColumnOptionNames = ignoreColumnOptionNames;
                    that._hasUserState = !!state;

                    updateColumnChanges(that, 'filtering');

                    that.init();

                    if(dataSource) {
                        dataSource.sort(that.getSortDataSourceParameters());
                        dataSource.group(that.getGroupDataSourceParameters());
                    }
                },
                _checkColumns: function() {
                    const usedNames = {};
                    let hasEditableColumnWithoutName = false;
                    const duplicatedNames = [];
                    this._columns.forEach(column => {
                        const name = column.name;
                        const isBand = column.columns?.length;
                        const isEditable = column.allowEditing && (column.dataField || column.setCellValue) && !isBand;
                        if(name) {
                            if(usedNames[name]) {
                                duplicatedNames.push(`"${name}"`);
                            }

                            usedNames[name] = true;
                        } else if(isEditable) {
                            hasEditableColumnWithoutName = true;
                        }
                    });

                    if(duplicatedNames.length) {
                        errors.log('E1059', duplicatedNames.join(', '));
                    }

                    if(hasEditableColumnWithoutName) {
                        errors.log('E1060');
                    }
                },
                _createCalculatedColumnOptions: function(columnOptions, bandColumn) {
                    let calculatedColumnOptions = {};
                    let dataField = columnOptions.dataField;

                    if(Array.isArray(columnOptions.columns) && columnOptions.columns.length || columnOptions.isBand) {
                        calculatedColumnOptions.isBand = true;
                        dataField = null;
                    }

                    if(dataField) {
                        if(isString(dataField)) {
                            const getter = compileGetter(dataField);
                            calculatedColumnOptions = {
                                caption: captionize(dataField),
                                calculateCellValue: function(data, skipDeserialization) {
                                    const value = getter(data);
                                    return this.deserializeValue && !skipDeserialization ? this.deserializeValue(value) : value;
                                },
                                setCellValue: defaultSetCellValue,
                                parseValue: function(text) {
                                    const column = this;
                                    let result;
                                    let parsedValue;

                                    if(column.dataType === 'number') {
                                        if(isString(text) && column.format) {
                                            parsedValue = numberLocalization.parse(text);

                                            if(isNumeric(parsedValue)) {
                                                result = parsedValue;
                                            }
                                        } else if(isDefined(text) && isNumeric(text)) {
                                            result = Number(text);
                                        }
                                    } else if(column.dataType === 'boolean') {
                                        if(text === column.trueText) {
                                            result = true;
                                        } else if(text === column.falseText) {
                                            result = false;
                                        }
                                    } else if(gridCoreUtils.isDateType(column.dataType)) {
                                        parsedValue = dateLocalization.parse(text, column.format);
                                        if(parsedValue) {
                                            result = parsedValue;
                                        }
                                    } else {
                                        result = text;
                                    }
                                    return result;
                                }
                            };
                        }

                        calculatedColumnOptions.allowFiltering = true;
                    } else {
                        calculatedColumnOptions.allowFiltering = !!columnOptions.calculateFilterExpression;
                    }
                    calculatedColumnOptions.calculateFilterExpression = function() {
                        return filterUtils.defaultCalculateFilterExpression.apply(this, arguments);
                    };

                    calculatedColumnOptions.createFilterExpression = function(filterValue) {
                        let result;
                        if(this.calculateFilterExpression) {
                            result = this.calculateFilterExpression.apply(this, arguments);
                        }
                        if(isFunction(result)) {
                            result = [result, '=', true];
                        }
                        if(result) {
                            result.columnIndex = this.index;
                            result.filterValue = filterValue;
                        }
                        return result;
                    };

                    if(!dataField || !isString(dataField)) {
                        extend(true, calculatedColumnOptions, {
                            allowSorting: false,
                            allowGrouping: false,
                            calculateCellValue: function() {
                                return null;
                            }
                        });
                    }

                    if(bandColumn) {
                        calculatedColumnOptions.allowFixing = false;
                    }
                    if(columnOptions.dataType) {
                        calculatedColumnOptions.userDataType = columnOptions.dataType;
                    }
                    if(columnOptions.selectedFilterOperation && !('defaultSelectedFilterOperation' in calculatedColumnOptions)) {
                        calculatedColumnOptions.defaultSelectedFilterOperation = columnOptions.selectedFilterOperation;
                    }
                    if(columnOptions.lookup) {
                        calculatedColumnOptions.lookup = {
                            calculateCellValue: function(value, skipDeserialization) {
                                if(this.valueExpr) {
                                    value = this.valueMap && this.valueMap[value];
                                }
                                return this.deserializeValue && !skipDeserialization ? this.deserializeValue(value) : value;
                            },
                            updateValueMap: function() {

                                this.valueMap = {};
                                if(this.items) {
                                    const calculateValue = compileGetter(this.valueExpr);
                                    const calculateDisplayValue = compileGetter(this.displayExpr);
                                    for(let i = 0; i < this.items.length; i++) {
                                        const item = this.items[i];
                                        const displayValue = calculateDisplayValue(item);
                                        this.valueMap[calculateValue(item)] = displayValue;
                                        this.dataType = this.dataType || getValueDataType(displayValue);
                                    }
                                }
                            },
                            update: function() {
                                const that = this;
                                let dataSource = that.dataSource;

                                if(dataSource) {
                                    if(isFunction(dataSource) && !variableWrapper.isWrapped(dataSource)) {
                                        dataSource = dataSource({});
                                    }
                                    if(isPlainObject(dataSource) || (dataSource instanceof Store) || Array.isArray(dataSource)) {
                                        if(that.valueExpr) {
                                            const dataSourceOptions = normalizeDataSourceOptions(dataSource);
                                            dataSourceOptions.paginate = false;
                                            dataSource = new DataSource(dataSourceOptions);
                                            return dataSource.load().done(function(data) {
                                                that.items = data;
                                                that.updateValueMap && that.updateValueMap();
                                            });
                                        }
                                    } else {
                                        errors.log('E1016');
                                    }
                                } else {
                                    that.updateValueMap && that.updateValueMap();
                                }
                            }
                        };
                    }

                    calculatedColumnOptions.resizedCallbacks = Callbacks();
                    if(columnOptions.resized) {
                        calculatedColumnOptions.resizedCallbacks.add(columnOptions.resized.bind(columnOptions));
                    }

                    each(calculatedColumnOptions, function(optionName) {
                        if(isFunction(calculatedColumnOptions[optionName]) && optionName.indexOf('default') !== 0) {
                            const defaultOptionName = 'default' + optionName.charAt(0).toUpperCase() + optionName.substr(1);
                            calculatedColumnOptions[defaultOptionName] = calculatedColumnOptions[optionName];
                        }
                    });

                    return calculatedColumnOptions;
                },
                getRowCount: function() {
                    this._rowCount = this._rowCount || getRowCount(this);

                    return this._rowCount;
                },
                getRowIndex: function(columnIndex, alwaysGetRowIndex) {
                    const column = this._columns[columnIndex];
                    const bandColumnsCache = this.getBandColumnsCache();

                    return column && (alwaysGetRowIndex || column.visible && !(column.command || isDefined(column.groupIndex))) ? getParentBandColumns(columnIndex, bandColumnsCache.columnParentByIndex).length : 0;
                },
                getChildrenByBandColumn: function(bandColumnIndex, onlyVisibleDirectChildren) {
                    const that = this;
                    const bandColumnsCache = that.getBandColumnsCache();
                    const result = getChildrenByBandColumn(bandColumnIndex, bandColumnsCache.columnChildrenByIndex, !onlyVisibleDirectChildren);

                    if(onlyVisibleDirectChildren) {
                        return result
                            .filter(function(column) { return column.visible && !column.command; })
                            .sort(function(column1, column2) {
                                return column1.visibleIndex - column2.visibleIndex;
                            });
                    }

                    return result;
                },
                isParentBandColumn: function(columnIndex, bandColumnIndex) {
                    let result = false;
                    const column = this._columns[columnIndex];
                    const bandColumnsCache = this.getBandColumnsCache();
                    const parentBandColumns = column && getParentBandColumns(columnIndex, bandColumnsCache.columnParentByIndex);

                    if(parentBandColumns) { // T416483 - fix for jquery 2.1.4
                        each(parentBandColumns, function(_, bandColumn) {
                            if(bandColumn.index === bandColumnIndex) {
                                result = true;
                                return false;
                            }
                        });
                    }

                    return result;
                },
                isParentColumnVisible: function(columnIndex) {
                    let result = true;
                    const bandColumnsCache = this.getBandColumnsCache();
                    const bandColumns = columnIndex >= 0 && getParentBandColumns(columnIndex, bandColumnsCache.columnParentByIndex);

                    bandColumns && each(bandColumns, function(_, bandColumn) {
                        result = result && bandColumn.visible;
                        return result;
                    });

                    return result;
                },
                getColumnId: function(column) {
                    if(column.command && column.type === GROUP_COMMAND_COLUMN_NAME) {
                        if(isCustomCommandColumn(this, column)) {
                            return 'type:' + column.type;
                        }

                        return 'command:' + column.command;
                    }

                    return column.index;
                },
                getCustomizeTextByDataType: getCustomizeTextByDataType,
                getHeaderContentAlignment: function(columnAlignment) {
                    const rtlEnabled = this.option('rtlEnabled');

                    if(rtlEnabled) {
                        return columnAlignment === 'left' ? 'right' : 'left';
                    }

                    return columnAlignment;
                }
            };
        })())
    }
};
