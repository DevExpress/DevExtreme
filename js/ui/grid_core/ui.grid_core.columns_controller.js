"use strict";

var $ = require("../../core/renderer"),
    Callbacks = require("../../core/utils/callbacks"),
    isWrapped = require("../../core/utils/variable_wrapper").isWrapped,
    dataCoreUtils = require("../../core/utils/data"),
    grep = require("../../core/utils/common").grep,
    typeUtils = require("../../core/utils/type"),
    iteratorUtils = require("../../core/utils/iterator"),
    getDefaultAlignment = require("../../core/utils/position").getDefaultAlignment,
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    config = require("../../core/config"),
    isDefined = typeUtils.isDefined,
    objectUtils = require("../../core/utils/object"),
    errors = require("../widget/ui.errors"),
    modules = require("./ui.grid_core.modules"),
    gridCoreUtils = require("./ui.grid_core.utils"),
    normalizeSortingInfo = gridCoreUtils.normalizeSortingInfo,
    equalSortParameters = gridCoreUtils.equalSortParameters,
    normalizeIndexes = require("../../core/utils/array").normalizeIndexes,
    inflector = require("../../core/utils/inflector"),
    dateSerialization = require("../../core/utils/date_serialization"),
    numberLocalization = require("../../localization/number"),
    dateLocalization = require("../../localization/date"),
    messageLocalization = require("../../localization/message"),
    deferredUtils = require("../../core/utils/deferred"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred,
    Store = require("../../data/abstract_store"),
    DataSourceModule = require("../../data/data_source/data_source"),
    normalizeDataSourceOptions = DataSourceModule.normalizeDataSourceOptions,
    filterUtils = require("../shared/filtering");

var USER_STATE_FIELD_NAMES_15_1 = ["filterValues", "filterType", "fixed", "fixedPosition"],
    USER_STATE_FIELD_NAMES = ["visibleIndex", "dataField", "name", "dataType", "width", "visible", "sortOrder", "lastSortOrder", "sortIndex", "groupIndex", "filterValue", "selectedFilterOperation", "added"].concat(USER_STATE_FIELD_NAMES_15_1),
    IGNORE_COLUMN_OPTION_NAMES = { visibleWidth: true, bestFitWidth: true, bufferedFilterValue: true },
    COMMAND_EXPAND_CLASS = "dx-command-expand";

var regExp = /columns\[(\d+)\]\.?/gi;

module.exports = {
    defaultOptions: function() {
        return {
            commonColumnSettings: {
                allowFiltering: true,
                allowHiding: true,
                allowSorting: true,
                allowEditing: true,
                encodeHtml: true,
                /**
                 * @name GridBaseColumn.trueText
                 * @type string
                 * @default "true"
                 */
                trueText: messageLocalization.format("dxDataGrid-trueText"),
                /**
                 * @name GridBaseColumn.falseText
                 * @type string
                 * @default "false"
                 */
                falseText: messageLocalization.format("dxDataGrid-falseText")
            },
            /**
             * @name GridBaseOptions.allowColumnReordering
             * @type boolean
             * @default false
             */
            allowColumnReordering: false,
            /**
             * @name GridBaseOptions.allowColumnResizing
             * @type boolean
             * @default false
             */
            allowColumnResizing: false,
            /**
             * @name GridBaseOptions.columnResizingMode
             * @type Enums.ColumnResizingMode
             * @default "nextColumn"
             */
            columnResizingMode: "nextColumn",
            /**
             * @name GridBaseOptions.columnMinWidth
             * @type number
             * @default undefined
             */
            columnMinWidth: undefined,
            /**
             * @name GridBaseOptions.columnWidth
             * @type number
             * @default undefined
             */
            columnWidth: undefined,
            adaptColumnWidthByRatio: true,
            /**
             * @name GridBaseOptions.columns
             * @type Array<GridBaseColumn>
             * @fires GridBaseOptions.onOptionChanged
             * @default undefined
             */
            /**
             * @name dxDataGridOptions.columns
             * @type Array<dxDataGridColumn>
             * @default undefined
             */
            /**
             * @name dxTreeListOptions.columns
             * @type Array<dxTreeListColumn>
             * @default undefined
             */

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
             * @name GridBaseColumn.visible
             * @type boolean
             * @default true
             * @fires GridBase.onOptionChanged
             */
            /**
             * @name GridBaseColumn.hidingPriority
             * @type number
             * @default undefined
             */
            /**
             * @name GridBaseColumn.fixed
             * @type boolean
             * @default false
             */
            /**
             * @name dxDataGridColumn.columns
             * @type Array<dxDataGridColumn>
             * @default undefined
             */
            /**
             * @name dxTreeListColumn.columns
             * @type Array<dxTreeListColumn>
             * @default undefined
             */
            /**
             * @name GridBaseColumn.ownerBand
             * @type number
             * @default undefined
             */
            /**
             * @name GridBaseColumn.isBand
             * @type boolean
             * @default undefined
             */
            /**
             * @name GridBaseColumn.fixedPosition
             * @type Enums.HorizontalEdge
             * @default undefined
             */
            /**
             * @name GridBaseColumn.visibleIndex
             * @type number
             * @default undefined
             * @fires GridBase.onOptionChanged
             */
            /**
             * @name GridBaseColumn.showInColumnChooser
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseColumn.dataField
             * @type string
             * @default undefined
             */
            /**
             * @name GridBaseColumn.dataType
             * @type Enums.GridColumnDataType
             * @default undefined
             */
            /**
             * @name GridBaseColumn.validationRules
             * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule>
             */
            /**
             * @name GridBaseColumn.calculateCellValue
             * @type function(rowData)
             * @type_function_param1 rowData:object
             * @type_function_return any
             */
            /**
             * @name GridBaseColumn.setCellValue
             * @type function(newData, value, currentRowData)
             * @type_function_param1 newData:object
             * @type_function_param2 value:any
             * @type_function_param3 currentRowData:object
             */
            /**
             * @name GridBaseColumn.calculateDisplayValue
             * @type string|function(rowData)
             * @type_function_param1 rowData:object
             * @type_function_return any
             */
            /**
             * @name dxDataGridColumn.calculateGroupValue
             * @type string|function(rowData)
             * @type_function_param1 rowData:object
             * @type_function_return any
             */
            /**
             * @name GridBaseColumn.calculateSortValue
             * @type string|function(rowData)
             * @type_function_param1 rowData:object
             * @type_function_return any
             */
            /**
             * @name GridBaseColumn.sortingMethod
             * @type function(value1, value2)
             * @type_function_param1 value1:any
             * @type_function_param2 value2:any
             * @type_function_return number
             * @default undefined
             */
            /**
             * @name dxDataGridColumn.showWhenGrouped
             * @type boolean
             * @default false
             */
            /**
             * @name GridBaseColumn.calculateFilterExpression
             * @type function(filterValue, selectedFilterOperation, target)
             * @type_function_param1 filterValue:any
             * @type_function_param2 selectedFilterOperation:string
             * @type_function_param3 target:string
             * @type_function_return Filter expression
             */
            /**
             * @name GridBaseColumn.name
             * @type string
             * @default undefined
             */
            /**
             * @name GridBaseColumn.caption
             * @type string
             * @default undefined
             */
            /**
             * @name GridBaseColumn.width
             * @type number|string
             * @default undefined
             */
            /**
             * @name GridBaseColumn.minWidth
             * @type number
             * @default undefined
             */
            /**
             * @name GridBaseColumn.cssClass
             * @type string
             * @default undefined
             */
            /**
             * @name GridBaseColumn.sortOrder
             * @type Enums.SortOrder
             * @default undefined
             * @acceptValues undefined
             * @fires GridBase.onOptionChanged
             */
            /**
             * @name GridBaseColumn.sortIndex
             * @type number
             * @default undefined
             * @fires GridBase.onOptionChanged
             */
            /**
             * @name GridBaseColumn.showEditorAlways
             * @type boolean
             * @default false
             */
            /**
             * @name GridBaseColumn.alignment
             * @type Enums.HorizontalAlignment
             * @default undefined
             * @acceptValues undefined
             */
            /**
             * @name GridBaseColumn.format
             * @type format
             * @default ""
             */
            /**
             * @name GridBaseColumn.customizeText
             * @type function(cellInfo)
             * @type_function_param1 cellInfo:object
             * @type_function_param1_field1 value:string|number|date
             * @type_function_param1_field2 valueText:string
             * @type_function_param1_field3 target:string
             * @type_function_param1_field4 groupInterval:string|number
             * @type_function_return string
             */
            /**
             * @name dxDataGridColumn.precision
             * @type number
             * @default undefined
             * @deprecated
             */
            /**
             * @name GridBaseColumn.filterOperations
             * @type Array<string>
             * @acceptValues "=" | "<>" | "<" | "<=" | ">" | ">=" | "notcontains" | "contains" | "startswith" | "endswith" | "between"
             * @default undefined
             */
            /**
             * @name GridBaseColumn.selectedFilterOperation
             * @type Enums.FilterOperations
             * @default undefined
             * @fires GridBase.onOptionChanged
             */
            /**
             * @name GridBaseColumn.filterValue
             * @type any
             * @default undefined
             * @fires GridBase.onOptionChanged
             */
            /**
             * @name GridBaseColumn.filterValues
             * @type Array<any>
             * @default undefined
             * @fires GridBase.onOptionChanged
            */
            /**
             * @name GridBaseColumn.filterType
             * @type Enums.FilterType
             * @default "include"
            */
            /**
             * @name GridBaseColumn.cellTemplate
             * @type template|function
             * @type_function_param1 cellElement:dxElement
             * @type_function_param2 cellInfo:object
             */
            /**
             * @name GridBaseColumn.headerCellTemplate
             * @type template|function
             * @type_function_param1 columnHeader:dxElement
             * @type_function_param2 headerInfo:object
             */
            /**
             * @name GridBaseColumn.editCellTemplate
             * @type template|function
             * @type_function_param1 cellElement:dxElement
             * @type_function_param2 cellInfo:object
             */
            /**
             * @name dxDataGridColumn.groupCellTemplate
             * @type template|function
             * @type_function_param1 cellElement:dxElement
             * @type_function_param2 cellInfo:object
             */
            /**
             * @name dxDataGridColumn.groupIndex
             * @type number
             * @default undefined
             * @fires dxDataGrid.onOptionChanged
             */
            /**
             * @name dxDataGridColumn.grouped
             * @type boolean
             * @hidden
             * @default false
             */
            /**
             * @name GridBaseColumn.allowHiding
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseColumn.allowReordering
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseColumn.allowResizing
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseColumn.allowFiltering
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseColumn.allowHeaderFiltering
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseColumn.allowSearch
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseColumn.allowEditing
             * @type boolean
             * @default true
             */
            /**
             * @name dxDataGridColumn.allowGrouping
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseColumn.allowFixing
             * @type boolean
             * @default true
             */
            /**
             * @name dxDataGridColumn.autoExpandGroup
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseColumn.allowSorting
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseColumn.encodeHtml
             * @type boolean
             * @default true
             */
            /**
             * @name dxDataGridColumn.resized
             * @type function
             * @hidden
             * @default undefined
             */
            /**
             * @name GridBaseColumn.lookup
             * @type object
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
             * @type_function_param1 data:object
             * @default undefined
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
             * @name GridBaseColumn.headerFilter
             * @type object
             * @default undefined
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
             * @name GridBaseColumn.editorOptions
             * @type object
             */
            /**
             * @name GridBaseColumn.formItem
             * @type dxFormSimpleItem
             */
            regenerateColumnsByVisibleItems: false,
            /**
             * @name dxDataGridOptions.customizeColumns
             * @type function(columns)
             * @type_function_param1 columns:Array<dxDataGridColumn>
             */
            /**
             * @name dxTreeListOptions.customizeColumns
             * @type function(columns)
             * @type_function_param1 columns:Array<dxTreeListColumn>
             */
            customizeColumns: null,
            /**
             * @name GridBaseOptions.dateSerializationFormat
             * @type string
             */
            dateSerializationFormat: undefined
        };
    },
    controllers: {
        columns: modules.Controller.inherit((function() {
            var DEFAULT_COLUMN_OPTIONS = {
                    visible: true,
                    showInColumnChooser: true
                },
                DATATYPE_OPERATIONS = {
                    "number": ["=", "<>", "<", ">", "<=", ">=", "between"],
                    "string": ["contains", "notcontains", "startswith", "endswith", "=", "<>"],
                    "date": ["=", "<>", "<", ">", "<=", ">=", "between"],
                    "datetime": ["=", "<>", "<", ">", "<=", ">=", "between"]
                },
                COLUMN_INDEX_OPTIONS = {
                    visibleIndex: true,
                    groupIndex: true,
                    grouped: true,
                    sortIndex: true,
                    sortOrder: true
                },
                GROUP_LOCATION = "group",
                COLUMN_CHOOSER_LOCATION = "columnChooser";

            var createColumn = function(that, columnOptions, userStateColumnOptions, bandColumn) {
                var commonColumnOptions = {},
                    calculatedColumnOptions,
                    isDefaultCommandColumn;

                if(columnOptions) {
                    if(typeUtils.isString(columnOptions)) {
                        columnOptions = {
                            dataField: columnOptions
                        };
                    }

                    if(columnOptions.command) {
                        isDefaultCommandColumn = that._commandColumns.some((column) => column.command === columnOptions.command);

                        if(!isDefaultCommandColumn) {
                            commonColumnOptions.visible = true;
                        }

                        return extend(true, commonColumnOptions, columnOptions);
                    } else {
                        commonColumnOptions = that.getCommonSettings();
                        if(userStateColumnOptions && userStateColumnOptions.name && userStateColumnOptions.dataField) {
                            columnOptions = extend({}, columnOptions, { dataField: userStateColumnOptions.dataField });
                        }
                        calculatedColumnOptions = that._createCalculatedColumnOptions(columnOptions, bandColumn);

                        return extend(true, {}, DEFAULT_COLUMN_OPTIONS, commonColumnOptions, calculatedColumnOptions, columnOptions, { selector: null });
                    }
                }
            };

            var createColumnsFromOptions = function(that, columnsOptions, bandColumn) {
                var result = [];

                if(columnsOptions) {
                    iteratorUtils.each(columnsOptions, function(index, columnOptions) {
                        var userStateColumnOptions = that._columnsUserState && checkUserStateColumn(columnOptions, that._columnsUserState[index]) && that._columnsUserState[index],
                            column = createColumn(that, columnOptions, userStateColumnOptions, bandColumn);

                        if(column) {
                            if(bandColumn) {
                                column.ownerBand = bandColumn;
                            }
                            result.push(column);

                            if(column.isBand) {
                                result = result.concat(createColumnsFromOptions(that, column.columns, column));
                                delete column.columns;
                            }
                        }
                    });
                }

                return result;
            };

            var getParentBandColumns = function(columnIndex, columnParentByIndex) {
                var result = [],
                    parent = columnParentByIndex[columnIndex];

                while(parent) {
                    result.unshift(parent);
                    columnIndex = parent.index;
                    parent = columnParentByIndex[columnIndex];
                }

                return result;
            };

            var getChildrenByBandColumn = function(columnIndex, columnChildrenByIndex, recursive) {
                var column,
                    result = [],
                    children = columnChildrenByIndex[columnIndex];

                if(children) {
                    for(var i = 0; i < children.length; i++) {
                        column = children[i];
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

            var getColumnByIndexes = function(that, columnIndexes) {
                var result,
                    callbackFilter = function(column) {
                        var ownerBand = result ? result.index : undefined;
                        return column.ownerBand === ownerBand;
                    },
                    columns = that._columns.filter(callbackFilter);

                for(var i = 0; i < columnIndexes.length; i++) {
                    result = columns[columnIndexes[i]];

                    if(result) {
                        columns = that._columns.filter(callbackFilter);
                    }
                }

                return result;
            };

            var getColumnFullPath = function(that, column) {
                var result = [],
                    bandColumnsCache = that.getBandColumnsCache(),
                    callbackFilter = function(item) {
                        return item.ownerBand === column.ownerBand;
                    },
                    columns = that._columns.filter(callbackFilter);

                while(columns.length && columns.indexOf(column) !== -1) {
                    result.unshift("columns[" + columns.indexOf(column) + "]");

                    column = bandColumnsCache.columnParentByIndex[column.index];
                    columns = column ? that._columns.filter(callbackFilter) : [];
                }

                return result.join(".");
            };

            var calculateColspan = function(that, columnID) {
                var colspan = 0,
                    columns = that.getChildrenByBandColumn(columnID, true);

                iteratorUtils.each(columns, function(_, column) {
                    if(column.isBand) {
                        column.colspan = column.colspan || calculateColspan(that, column.index);
                        colspan += column.colspan;
                    } else {
                        colspan += 1;
                    }
                });

                return colspan;
            };

            var processBandColumns = function(that, columns, bandColumnsCache) {
                var i,
                    column,
                    rowspan,
                    rowCount = that.getRowCount();

                for(i = 0; i < columns.length; i++) {
                    column = columns[i];

                    if(column.visible || column.command) {
                        if(column.isBand) {
                            column.colspan = column.colspan || calculateColspan(that, column.index);
                        }
                        if(!column.isBand || !column.colspan) {
                            rowspan = rowCount - (!column.command && !isDefined(column.groupIndex) ? getParentBandColumns(column.index, bandColumnsCache.columnParentByIndex).length : 0);
                            if(rowspan > 1) {
                                column.rowspan = rowspan;
                            }
                        }
                    }
                }
            };

            var getValueDataType = function(value) {
                var dataType = typeUtils.type(value);
                if(dataType !== "string" && dataType !== "boolean" && dataType !== "number" && dataType !== "date" && dataType !== "object") {
                    dataType = undefined;
                }
                return dataType;
            };

            var getSerializationFormat = function(dataType, value) {
                switch(dataType) {
                    case "date":
                    case "datetime":
                        return dateSerialization.getDateSerializationFormat(value);
                    case "number":
                        if(typeUtils.isString(value)) {
                            return "string";
                        }

                        if(typeUtils.isNumeric(value)) {
                            return null;
                        }
                }
            };

            var updateSerializers = function(options, dataType) {
                if(!options.deserializeValue) {
                    if(gridCoreUtils.isDateType(dataType)) {
                        options.deserializeValue = function(value) {
                            return dateSerialization.deserializeDate(value);
                        };
                        options.serializeValue = function(value) {
                            return typeUtils.isString(value) ? value : dateSerialization.serializeDate(value, this.serializationFormat);
                        };
                    }
                    if(dataType === "number") {
                        options.deserializeValue = function(value) {
                            var parsedValue = parseFloat(value);
                            return isNaN(parsedValue) ? value : parsedValue;
                        };
                        options.serializeValue = function(value, target) {
                            if(target === "filter") return value;
                            return isDefined(value) && this.serializationFormat === "string" ? value.toString() : value;
                        };
                    }
                }
            };

            var getAlignmentByDataType = function(dataType, isRTL) {
                switch(dataType) {
                    case "number":
                        return "right";
                    case "boolean":
                        return "center";
                    default:
                        return getDefaultAlignment(isRTL);
                }
            };

            var getCustomizeTextByDataType = function(dataType) {
                if(dataType === "boolean") {
                    return function(e) {
                        if(e.value === true) {
                            return this.trueText || "true";
                        } else if(e.value === false) {
                            return this.falseText || "false";
                        } else {
                            return e.valueText || "";
                        }
                    };
                }
            };

            var createColumnsFromDataSource = function(that, dataSource) {
                var firstItems = that._getFirstItems(dataSource),
                    fieldName,
                    processedFields = {},
                    i,
                    result = [];

                for(i = 0; i < firstItems.length; i++) {
                    if(firstItems[i]) {
                        for(fieldName in firstItems[i]) {
                            if(!typeUtils.isFunction(firstItems[i][fieldName]) || isWrapped(firstItems[i][fieldName])) {
                                processedFields[fieldName] = true;
                            }
                        }
                    }
                }

                for(fieldName in processedFields) {
                    if(fieldName.indexOf("__") !== 0) {
                        var column = createColumn(that, fieldName);
                        result.push(column);
                    }
                }
                return result;
            };

            var updateColumnIndexes = function(that) {
                iteratorUtils.each(that._columns, function(index, column) {
                    column.index = index;
                });

                iteratorUtils.each(that._columns, function(index, column) {
                    if(typeUtils.isObject(column.ownerBand)) {
                        column.ownerBand = column.ownerBand.index;
                    }
                });

                iteratorUtils.each(that._commandColumns, function(index, column) {
                    column.index = -(index + 1);
                });
            };

            var updateColumnGroupIndexes = function(that, currentColumn) {
                normalizeIndexes(that._columns, "groupIndex", currentColumn, function(column) {
                    var grouped = column.grouped;
                    delete column.grouped;
                    return grouped;
                });
            };

            var updateColumnSortIndexes = function(that, currentColumn) {
                iteratorUtils.each(that._columns, function(index, column) {
                    if(isDefined(column.sortIndex) && !isSortOrderValid(column.sortOrder)) {
                        delete column.sortIndex;
                    }
                });

                normalizeIndexes(that._columns, "sortIndex", currentColumn, function(column) {
                    return !isDefined(column.groupIndex) && isSortOrderValid(column.sortOrder);
                });
            };

            var updateColumnVisibleIndexes = function(that, currentColumn) {
                var i,
                    key,
                    column,
                    bandColumnIndex,
                    parentBandColumns,
                    bandColumns = {},
                    result = [],
                    bandColumnsCache = that.getBandColumnsCache(),
                    columns = that._columns.filter((column) => !column.command);

                for(i = 0; i < columns.length; i++) {
                    column = columns[i];
                    parentBandColumns = getParentBandColumns(i, bandColumnsCache.columnParentByIndex);

                    if(parentBandColumns.length) {
                        bandColumnIndex = parentBandColumns[parentBandColumns.length - 1].index;
                        bandColumns[bandColumnIndex] = bandColumns[bandColumnIndex] || [];
                        bandColumns[bandColumnIndex].push(column);
                    } else {
                        result.push(column);
                    }
                }

                for(key in bandColumns) {
                    normalizeIndexes(bandColumns[key], "visibleIndex", currentColumn);
                }

                normalizeIndexes(result, "visibleIndex", currentColumn);
            };

            var getColumnIndexByVisibleIndex = function(that, visibleIndex, location) {
                var rowIndex = typeUtils.isObject(visibleIndex) ? visibleIndex.rowIndex : null,
                    columns = location === GROUP_LOCATION ? that.getGroupColumns() : location === COLUMN_CHOOSER_LOCATION ? that.getChooserColumns() : that.getVisibleColumns(rowIndex),
                    column;

                visibleIndex = typeUtils.isObject(visibleIndex) ? visibleIndex.columnIndex : visibleIndex;
                column = columns[visibleIndex];

                return column && isDefined(column.index) ? column.index : -1;
            };

            var moveColumnToGroup = function(that, column, groupIndex) {
                var groupColumns = that.getGroupColumns(),
                    i;

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

            var checkUserStateColumn = function(column, userStateColumn) {
                return column && userStateColumn && userStateColumn.name === column.name && (userStateColumn.dataField === column.dataField || column.name);
            };

            var applyUserState = function(that) {
                var columnsUserState = that._columnsUserState,
                    ignoreColumnOptionNames = that._ignoreColumnOptionNames || [],
                    columns = that._columns,
                    columnCountById = {},
                    resultColumns = [],
                    allColumnsHaveState = true,
                    userStateColumnIndexes = [],
                    column,
                    columnUserState,
                    userStateColumnIndex,
                    i;

                function applyFieldsState(column, userStateColumn) {
                    var fieldName;

                    if(!userStateColumn) return;

                    for(var index = 0; index < USER_STATE_FIELD_NAMES.length; index++) {
                        fieldName = USER_STATE_FIELD_NAMES[index];

                        if(inArray(fieldName, ignoreColumnOptionNames) >= 0) continue;

                        if(fieldName === "dataType") {
                            column[fieldName] = column[fieldName] || userStateColumn[fieldName];
                        } else if(inArray(fieldName, USER_STATE_FIELD_NAMES_15_1) >= 0) {
                            if(fieldName in userStateColumn) {
                                column[fieldName] = userStateColumn[fieldName];
                            }
                        } else {
                            column[fieldName] = userStateColumn[fieldName];
                        }
                    }
                }

                function findUserStateColumn(columnsUserState, column) {
                    var id = column.name || column.dataField,
                        count = columnCountById[id] || 0;

                    for(var j = 0; j < columnsUserState.length; j++) {
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

                    for(i = 0; i < columnsUserState.length; i++) {
                        columnUserState = columnsUserState[i];
                        if(columnUserState.added && findUserStateColumn(columns, columnUserState) < 0) {
                            column = createColumn(that, columnUserState.added);
                            applyFieldsState(column, columnUserState);
                            resultColumns.push(column);
                            if(columnUserState.added.columns) {
                                resultColumns = createColumnsFromOptions(that, resultColumns);
                            }
                        }
                    }

                    assignColumns(that, resultColumns);
                }
            };

            var updateIndexes = function(that, column) {
                updateColumnIndexes(that);
                updateColumnGroupIndexes(that, column);
                updateColumnSortIndexes(that, column);
                updateColumnVisibleIndexes(that, column);
            };

            var resetColumnsCache = function(that) {
                that.resetColumnsCache();
            };

            var assignColumns = function(that, columns) {
                that._columns = columns;
                resetColumnsCache(that);
                that.updateColumnDataTypes();
            };

            var updateColumnChanges = function(that, changeType, optionName, columnIndex) {
                var columnChanges = that._columnChanges || {
                    optionNames: { length: 0 },
                    changeTypes: { length: 0 },
                    columnIndex: columnIndex
                };

                optionName = optionName || "all";

                optionName = optionName.split(".")[0];

                var changeTypes = columnChanges.changeTypes;

                if(changeType && !changeTypes[changeType]) {
                    changeTypes[changeType] = true;
                    changeTypes.length++;
                }

                var optionNames = columnChanges.optionNames;

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

            var fireColumnsChanged = function(that) {
                var onColumnsChanging = that.option("onColumnsChanging"),
                    columnChanges = that._columnChanges;

                if(that.isInitialized() && !that._updateLockCount && columnChanges) {
                    if(onColumnsChanging) {
                        that._updateLockCount++;
                        onColumnsChanging(extend({ component: that.component }, columnChanges));
                        that._updateLockCount--;
                    }
                    that._columnChanges = undefined;
                    if(columnChanges.optionNames && (columnChanges.optionNames.dataField || columnChanges.optionNames.lookup)) {
                        that.reinit();
                    } else {
                        that.columnsChanged.fire(columnChanges);
                    }
                }
            };

            var updateSortOrderWhenGrouping = function(column, groupIndex, prevGroupIndex) {
                var columnWasGrouped = prevGroupIndex >= 0;

                if(groupIndex >= 0) {
                    if(!columnWasGrouped) {
                        column.lastSortOrder = column.sortOrder;
                    }
                } else {
                    column.sortOrder = column.lastSortOrder;
                }
            };

            var fireOptionChanged = function(that, options) {
                var value = options.value,
                    optionName = options.optionName,
                    prevValue = options.prevValue,
                    fullOptionName = options.fullOptionName;

                if(!IGNORE_COLUMN_OPTION_NAMES[optionName]) {
                    that._skipProcessingColumnsChange = true;
                    that.component._notifyOptionChanged(fullOptionName + "." + optionName, value, prevValue);
                    that._skipProcessingColumnsChange = false;
                }
            };

            var columnOptionCore = function(that, column, optionName, value, notFireEvent) {
                var optionGetter = dataCoreUtils.compileGetter(optionName),
                    columnIndex = column.index,
                    prevValue,
                    optionSetter,
                    columns,
                    changeType,
                    fullOptionName;

                if(arguments.length === 3) {
                    return optionGetter(column, { functionsAsIs: true });
                }
                prevValue = optionGetter(column, { functionsAsIs: true });
                if(prevValue !== value) {
                    if(optionName === "groupIndex") {
                        changeType = "grouping";
                        updateSortOrderWhenGrouping(column, value, prevValue);
                    } else if(optionName === "sortIndex" || optionName === "sortOrder") {
                        changeType = "sorting";
                    } else {
                        changeType = "columns";
                    }

                    optionSetter = dataCoreUtils.compileSetter(optionName);
                    optionSetter(column, value, { functionsAsIs: true });
                    fullOptionName = getColumnFullPath(that, column);
                    fullOptionName && fireOptionChanged(that, {
                        fullOptionName: fullOptionName,
                        optionName: optionName,
                        value: value,
                        prevValue: prevValue
                    });

                    if(!isDefined(prevValue) && !isDefined(value) && optionName.indexOf("buffer") !== 0) {
                        notFireEvent = true;
                    }

                    if(!notFireEvent) {
                        // T346972
                        if(inArray(optionName, USER_STATE_FIELD_NAMES) < 0 && optionName !== "visibleWidth") {
                            columns = that.option("columns");
                            column = that.getColumnByPath(fullOptionName, columns);
                            if(typeUtils.isString(column)) {
                                column = columns[columnIndex] = { dataField: column };
                            }
                            if(column) {
                                optionSetter(column, value, { functionsAsIs: true });
                            }
                        }
                        updateColumnChanges(that, changeType, optionName, columnIndex);
                    } else {
                        resetColumnsCache(that);
                    }
                }
            };

            var isSortOrderValid = function(sortOrder) {
                return sortOrder === "asc" || sortOrder === "desc";
            };

            var addExpandColumn = function(that) {
                var options = that._getExpandColumnOptions();

                that.addCommandColumn(options);
            };

            var defaultSetCellValue = function(data, value) {
                var path = this.dataField.split("."),
                    dotCount = path.length - 1,
                    name,
                    i;

                if(this.serializeValue) {
                    value = this.serializeValue(value);
                }

                for(i = 0; i < dotCount; i++) {
                    name = path[i];
                    data = data[name] = data[name] || {};
                }
                data[path[dotCount]] = value;
            };

            var getDataColumns = function(columns, rowIndex, bandColumnID) {
                var result = [];

                rowIndex = rowIndex || 0;
                columns[rowIndex] && iteratorUtils.each(columns[rowIndex], function(_, column) {
                    if(column.ownerBand === bandColumnID || isDefined(column.groupIndex)) {
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

            var getRowCount = function(that, level, bandColumnIndex) {
                var rowCount = 1,
                    bandColumnsCache = that.getBandColumnsCache(),
                    columnParentByIndex = bandColumnsCache.columnParentByIndex;

                that._columns.forEach(function(column) {
                    var parents = getParentBandColumns(column.index, columnParentByIndex),
                        invisibleParents = parents.filter(function(column) { return !column.visible; });

                    if(column.visible && !invisibleParents.length) {
                        rowCount = Math.max(rowCount, parents.length + 1);
                    }
                });

                return rowCount;
            };

            var getFixedPosition = function(column) {
                return !column.fixedPosition ? "left" : column.fixedPosition;
            };

            var processExpandColumns = function(columns, expandColumns, columnIndex) {
                var rowspan = columns[columnIndex] && columns[columnIndex].rowspan,
                    expandColumnsByRow = expandColumns.slice(0);

                if(rowspan > 1) {
                    expandColumnsByRow = iteratorUtils.map(expandColumnsByRow, function(expandColumn) { return extend({}, expandColumn, { rowspan: rowspan }); });
                }
                expandColumnsByRow.unshift(columnIndex, 0);
                columns.splice.apply(columns, expandColumnsByRow);

                return rowspan || 1;
            };

            var digitsCount = function(number) {
                var i;

                for(i = 0; number > 1; i++) {
                    number /= 10;
                }

                return i;
            };

            var numberToString = function(number, digitsCount) {
                var str = number ? number.toString() : "0";

                while(str.length < digitsCount) {
                    str = "0" + str;
                }

                return str;
            };

            var mergeColumns = (columns, commandColumns, needToExtend) => {
                var i,
                    column,
                    commandColumnIndex,
                    result = columns.length ? (needToExtend && commandColumns || columns).slice() : [],
                    getCommandColumnIndex = (column) => commandColumns.reduce((result, commandColumn, index) => {
                        return commandColumn.command === column.command ? index : result;
                    }, -1);

                if(result.length) {
                    for(i = 0; i < columns.length; i++) {
                        column = columns[i];

                        commandColumnIndex = column && column.command ? getCommandColumnIndex(column) : -1;
                        if(commandColumnIndex >= 0) {
                            if(needToExtend) {
                                result[commandColumnIndex] = extend({}, result[commandColumnIndex], column);
                            } else {
                                result[i] = extend({}, result[i], commandColumns[commandColumnIndex]);
                            }
                        } else if(column && needToExtend) {
                            result.push(extend({}, column));
                        }
                    }
                }

                return result;
            };

            return {
                _getExpandColumnOptions: function() {
                    return {
                        command: "expand",
                        width: "auto",
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
                    var groupsCount,
                        items = [];

                    var getFirstItemsCore = function(items, groupsCount) {
                        var i,
                            childItems;

                        if(!items || !groupsCount) {
                            return items;
                        }
                        for(i = 0; i < items.length; i++) {
                            childItems = getFirstItemsCore(items[i].items || items[i].collapsedItems, groupsCount - 1);
                            if(childItems && childItems.length) {
                                return childItems;
                            }
                        }
                    };

                    if(dataSource && dataSource.items().length > 0) {
                        groupsCount = normalizeSortingInfo(dataSource.group()).length;
                        items = getFirstItemsCore(dataSource.items(), groupsCount) || [];
                    }
                    return items;
                },
                _endUpdateCore: function() {
                    fireColumnsChanged(this);
                },
                init: function() {
                    var that = this,
                        columns = that.option("columns");

                    that._commandColumns = that._commandColumns || [];

                    that._columns = that._columns || [];

                    addExpandColumn(that);

                    that._isColumnsFromOptions = !!columns;

                    if(that._isColumnsFromOptions) {
                        assignColumns(that, columns ? createColumnsFromOptions(that, columns) : []);
                        applyUserState(that);
                    } else {
                        assignColumns(that, that._columnsUserState ? createColumnsFromOptions(that, that._columnsUserState) : that._columns);
                    }

                    if(that._dataSourceApplied) {
                        that.applyDataSource(that._dataSource, true);
                    } else {
                        updateIndexes(that);
                    }
                },
                callbackNames: function() {
                    return ["columnsChanged"];
                },

                getColumnByPath: function(path, columns) {
                    var that = this,
                        column,
                        columnIndexes = [];

                    path.replace(regExp, function(_, columnIndex) {
                        columnIndexes.push(parseInt(columnIndex));
                        return "";
                    });

                    if(columnIndexes.length) {
                        if(columns) {
                            column = columnIndexes.reduce(function(prevColumn, index) {
                                return prevColumn ? prevColumn.columns[index] : columns[index];
                            }, 0);
                        } else {
                            column = getColumnByIndexes(that, columnIndexes);
                        }
                    }

                    return column;
                },

                optionChanged: function(args) {
                    switch(args.name) {
                        case "adaptColumnWidthByRatio":
                            args.handled = true;
                            break;
                        case "columns":
                            args.handled = true;
                            if(!this._skipProcessingColumnsChange) {
                                if(args.name === args.fullName) {
                                    this._columnsUserState = null;
                                    this._ignoreColumnOptionNames = null;
                                    this.init();
                                } else {
                                    this._columnOptionChanged(args);
                                }
                            }
                            break;
                        case "commonColumnSettings":
                        case "columnAutoWidth":
                        case "allowColumnResizing":
                        case "allowColumnReordering":
                        case "columnFixing":
                        case "grouping":
                        case "groupPanel":
                        case "regenerateColumnsByVisibleItems":
                        case "customizeColumns":
                        case "editing":
                        case "columnHidingEnabled":
                        case "dateSerializationFormat":
                        case "columnResizingMode":
                        case "columnMinWidth":
                        case "columnWidth":
                            args.handled = true;
                            this.reinit();
                            break;
                        case "rtlEnabled":
                            this.reinit();
                            break;
                        default:
                            this.callBase(args);
                    }
                },

                _columnOptionChanged: function(args) {
                    var columnOptionValue = {},
                        column = this.getColumnByPath(args.fullName),
                        columnOptionName = args.fullName.replace(regExp, "");

                    if(column) {
                        if(columnOptionName) {
                            columnOptionValue[columnOptionName] = args.value;
                        } else {
                            columnOptionValue = args.value;
                        }

                        this.columnOption(column.index, columnOptionValue);
                        if(columnOptionName === "width") {
                            this.component._requireResize = true;
                        }
                    }
                },

                publicMethods: function() {
                    return ["addColumn", "deleteColumn", "columnOption", "columnCount", "clearSorting", "clearGrouping", "getVisibleColumns"];
                },
                applyDataSource: function(dataSource, forceApplying) {
                    var that = this,
                        isDataSourceLoaded = dataSource && dataSource.isLoaded();

                    that._dataSource = dataSource;

                    if(!that._dataSourceApplied || that._dataSourceColumnsCount === 0 || forceApplying || that.option("regenerateColumnsByVisibleItems")) {
                        if(isDataSourceLoaded) {
                            if(!that._isColumnsFromOptions) {
                                var columnsFromDataSource = createColumnsFromDataSource(that, dataSource);
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
                        updateColumnChanges(that, "columns");
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
                    var that = this;
                    that._visibleColumns = undefined;
                    that._fixedColumns = undefined;
                    that._rowCount = undefined;
                    that._bandColumnsCache = undefined;
                },
                reinit: function() {
                    this._columnsUserState = this.getUserState();
                    this._ignoreColumnOptionNames = null;
                    this.init();
                },
                isInitialized: function() {
                    return !!this._columns.length || !!this.option("columns");
                },
                isDataSourceApplied: function() {
                    return this._dataSourceApplied;
                },
                getCommonSettings: function() {
                    var commonColumnSettings = this.option("commonColumnSettings") || {},
                        groupingOptions = this.option("grouping") || {},
                        groupPanelOptions = this.option("groupPanel") || {};

                    return extend({
                        allowFixing: this.option("columnFixing.enabled"),
                        allowResizing: this.option("allowColumnResizing") || undefined,
                        allowReordering: this.option("allowColumnReordering"),
                        minWidth: this.option("columnMinWidth"),
                        width: this.option("columnWidth"),
                        autoExpandGroup: groupingOptions.autoExpandAll,
                        allowCollapsing: groupingOptions.allowCollapsing,
                        allowGrouping: groupPanelOptions.allowColumnDragging && groupPanelOptions.visible || groupingOptions.contextMenuEnabled
                    }, commonColumnSettings);
                },
                isColumnOptionUsed: function(optionName) {
                    for(var i = 0; i < this._columns.length; i++) {
                        if(this._columns[i][optionName]) {
                            return true;
                        }
                    }
                },
                isAllDataTypesDefined: function(checkSerializers) {
                    var columns = this._columns,
                        i;

                    if(!columns.length) {
                        return false;
                    }

                    for(i = 0; i < columns.length; i++) {
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
                    var result = [];

                    iteratorUtils.each(this._columns, function() {
                        var column = this;
                        if(isDefined(column.groupIndex)) {
                            result[column.groupIndex] = column;
                        }
                    });
                    return result;
                },

                /**
                 * @name dxDataGridMethods.getVisibleColumns
                 * @publicName getVisibleColumns(headerLevel)
                 * @param1 headerLevel:number
                 * @return Array<dxDataGridColumn>
                 */
                /**
                 * @name dxTreeListMethods.getVisibleColumns
                 * @publicName getVisibleColumns(headerLevel)
                 * @param1 headerLevel:number
                 * @return Array<dxTreeListColumn>
                 */
                /**
                 * @name dxDataGridMethods.getVisibleColumns
                 * @publicName getVisibleColumns()
                 * @return Array<dxDataGridColumn>
                 */
                /**
                 * @name dxTreeListMethods.getVisibleColumns
                 * @publicName getVisibleColumns()
                 * @return Array<dxTreeListColumn>
                 */
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
                getFilteringColumns: function(rowIndex) {
                    return this.getColumns().filter(item => item.dataField && item.allowFiltering);
                },
                _getFixedColumnsCore: function() {
                    var that = this,
                        i,
                        j,
                        column,
                        prevColumn,
                        result = [],
                        rowCount = that.getRowCount(),
                        isColumnFixing = that._isColumnFixing(),
                        transparentColumn = { command: "transparent" },
                        transparentColspan = 0,
                        notFixedColumnCount,
                        transparentColumnIndex,
                        lastFixedPosition,
                        visibleColumns;

                    if(isColumnFixing) {
                        for(i = 0; i <= rowCount; i++) {
                            notFixedColumnCount = 0;
                            lastFixedPosition = null;
                            transparentColumnIndex = null;
                            visibleColumns = that.getVisibleColumns(i, true);

                            for(j = 0; j < visibleColumns.length; j++) {
                                prevColumn = visibleColumns[j - 1];
                                column = visibleColumns[j];

                                if(!column.command) {
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
                                    } else if(prevColumn && prevColumn.fixed && getFixedPosition(prevColumn) !== getFixedPosition(column)) {
                                        if(!isDefined(transparentColumnIndex)) {
                                            transparentColumnIndex = j;
                                        }
                                    } else {
                                        lastFixedPosition = column.fixedPosition;
                                    }
                                }
                            }

                            if(i === 0 && (notFixedColumnCount === 0 || notFixedColumnCount >= visibleColumns.length)) {
                                return [];
                            }

                            if(!isDefined(transparentColumnIndex)) {
                                transparentColumnIndex = lastFixedPosition === "right" ? 0 : visibleColumns.length;
                            }

                            result[i] = visibleColumns.slice(0);
                            if(!transparentColumn.colspan) {
                                transparentColumn.colspan = transparentColspan;
                            }
                            result[i].splice(transparentColumnIndex, notFixedColumnCount, transparentColumn);
                        }
                    }

                    return result;
                },
                _isColumnFixing: function() {
                    var isColumnFixing = this.option("columnFixing.enabled");

                    !isColumnFixing && iteratorUtils.each(this._columns, function(_, column) {
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
                    var expandColumns = this._getExpandColumnsCore(),
                        expandColumn;

                    if(expandColumns.length) {
                        expandColumn = this.columnOption("command:expand");
                    }

                    expandColumns = iteratorUtils.map(expandColumns, function(column) {
                        return extend({}, column, {
                            visibleWidth: null,
                            minWidth: null,
                            cellTemplate: !typeUtils.isDefined(column.groupIndex) ? column.cellTemplate : null,
                            headerCellTemplate: null
                        }, expandColumn, { index: column.index });
                    });

                    return expandColumns;
                },
                getBandColumnsCache: function() {
                    if(!this._bandColumnsCache) {
                        var columns = this._columns,
                            columnChildrenByIndex = {},
                            columnParentByIndex = {};

                        columns.forEach(function(column) {
                            var parentIndex = column.ownerBand,
                                parent = columns[parentIndex];

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
                    var that = this,
                        i,
                        result = [],
                        rowspanExpandColumns = 0,
                        firstPositiveIndexColumn,
                        expandColumns = mergeColumns(that.getExpandColumns(), that._columns),
                        rowCount = that.getRowCount(),
                        positiveIndexedColumns = [],
                        negativeIndexedColumns = [],
                        notGroupedColumnsCount = 0,
                        isFixedToEnd,
                        rtlEnabled = that.option("rtlEnabled"),
                        columns = mergeColumns(that._columns, that._commandColumns, true),
                        bandColumnsCache = that.getBandColumnsCache(),
                        columnDigitsCount = digitsCount(columns.length);

                    processBandColumns(that, columns, bandColumnsCache);

                    for(i = 0; i < rowCount; i++) {
                        result[i] = [];
                        negativeIndexedColumns[i] = [{}];
                        positiveIndexedColumns[i] = [{}, {}, {}];
                    }

                    iteratorUtils.each(columns, function() {
                        var column = this,
                            rowIndex,
                            visibleIndex = column.visibleIndex,
                            indexedColumns,
                            parentBandColumns = getParentBandColumns(column.index, bandColumnsCache.columnParentByIndex),
                            visible = that._isColumnVisible(column);

                        if(visible && (!isDefined(column.groupIndex) || column.showWhenGrouped)) {
                            rowIndex = parentBandColumns.length;

                            if(visibleIndex < 0) {
                                visibleIndex = -visibleIndex;
                                indexedColumns = negativeIndexedColumns[rowIndex];
                            } else {
                                column.fixed = parentBandColumns.length ? parentBandColumns[0].fixed : column.fixed;
                                column.fixedPosition = parentBandColumns.length ? parentBandColumns[0].fixedPosition : column.fixedPosition;

                                if(column.fixed || column.command) {
                                    isFixedToEnd = column.fixedPosition === "right";

                                    if(rtlEnabled) {
                                        isFixedToEnd = !isFixedToEnd;
                                    }

                                    if(isFixedToEnd || column.command) {
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

                    iteratorUtils.each(result, function(rowIndex) {
                        objectUtils.orderEach(negativeIndexedColumns[rowIndex], function(_, columns) {
                            result[rowIndex].unshift.apply(result[rowIndex], columns);
                        });

                        firstPositiveIndexColumn = result[rowIndex].length;
                        iteratorUtils.each(positiveIndexedColumns[rowIndex], function(index, columnsByFixing) {
                            objectUtils.orderEach(columnsByFixing, function(_, columnsByVisibleIndex) {
                                result[rowIndex].push.apply(result[rowIndex], columnsByVisibleIndex);
                            });
                        });

                        if(rowspanExpandColumns < (rowIndex + 1)) {
                            rowspanExpandColumns += processExpandColumns(result[rowIndex], expandColumns, firstPositiveIndexColumn);
                        }
                    });

                    result.push(getDataColumns(result));

                    if(!notGroupedColumnsCount && that._columns.length) {
                        result[rowCount].push({ command: "empty" });
                    }

                    return result;
                },
                getInvisibleColumns: function(columns, bandColumnIndex) {
                    var that = this,
                        result = [],
                        hiddenColumnsByBand;

                    columns = columns || that._columns;

                    iteratorUtils.each(columns, function(_, column) {
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
                    var columns = getAllColumns ? this.getColumns() : this.getInvisibleColumns();

                    return grep(columns, function(column) { return column.showInColumnChooser; });
                },
                allowMoveColumn: function(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation) {
                    var that = this,
                        columnIndex = getColumnIndexByVisibleIndex(that, fromVisibleIndex, sourceLocation),
                        sourceColumn = that._columns[columnIndex];

                    if(sourceColumn && (sourceColumn.allowReordering || sourceColumn.allowGrouping || sourceColumn.allowHiding)) {
                        if(sourceLocation === targetLocation) {
                            if(sourceLocation === COLUMN_CHOOSER_LOCATION) {
                                return false;
                            }

                            fromVisibleIndex = typeUtils.isObject(fromVisibleIndex) ? fromVisibleIndex.columnIndex : fromVisibleIndex;
                            toVisibleIndex = typeUtils.isObject(toVisibleIndex) ? toVisibleIndex.columnIndex : toVisibleIndex;

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
                    var that = this,
                        options = {},
                        prevGroupIndex,
                        fromIndex = getColumnIndexByVisibleIndex(that, fromVisibleIndex, sourceLocation),
                        toIndex = getColumnIndexByVisibleIndex(that, toVisibleIndex, targetLocation),
                        targetGroupIndex,
                        column;

                    if(fromIndex >= 0) {
                        column = that._columns[fromIndex];
                        toVisibleIndex = typeUtils.isObject(toVisibleIndex) ? toVisibleIndex.columnIndex : toVisibleIndex;
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
                            var targetColumn = that._columns[toIndex];

                            if(!targetColumn || column.ownerBand !== targetColumn.ownerBand) {
                                options.visibleIndex = undefined;
                            } else {
                                if(column.fixed ^ targetColumn.fixed) {
                                    options.visibleIndex = undefined;
                                } else {
                                    options.visibleIndex = targetColumn.visibleIndex;
                                }
                            }
                        }

                        var isVisible = targetLocation !== COLUMN_CHOOSER_LOCATION;

                        if(column.visible !== isVisible) {
                            options.visible = isVisible;
                        }

                        that.columnOption(column.index, options);
                    }
                },
                changeSortOrder: function(columnIndex, sortOrder) {
                    var that = this,
                        options = {},
                        sortingOptions = that.option("sorting"),
                        sortingMode = sortingOptions && sortingOptions.mode,
                        needResetSorting = sortingMode === "single" || !sortOrder,
                        allowSorting = sortingMode === "single" || sortingMode === "multiple",
                        column = that._columns[columnIndex],
                        nextSortOrder = function(column) {
                            if(sortOrder === "ctrl") {
                                if(!(("sortOrder" in column) && ("sortIndex" in column))) {
                                    return false;
                                }

                                options.sortOrder = undefined;
                                options.sortIndex = undefined;
                            } else if(isDefined(column.groupIndex) || isDefined(column.sortIndex)) {
                                options.sortOrder = column.sortOrder === "desc" ? "asc" : "desc";
                            } else {
                                options.sortOrder = "asc";
                            }

                            return true;
                        };

                    if(allowSorting && column && column.allowSorting) {
                        if(needResetSorting && !isDefined(column.groupIndex)) {
                            iteratorUtils.each(that._columns, function(index) {
                                if(index !== columnIndex && this.sortOrder && !isDefined(this.groupIndex)) {
                                    delete this.sortOrder;
                                    delete this.sortIndex;
                                }
                            });
                        }
                        if(isSortOrderValid(sortOrder)) {
                            if(column.sortOrder !== sortOrder) {
                                options.sortOrder = sortOrder;
                            }
                        } else if(sortOrder === "none") {
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
                    var that = this,
                        sortColumns = [],
                        sort = [];

                    iteratorUtils.each(that._columns, function() {
                        if((this.dataField || this.selector || this.calculateCellValue) && isDefined(this.sortIndex) && !isDefined(this.groupIndex)) {
                            sortColumns[this.sortIndex] = this;
                        }
                    });
                    iteratorUtils.each(sortColumns, function() {
                        var sortOrder = this && this.sortOrder;
                        if(isSortOrderValid(sortOrder)) {
                            var sortItem = {
                                selector: this.calculateSortValue || this.displayField || this.calculateDisplayValue || (useLocalSelector && this.selector) || this.dataField || this.calculateCellValue,
                                desc: (this.sortOrder === "desc")
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
                    var group = [];

                    iteratorUtils.each(this.getGroupColumns(), function() {
                        var selector = this.calculateGroupValue || this.displayField || this.calculateDisplayValue || (useLocalSelector && this.selector) || this.dataField || this.calculateCellValue;
                        if(selector) {
                            var groupItem = {
                                selector: selector,
                                desc: (this.sortOrder === "desc"),
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
                    var deferreds = [];

                    iteratorUtils.each(this._columns, function() {
                        var lookup = this.lookup;

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
                _updateColumnOptions: function(column) {
                    column.selector = column.selector || function(data) { return column.calculateCellValue(data); };

                    iteratorUtils.each(["calculateSortValue", "calculateGroupValue", "calculateDisplayValue"], function(_, calculateCallbackName) {
                        var calculateCallback = column[calculateCallbackName];
                        if(typeUtils.isFunction(calculateCallback) && !calculateCallback.originalCallback) {
                            column[calculateCallbackName] = function(data) { return calculateCallback.call(column, data); };
                            column[calculateCallbackName].originalCallback = calculateCallback;
                        }
                    });

                    if(typeUtils.isString(column.calculateDisplayValue)) {
                        column.displayField = column.calculateDisplayValue;
                        column.calculateDisplayValue = dataCoreUtils.compileGetter(column.displayField);
                    }
                    if(column.calculateDisplayValue) {
                        column.displayValueMap = column.displayValueMap || {};
                    }

                    updateSerializers(column, column.dataType);

                    var lookup = column.lookup;
                    if(lookup) {
                        updateSerializers(lookup, lookup.dataType);
                    }

                    var dataType = lookup ? lookup.dataType : column.dataType;
                    if(dataType) {
                        column.alignment = column.alignment || getAlignmentByDataType(dataType, this.option("rtlEnabled"));
                        column.format = column.format || gridCoreUtils.getFormatByDataType(dataType);
                        column.customizeText = column.customizeText || getCustomizeTextByDataType(dataType);
                        column.defaultFilterOperations = !lookup && DATATYPE_OPERATIONS[dataType] || [];
                        if(!isDefined(column.filterOperations)) {
                            column.filterOperations = column.defaultFilterOperations;
                        }
                        column.defaultFilterOperation = column.filterOperations && column.filterOperations[0] || "=";
                        column.showEditorAlways = isDefined(column.showEditorAlways) ? column.showEditorAlways : (dataType === "boolean" && !column.cellTemplate);
                    }
                },
                updateColumnDataTypes: function(dataSource) {
                    var that = this,
                        dateSerializationFormat = that.option("dateSerializationFormat"),
                        firstItems = that._getFirstItems(dataSource),
                        isColumnDataTypesUpdated = false;

                    iteratorUtils.each(that._columns, function(index, column) {
                        var i,
                            value,
                            dataType,
                            lookupDataType,
                            valueDataType,
                            lookup = column.lookup;

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
                                            dataType = "string";
                                        }
                                    }

                                    if(lookup && !lookup.dataType) {
                                        valueDataType = getValueDataType(gridCoreUtils.getDisplayValue(column, value, firstItems[i]));
                                        lookupDataType = lookupDataType || valueDataType;
                                        if(lookupDataType && valueDataType && lookupDataType !== valueDataType) {
                                            lookupDataType = "string";
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

                        that._updateColumnOptions(column);
                    });

                    return isColumnDataTypesUpdated;
                },
                _customizeColumns: function(columns) {
                    var that = this,
                        hasOwnerBand,
                        customizeColumns = that.option("customizeColumns");

                    if(customizeColumns) {
                        hasOwnerBand = columns.some(function(column) {
                            return typeUtils.isObject(column.ownerBand);
                        });

                        if(hasOwnerBand) {
                            updateIndexes(that);
                        }

                        customizeColumns(columns);
                        assignColumns(that, createColumnsFromOptions(that, columns));
                    }
                },
                updateColumns: function(dataSource, forceApplying) {
                    var that = this,
                        sortParameters,
                        groupParameters;

                    if(!forceApplying) {
                        that.updateSortingGrouping(dataSource);
                    }

                    if(!dataSource || dataSource.isLoaded()) {
                        sortParameters = dataSource ? dataSource.sort() || [] : that.getSortDataSourceParameters();
                        groupParameters = dataSource ? dataSource.group() || [] : that.getGroupDataSourceParameters();

                        that._customizeColumns(that._columns);
                        updateIndexes(that);

                        var columns = that._columns;
                        return when(that.refresh(true)).always(function() {
                            if(that._columns !== columns) return;

                            that._updateChanges(dataSource, { sorting: sortParameters, grouping: groupParameters });

                            fireColumnsChanged(that);
                        });
                    }
                },
                _updateChanges: function(dataSource, parameters) {
                    var that = this;

                    if(dataSource) {
                        that.updateColumnDataTypes(dataSource);
                        that._dataSourceApplied = true;
                    }

                    if(!equalSortParameters(parameters.sorting, that.getSortDataSourceParameters())) {
                        updateColumnChanges(that, "sorting");
                    }
                    if(!equalSortParameters(parameters.grouping, that.getGroupDataSourceParameters())) {
                        updateColumnChanges(that, "grouping");
                    }
                    updateColumnChanges(that, "columns");
                },
                updateSortingGrouping: function(dataSource, fromDataSource) {
                    var that = this,
                        sortParameters,
                        groupParameters,
                        columnsGroupParameters,
                        columnsSortParameters,
                        isColumnsChanged,
                        updateSortGroupParameterIndexes = function(columns, sortParameters, indexParameterName) {
                            var i,
                                selector,
                                isExpanded;

                            iteratorUtils.each(columns, function(index, column) {
                                delete column[indexParameterName];
                                if(sortParameters) {
                                    for(i = 0; i < sortParameters.length; i++) {
                                        selector = sortParameters[i].selector;
                                        isExpanded = sortParameters[i].isExpanded;

                                        if(selector === column.dataField || selector === column.name || selector === column.selector || selector === column.calculateCellValue || selector === column.calculateGroupValue) {
                                            column.sortOrder = column.sortOrder || (sortParameters[i].desc ? "desc" : "asc");

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
                        sortParameters = normalizeSortingInfo(dataSource.sort());
                        groupParameters = normalizeSortingInfo(dataSource.group());
                        columnsGroupParameters = that.getGroupDataSourceParameters();
                        columnsSortParameters = that.getSortDataSourceParameters();
                        if(!that._columns.length) {
                            iteratorUtils.each(groupParameters, function(index, group) {
                                that._columns.push(group.selector);
                            });
                            iteratorUtils.each(sortParameters, function(index, sort) {
                                that._columns.push(sort.selector);
                            });
                            assignColumns(that, createColumnsFromOptions(that, that._columns));
                        }
                        if((fromDataSource || (!columnsGroupParameters && !that._hasUserState)) && !equalSortParameters(groupParameters, columnsGroupParameters)) {
                            ///#DEBUG
                            that.__groupingUpdated = true;
                            ///#ENDDEBUG
                            updateSortGroupParameterIndexes(that._columns, groupParameters, "groupIndex");
                            if(fromDataSource) {
                                updateColumnChanges(that, "grouping");
                                isColumnsChanged = true;
                            }
                        }
                        if((fromDataSource || (!columnsSortParameters && !that._hasUserState)) && !equalSortParameters(sortParameters, columnsSortParameters)) {
                            ///#DEBUG
                            that.__sortingUpdated = true;
                            ///#ENDDEBUG
                            updateSortGroupParameterIndexes(that._columns, sortParameters, "sortIndex");
                            if(fromDataSource) {
                                updateColumnChanges(that, "sorting");
                                isColumnsChanged = true;
                            }
                        }
                        if(isColumnsChanged) {
                            fireColumnsChanged(that);
                        }
                    }
                },

                updateFilter: function(filter, remoteFiltering, columnIndex) {
                    var that = this;

                    if(!Array.isArray(filter)) return filter;

                    var column,
                        i;

                    filter = extend([], filter);

                    columnIndex = filter.columnIndex || columnIndex;

                    if(typeUtils.isString(filter[0])) {
                        column = that.columnOption(filter[0]);

                        if(remoteFiltering) {
                            if(config().forceIsoDateParsing && column && column.serializeValue && filter.length > 1) {
                                filter[filter.length - 1] = column.serializeValue(filter[filter.length - 1], "filter");
                            }
                        } else {
                            if(column && column.selector) {
                                filter[0] = column.selector;
                                filter[0].columnIndex = column.index;
                            }
                        }
                    } else if(typeUtils.isFunction(filter[0])) {
                        filter[0].columnIndex = columnIndex;
                    }

                    for(i = 0; i < filter.length; i++) {
                        filter[i] = that.updateFilter(filter[i], remoteFiltering, columnIndex);
                    }

                    return filter;
                },
                /**
                 * @name GridBaseMethods.columnCount
                 * @publicName columnCount()
                 * @return number
                 */
                columnCount: function() {
                    return this._columns ? this._columns.length : 0;
                },
                /**
                 * @name GridBaseMethods.columnOption
                 * @publicName columnOption(id)
                 * @param1 id:number|string
                 * @return object
                 */
                /**
                 * @name GridBaseMethods.columnOption
                 * @publicName columnOption(id, optionName)
                 * @param1 id:number|string
                 * @param2 optionName:string
                 * @return any
                 */
                /**
                 * @name GridBaseMethods.columnOption
                 * @publicName columnOption(id, optionName, optionValue)
                 * @param1 id:number|string
                 * @param2 optionName:string
                 * @param3 optionValue:any
                 */
                /**
                 * @name GridBaseMethods.columnOption
                 * @publicName columnOption(id, options)
                 * @param1 id:number|string
                 * @param2 options:object
                 */
                columnOption: function(identifier, option, value, notFireEvent) {
                    var that = this,
                        i,
                        identifierOptionName = typeUtils.isString(identifier) && identifier.substr(0, identifier.indexOf(":")),
                        columns = (identifier < 0 || identifierOptionName === "command") ? that._columns.concat(that._commandColumns) : that._columns,
                        needUpdateIndexes,
                        column;

                    if(identifier === undefined) return;

                    if(identifierOptionName) {
                        identifier = identifier.substr(identifierOptionName.length + 1);
                    }

                    for(i = 0; i < columns.length; i++) {
                        if(identifierOptionName) {
                            if(("" + columns[i][identifierOptionName]) === identifier) {
                                column = columns[i];
                                break;
                            }
                        } else if(columns[i].index === identifier || columns[i].name === identifier ||
                            columns[i].dataField === identifier || columns[i].caption === identifier) {

                            column = columns[i];
                            break;
                        }
                    }

                    if(column) {
                        if(arguments.length === 1) {
                            return extend({}, column);
                        }
                        if(typeUtils.isString(option)) {
                            if(arguments.length === 2) {
                                return columnOptionCore(that, column, option);
                            } else {
                                needUpdateIndexes = needUpdateIndexes || COLUMN_INDEX_OPTIONS[option];
                                columnOptionCore(that, column, option, value, notFireEvent);
                            }
                        } else if(typeUtils.isObject(option)) {
                            iteratorUtils.each(option, function(optionName, value) {
                                needUpdateIndexes = needUpdateIndexes || COLUMN_INDEX_OPTIONS[optionName];
                                columnOptionCore(that, column, optionName, value, notFireEvent);
                            });
                        }
                        if(needUpdateIndexes) {
                            updateIndexes(that, column);
                        }

                        fireColumnsChanged(that);
                    }
                },
                /**
                 * @name GridBaseMethods.clearSorting
                 * @publicName clearSorting()
                 */
                clearSorting: function() {
                    var that = this,
                        columnCount = this.columnCount(),
                        i;

                    that.beginUpdate();

                    for(i = 0; i < columnCount; i++) {
                        that.columnOption(i, "sortOrder", undefined);
                    }
                    that.endUpdate();
                },
                /**
                 * @name dxDataGridMethods.clearGrouping
                 * @publicName clearGrouping()
                 */
                clearGrouping: function() {
                    var that = this,
                        columnCount = this.columnCount(),
                        i;

                    that.beginUpdate();

                    for(i = 0; i < columnCount; i++) {
                        that.columnOption(i, "groupIndex", undefined);
                    }
                    that.endUpdate();
                },

                getVisibleIndex: function(index, rowIndex) {
                    var i,
                        columns = this.getVisibleColumns(rowIndex);

                    for(i = columns.length - 1; i >= 0; i--) {
                        if(columns[i].index === index) {
                            return i;
                        }
                    }
                    return -1;
                },
                /**
                 * @name dxDataGridMethods.addColumn
                 * @publicName addColumn(columnOptions)
                 * @param1 columnOptions:object|string
                 */
                /**
                 * @name dxTreeListMethods.addColumn
                 * @publicName addColumn(columnOptions)
                 * @param1 columnOptions:object|string
                 */
                addColumn: function(options) {
                    var that = this,
                        column = createColumn(that, options),
                        index = that._columns.length;

                    that._columns.push(column);

                    if(column.isBand) {
                        that._columns = createColumnsFromOptions(that, that._columns);
                        column = that._columns[index];
                    }

                    column.added = options;
                    updateIndexes(that, column);
                    that.updateColumns(that._dataSource);
                },
                /**
                 * @name GridBaseMethods.deleteColumn
                 * @publicName deleteColumn(id)
                 * @param1 id:number|string
                 */
                deleteColumn: function(id) {
                    var that = this,
                        columnIndex = that.columnOption(id, "index");

                    if(columnIndex >= 0) {
                        that._columns.splice(columnIndex, 1);
                        updateIndexes(that);
                        that.updateColumns(that._dataSource);
                    }
                },
                addCommandColumn: function(options) {
                    var commandColumns = this._commandColumns,
                        i;

                    for(i = 0; i < commandColumns.length; i++) {
                        if(commandColumns[i].command === options.command) {
                            return;
                        }
                    }

                    commandColumns.push(options);
                },
                getUserState: function() {
                    var columns = this._columns,
                        result = [],
                        i;

                    function handleStateField(index, value) {
                        if(columns[i][value] !== undefined) {
                            result[i][value] = columns[i][value];
                        }
                    }

                    for(i = 0; i < columns.length; i++) {
                        result[i] = {};
                        iteratorUtils.each(USER_STATE_FIELD_NAMES, handleStateField);
                    }
                    return result;
                },
                setUserState: function(state) {
                    var that = this,
                        commonColumnSettings,
                        ignoreColumnOptionNames = that.option("stateStoring.ignoreColumnOptionNames");

                    if(!ignoreColumnOptionNames) {
                        ignoreColumnOptionNames = [];
                        commonColumnSettings = that.getCommonSettings();

                        if(!that.option("columnChooser.enabled")) ignoreColumnOptionNames.push("visible");
                        if(that.option("sorting.mode") === "none") ignoreColumnOptionNames.push("sortIndex", "sortOrder");
                        if(!commonColumnSettings.allowGrouping) ignoreColumnOptionNames.push("groupIndex");
                        if(!commonColumnSettings.allowFixing) ignoreColumnOptionNames.push("fixed", "fixedPosition");
                        if(!commonColumnSettings.allowResizing) ignoreColumnOptionNames.push("width", "visibleWidth");
                        if(!that.option("filterRow.visible")) ignoreColumnOptionNames.push("filterValue", "selectedFilterOperation");
                        if(!that.option("headerFilter.visible")) ignoreColumnOptionNames.push("filterValues", "filterType");
                    }

                    that._columnsUserState = state;
                    that._ignoreColumnOptionNames = ignoreColumnOptionNames;
                    that._hasUserState = !!state;
                    updateColumnChanges(that, "filtering");
                    that.init();
                },
                _createCalculatedColumnOptions: function(columnOptions, bandColumn) {
                    var calculatedColumnOptions = {},
                        dataField = columnOptions.dataField,
                        getter;

                    if(Array.isArray(columnOptions.columns) && columnOptions.columns.length || columnOptions.isBand) {
                        calculatedColumnOptions.isBand = true;
                        dataField = null;
                    }

                    if(dataField) {
                        if(typeUtils.isString(dataField)) {
                            getter = dataCoreUtils.compileGetter(dataField);
                            calculatedColumnOptions = {
                                caption: inflector.captionize(dataField),
                                calculateCellValue: function(data, skipDeserialization) {
                                    var value = getter(data);
                                    return this.deserializeValue && !skipDeserialization ? this.deserializeValue(value) : value;
                                },
                                setCellValue: defaultSetCellValue,
                                parseValue: function(text) {
                                    var column = this,
                                        result,
                                        parsedValue;

                                    if(column.dataType === "number") {
                                        if(typeUtils.isString(text)) {
                                            parsedValue = numberLocalization.parse(text);

                                            if(typeUtils.isNumeric(parsedValue)) {
                                                result = parsedValue;
                                            }
                                        } else if(isDefined(text)) {
                                            result = Number(text);
                                        }
                                    } else if(column.dataType === "boolean") {
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

                    calculatedColumnOptions.createFilterExpression = function() {
                        var result;
                        if(this.calculateFilterExpression) {
                            result = this.calculateFilterExpression.apply(this, arguments);
                        }
                        if(typeUtils.isFunction(result)) {
                            result = [result, "=", true];
                        } else if(result) {
                            result.columnIndex = this.index;
                        }
                        return result;
                    };

                    if(!dataField || !typeUtils.isString(dataField)) {
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
                    if(columnOptions.selectedFilterOperation) {
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
                                var calculateValue,
                                    calculateDisplayValue,
                                    item,
                                    i;

                                this.valueMap = {};
                                if(this.items) {
                                    calculateValue = dataCoreUtils.compileGetter(this.valueExpr);
                                    calculateDisplayValue = dataCoreUtils.compileGetter(this.displayExpr);
                                    for(i = 0; i < this.items.length; i++) {
                                        item = this.items[i];
                                        var displayValue = calculateDisplayValue(item);
                                        this.valueMap[calculateValue(item)] = displayValue;
                                        this.dataType = this.dataType || getValueDataType(displayValue);
                                    }
                                }
                            },
                            update: function() {
                                var that = this,
                                    dataSource = that.dataSource,
                                    dataSourceOptions;

                                if(dataSource) {
                                    if(typeUtils.isFunction(dataSource) && !isWrapped(dataSource)) {
                                        dataSource = dataSource({});
                                    }
                                    if(typeUtils.isPlainObject(dataSource) || (dataSource instanceof Store) || Array.isArray(dataSource)) {
                                        if(that.valueExpr) {
                                            dataSourceOptions = normalizeDataSourceOptions(dataSource);
                                            dataSourceOptions.paginate = false;
                                            dataSource = new DataSourceModule.DataSource(dataSourceOptions);
                                            return dataSource.load().done(function(data) {
                                                that.items = data;
                                                that.updateValueMap && that.updateValueMap();
                                            });
                                        }
                                    } else {
                                        errors.log("E1016");
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

                    iteratorUtils.each(calculatedColumnOptions, function(optionName) {
                        var defaultOptionName;
                        if(typeUtils.isFunction(calculatedColumnOptions[optionName]) && optionName.indexOf("default") !== 0) {
                            defaultOptionName = "default" + optionName.charAt(0).toUpperCase() + optionName.substr(1);
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
                    var column = this._columns[columnIndex],
                        bandColumnsCache = this.getBandColumnsCache();

                    return column && (alwaysGetRowIndex || column.visible && !(column.command || isDefined(column.groupIndex))) ? getParentBandColumns(columnIndex, bandColumnsCache.columnParentByIndex).length : 0;
                },
                getChildrenByBandColumn: function(bandColumnIndex, onlyVisibleDirectChildren) {
                    var that = this,
                        bandColumnsCache = that.getBandColumnsCache(),
                        result = getChildrenByBandColumn(bandColumnIndex, bandColumnsCache.columnChildrenByIndex, !onlyVisibleDirectChildren);

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
                    var result = false,
                        column = this._columns[columnIndex],
                        bandColumnsCache = this.getBandColumnsCache(),
                        parentBandColumns = column && getParentBandColumns(columnIndex, bandColumnsCache.columnParentByIndex);

                    if(parentBandColumns) { // T416483 - fix for jquery 2.1.4
                        iteratorUtils.each(parentBandColumns, function(_, bandColumn) {
                            if(bandColumn.index === bandColumnIndex) {
                                result = true;
                                return false;
                            }
                        });
                    }

                    return result;
                },
                isParentColumnVisible: function(columnIndex) {
                    var result = true,
                        bandColumnsCache = this.getBandColumnsCache(),
                        bandColumns = columnIndex >= 0 && getParentBandColumns(columnIndex, bandColumnsCache.columnParentByIndex);

                    bandColumns && iteratorUtils.each(bandColumns, function(_, bandColumn) {
                        result = result && bandColumn.visible;
                        return result;
                    });

                    return result;
                }
            };
        })())
    }
};
