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
    DataSourceModule = require("../../data/data_source/data_source"),
    normalizeDataSourceOptions = DataSourceModule.normalizeDataSourceOptions;

var USER_STATE_FIELD_NAMES_15_1 = ["filterValues", "filterType", "fixed", "fixedPosition"],
    USER_STATE_FIELD_NAMES = ["visibleIndex", "dataField", "name", "dataType", "width", "visible", "sortOrder", "sortIndex", "groupIndex", "filterValue", "selectedFilterOperation", "added"].concat(USER_STATE_FIELD_NAMES_15_1),
    COMMAND_EXPAND_CLASS = "dx-command-expand";

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
                 * @name GridBaseOptions_columns_trueText
                 * @publicName trueText
                 * @type string
                 * @default "true"
                 */
                trueText: messageLocalization.format("dxDataGrid-trueText"),
                /**
                 * @name GridBaseOptions_columns_falseText
                 * @publicName falseText
                 * @type string
                 * @default "false"
                 */
                falseText: messageLocalization.format("dxDataGrid-falseText")
            },
            /**
             * @name GridBaseOptions_allowColumnReordering
             * @publicName allowColumnReordering
             * @type boolean
             * @default false
             */
            allowColumnReordering: false,
            /**
             * @name GridBaseOptions_allowColumnResizing
             * @publicName allowColumnResizing
             * @type boolean
             * @default false
             */
            allowColumnResizing: false,
            /**
             * @name GridBaseOptions_columnResizingMode
             * @publicName columnResizingMode
             * @type string
             * @default "nextColumn"
             * @acceptValues "nextColumn" | "widget"
             */
            columnResizingMode: "nextColumn",
            /**
             * @name GridBaseOptions_columnMinWidth
             * @publicName columnMinWidth
             * @type number
             * @default undefined
             */
            columnMinWidth: undefined,
            adaptColumnWidthByRatio: true,
            /**
             * @name GridBaseOptions_columns
             * @publicName columns
             * @type Array<Object>
             * @default undefined
             */
            /**
             * @name dxDataGridOptions_columns
             * @publicName columns
             * @type Array<Object>
             * @default undefined
             */
            /**
             * @name dxTreeListOptions_columns
             * @publicName columns
             * @type Array<Object>
             * @default undefined
             */
            columns: undefined,
            /**
             * @name GridBaseOptions_columns_visible
             * @publicName visible
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseOptions_columns_hidingPriority
             * @publicName hidingPriority
             * @type number
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_fixed
             * @publicName fixed
             * @type boolean
             * @default false
             */
            /**
             * @name dxDataGridOptions_columns_columns
             * @publicName columns
             * @type Array<dxDataGridOptions_columns>
             * @default undefined
             */
            /**
             * @name dxTreeListOptions_columns_columns
             * @publicName columns
             * @type Array<dxTreeListOptions_columns>
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_ownerBand
             * @publicName ownerBand
             * @type number
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_isBand
             * @publicName isBand
             * @type boolean
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_fixedPosition
             * @publicName fixedPosition
             * @type string
             * @default undefined
             * @acceptValues "left" | "right"
             */
            /**
             * @name GridBaseOptions_columns_visibleIndex
             * @publicName visibleIndex
             * @type number
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_showInColumnChooser
             * @publicName showInColumnChooser
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseOptions_columns_dataField
             * @publicName dataField
             * @type string
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_dataType
             * @publicName dataType
             * @type string
             * @default undefined
             * @acceptValues "string" | "number" | "date" | "datetime" | "boolean" | "object"
             */
            /**
             * @name GridBaseOptions_columns_validationRules
             * @publicName validationRules
             * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule>
             */
            /**
             * @name GridBaseOptions_columns_calculateCellValue
             * @publicName calculateCellValue
             * @type function(rowData)
             * @type_function_param1 rowData:object
             * @type_function_return any
             */
            /**
             * @name GridBaseOptions_columns_setCellValue
             * @publicName setCellValue
             * @type function(newData, value, currentRowData)
             * @type_function_param1 newData:object
             * @type_function_param2 value:any
             * @type_function_param3 currentRowData:object
             */
            /**
             * @name GridBaseOptions_columns_calculateDisplayValue
             * @publicName calculateDisplayValue
             * @type string|function(rowData)
             * @type_function_param1 rowData:object
             * @type_function_return any
             */
            /**
             * @name dxDataGridOptions_columns_calculateGroupValue
             * @publicName calculateGroupValue
             * @type string|function(rowData)
             * @type_function_param1 rowData:object
             * @type_function_return any
             */
            /**
             * @name GridBaseOptions_columns_calculateSortValue
             * @publicName calculateSortValue
             * @type string|function(rowData)
             * @type_function_param1 rowData:object
             * @type_function_return any
             */
            /**
             * @name GridBaseOptions_columns_sortingMethod
             * @publicName sortingMethod
             * @type function(value1, value2)
             * @type_function_param1 value1:any
             * @type_function_param2 value2:any
             * @type_function_return number
             * @default undefined
             */
            /**
             * @name dxDataGridOptions_columns_showWhenGrouped
             * @publicName showWhenGrouped
             * @type boolean
             * @default false
             */
            /**
             * @name GridBaseOptions_columns_calculateFilterExpression
             * @publicName calculateFilterExpression
             * @type function(filterValue, selectedFilterOperation, target)
             * @type_function_param1 filterValue:any
             * @type_function_param2 selectedFilterOperation:string
             * @type_function_param3 target:string
             * @type_function_return Filter expression
             */
            /**
             * @name GridBaseOptions_columns_name
             * @publicName name
             * @type string
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_caption
             * @publicName caption
             * @type string
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_width
             * @publicName width
             * @type number|string
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_minWidth
             * @publicName minWidth
             * @type number
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_cssClass
             * @publicName cssClass
             * @type string
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_sortOrder
             * @publicName sortOrder
             * @type string
             * @default undefined
             * @acceptValues undefined | "asc" | "desc"
             */
            /**
             * @name GridBaseOptions_columns_sortIndex
             * @publicName sortIndex
             * @type number
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_showEditorAlways
             * @publicName showEditorAlways
             * @type boolean
             * @default false
             */
            /**
             * @name GridBaseOptions_columns_alignment
             * @publicName alignment
             * @type string
             * @default undefined
             * @acceptValues undefined | "left" | "center" | "right"
             */
            /**
             * @name GridBaseOptions_columns_format
             * @publicName format
             * @type format
             * @default ""
             */
            /**
             * @name GridBaseOptions_columns_customizeText
             * @publicName customizeText
             * @type function(cellInfo)
             * @type_function_param1 cellInfo:object
             * @type_function_param1_field1 value:string|number|date
             * @type_function_param1_field2 valueText:string
             * @type_function_param1_field3 target:string
             * @type_function_param1_field4 groupInterval:string|number
             * @type_function_return string
             */
            /**
             * @name dxDataGridOptions_columns_precision
             * @publicName precision
             * @type number
             * @default undefined
             * @deprecated
             */
            /**
             * @name GridBaseOptions_columns_filterOperations
             * @publicName filterOperations
             * @type Array<string>
             * @acceptValues "=" | "<>" | "<" | "<=" | ">" | ">=" | "notcontains" | "contains" | "startswith" | "endswith" | "between"
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_selectedFilterOperation
             * @publicName selectedFilterOperation
             * @type string
             * @acceptValues "=" | "<>" | "<" | "<=" | ">" | ">=" | "notcontains" | "contains" | "startswith" | "endswith" | "between"
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_filterValue
             * @publicName filterValue
             * @type any
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_filterValues
             * @publicName filterValues
             * @type Array<any>
             * @default undefined
            */
            /**
             * @name GridBaseOptions_columns_filterType
             * @publicName filterType
             * @type string
             * @default "include"
             * @acceptValues "include" | "exclude"
            */
            /**
             * @name GridBaseOptions_columns_cellTemplate
             * @publicName cellTemplate
             * @type template
             * @type_function_param1 cellElement:jQuery
             * @type_function_param2 cellInfo:object
             */
            /**
             * @name GridBaseOptions_columns_headerCellTemplate
             * @publicName headerCellTemplate
             * @type template
             * @type_function_param1 columnHeader:jQuery
             * @type_function_param2 headerInfo:object
             */
            /**
             * @name GridBaseOptions_columns_editCellTemplate
             * @publicName editCellTemplate
             * @type template
             * @type_function_param1 cellElement:jQuery
             * @type_function_param2 cellInfo:object
             */
            /**
             * @name dxDataGridOptions_columns_groupCellTemplate
             * @publicName groupCellTemplate
             * @type template
             * @type_function_param1 cellElement:jQuery
             * @type_function_param2 cellInfo:object
             */
            /**
             * @name dxDataGridOptions_columns_groupIndex
             * @publicName groupIndex
             * @type number
             * @default undefined
             */
            /**
             * @name dxDataGridOptions_columns_grouped
             * @publicName grouped
             * @type boolean
             * @hidden
             * @default false
             */
            /**
             * @name GridBaseOptions_columns_allowHiding
             * @publicName allowHiding
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseOptions_columns_allowReordering
             * @publicName allowReordering
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseOptions_columns_allowResizing
             * @publicName allowResizing
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseOptions_columns_allowFiltering
             * @publicName allowFiltering
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseOptions_columns_allowHeaderFiltering
             * @publicName allowHeaderFiltering
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseOptions_columns_allowSearch
             * @publicName allowSearch
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseOptions_columns_allowEditing
             * @publicName allowEditing
             * @type boolean
             * @default true
             */
            /**
             * @name dxDataGridOptions_columns_allowGrouping
             * @publicName allowGrouping
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseOptions_columns_allowFixing
             * @publicName allowFixing
             * @type boolean
             * @default true
             */
            /**
             * @name dxDataGridOptions_columns_autoExpandGroup
             * @publicName autoExpandGroup
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseOptions_columns_allowSorting
             * @publicName allowSorting
             * @type boolean
             * @default true
             */
            /**
             * @name GridBaseOptions_columns_encodeHtml
             * @publicName encodeHtml
             * @type boolean
             * @default true
             */
            /**
             * @name dxDataGridOptions_columns_resized
             * @publicName resized
             * @type function
             * @hidden
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_lookup
             * @publicName lookup
             * @type object
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_lookup_dataSource
             * @publicName dataSource
             * @type Array<any>|DataSourceOptions|function(options)
             * @type_function_param1 options:object
             * @type_function_param1_field1 data:object
             * @type_function_param1_field2 key:any
             * @type_function_return Array<any>|DataSourceOptions
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_lookup_valueExpr
             * @publicName valueExpr
             * @type string
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_lookup_displayExpr
             * @publicName displayExpr
             * @type string|function(data)
             * @type_function_param1 data:object
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_lookup_allowClearing
             * @publicName allowClearing
             * @type boolean
             * @default false
             */
            /**
             * @name dxDataGridOptions_regenerateColumnsByVisibleItems
             * @publicName regenerateColumnsByVisibleItems
             * @type boolean
             * @hidden
             * @default false
             */
            /**
             * @name GridBaseOptions_columns_headerFilter
             * @publicName headerFilter
             * @type object
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_headerFilter_dataSource
             * @publicName dataSource
             * @type Array<any>|function(options)|DataSourceOptions
             * @type_function_param1 options:object
             * @type_function_param1_field1 component:object
             * @type_function_param1_field2 dataSource:object
             * @default undefined
             */
            /**
             * @name GridBaseOptions_columns_headerFilter_groupInterval
             * @publicName groupInterval
             * @type string|number
             * @default undefined
             * @acceptValues 'year' | 'month' | 'day' | 'quarter' | 'hour' | 'minute' | 'second'
             */
            /**
             * @name GridBaseOptions_columns_headerFilter_allowSearch
             * @publicName allowSearch
             * @type boolean
             * @default false
             */
            /**
             * @name GridBaseOptions_columns_editorOptions
             * @publicName editorOptions
             * @type object
             */
            /**
             * @name GridBaseOptions_columns_formItem
             * @publicName formItem
             * @type dxFormSimpleItem
             */
            regenerateColumnsByVisibleItems: false,
            /**
             * @name dxDataGridOptions_customizeColumns
             * @publicName customizeColumns
             * @type function(columns)
             * @type_function_param1 columns:Array<dxDataGridOptions_columns>
             */
            /**
             * @name dxTreeListOptions_customizeColumns
             * @publicName customizeColumns
             * @type function(columns)
             * @type_function_param1 columns:Array<dxTreeListOptions_columns>
             */
            customizeColumns: null,
            /**
             * @name GridBaseOptions_dateSerializationFormat
             * @publicName dateSerializationFormat
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
                    calculatedColumnOptions;

                if(columnOptions) {
                    if(typeUtils.isString(columnOptions)) {
                        columnOptions = {
                            dataField: columnOptions
                        };
                    }

                    if(columnOptions.command) {
                        return extend(true, {}, columnOptions);
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
                    columns = that._columns,
                    callbackFilter = function(column) {
                        return column.ownerBand === result.index;
                    };

                for(var i = 0; i < columnIndexes.length; i++) {
                    result = columns[columnIndexes[i]];

                    if(result) {
                        columns = that._columns.filter(callbackFilter);
                    }
                }

                return result;
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
                            return dateSerialization.serializeDate(value, this.serializationFormat);
                        };
                    }
                    if(dataType === "number") {
                        options.deserializeValue = function(value) {
                            var parsedValue = parseFloat(value);
                            return isNaN(parsedValue) ? value : parsedValue;
                        };
                        options.serializeValue = function(value) {
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
                    columns = [],
                    bandColumnsCache = that.getBandColumnsCache();

                for(i = 0; i < that._columns.length; i++) {
                    column = that._columns[i];
                    parentBandColumns = getParentBandColumns(i, bandColumnsCache.columnParentByIndex);

                    if(parentBandColumns.length) {
                        bandColumnIndex = parentBandColumns[parentBandColumns.length - 1].index;
                        bandColumns[bandColumnIndex] = bandColumns[bandColumnIndex] || [];
                        bandColumns[bandColumnIndex].push(column);
                    } else {
                        columns.push(column);
                    }
                }

                for(key in bandColumns) {
                    normalizeIndexes(bandColumns[key], "visibleIndex", currentColumn);
                }

                normalizeIndexes(columns, "visibleIndex", currentColumn);
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
                column.groupIndex = groupIndex;
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
                that._visibleColumns = undefined;
                that._fixedColumns = undefined;
                that._rowCount = undefined;
                that._bandColumnsCache = undefined;
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

            var columnOptionCore = function(that, column, optionName, value, notFireEvent) {
                var optionGetter = dataCoreUtils.compileGetter(optionName),
                    columnIndex = column.index,
                    prevValue,
                    optionSetter,
                    columns,
                    changeType;

                if(arguments.length === 3) {
                    return optionGetter(column, { functionsAsIs: true });
                }
                prevValue = optionGetter(column, { functionsAsIs: true });
                if(prevValue !== value) {
                    if(optionName === "groupIndex") {
                        changeType = "grouping";
                    } else if(optionName === "sortIndex" || optionName === "sortOrder") {
                        changeType = "sorting";
                    } else {
                        changeType = "columns";
                    }
                    optionSetter = dataCoreUtils.compileSetter(optionName);
                    optionSetter(column, value, { functionsAsIs: true });

                    if(!isDefined(prevValue) && !isDefined(value) && optionName.indexOf("buffer") !== 0) {
                        notFireEvent = true;
                    }

                    if(!notFireEvent) {
                        //T346972
                        if(inArray(optionName, USER_STATE_FIELD_NAMES) < 0 && optionName !== "visibleWidth") {
                            columns = that.option("columns");
                            column = columns && columns[columnIndex];
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
                that.addCommandColumn({
                    command: "expand",
                    width: "auto",
                    cssClass: COMMAND_EXPAND_CLASS,
                    allowEditing: false, //T165142
                    allowGrouping: false,
                    allowSorting: false,
                    allowResizing: false,
                    allowReordering: false,
                    allowHiding: false
                });
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

            return {
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

                optionChanged: function(args) {
                    switch(args.name) {
                        case "adaptColumnWidthByRatio":
                            args.handled = true;
                            break;
                        case "columns":
                            args.handled = true;
                            if(args.name === args.fullName) {
                                this._columnsUserState = null;
                                this._ignoreColumnOptionNames = null;
                                this.init();
                            } else {
                                this._columnOptionChanged(args);
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
                    var column,
                        columnIndexes = [],
                        columnOptionValue = {},
                        columnOptionName = args.fullName.replace(/columns\[(\d+)\]\.?/gi, function(_, columnIndex) {
                            columnIndexes.push(parseInt(columnIndex));
                            return "";
                        });

                    if(columnIndexes.length) {
                        column = getColumnByIndexes(this, columnIndexes);

                        if(columnOptionName) {
                            columnOptionValue[columnOptionName] = args.value;
                        } else {
                            columnOptionValue = args.value;
                        }
                    }

                    if(column) {
                        this.columnOption(column.index, columnOptionValue);
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
                        allowResizing: this.option("allowColumnResizing"),
                        allowReordering: this.option("allowColumnReordering"),
                        minWidth: this.option("columnMinWidth"),
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
                        if(!columns[i].dataType || (checkSerializers && columns[i].deserializeValue && columns[i].serializationFormat === undefined)) {
                            return false;
                        }
                    }

                    return true;
                },
                getColumns: function() {
                    return this._columns;
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
                 * @name dxDataGridMethods_getVisibleColumns
                 * @publicName getVisibleColumns(headerLevel)
                 * @param1 headerLevel:number
                 * @return Array<dxDataGridOptions_columns>
                 */
                /**
                 * @name dxTreeListMethods_getVisibleColumns
                 * @publicName getVisibleColumns(headerLevel)
                 * @param1 headerLevel:number
                 * @return Array<dxTreeListOptions_columns>
                 */
                /**
                 * @name dxDataGridMethods_getVisibleColumns
                 * @publicName getVisibleColumns()
                 * @return Array<dxDataGridOptions_columns>
                 */
                /**
                 * @name dxTreeListMethods_getVisibleColumns
                 * @publicName getVisibleColumns()
                 * @return Array<dxTreeListOptions_columns>
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
                            visibleColumns = that.getVisibleColumns(i);

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
                        return extend({}, column, { visibleWidth: null, minWidth: null }, expandColumn, { index: column.index });
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
                        expandColumns = that.getExpandColumns(),
                        rowCount = that.getRowCount(),
                        positiveIndexedColumns = [],
                        negativeIndexedColumns = [],
                        notGroupedColumnsCount = 0,
                        isFixedToEnd,
                        rtlEnabled = that.option("rtlEnabled"),
                        columns = extend(true, [], that._columns.length ? that._commandColumns.concat(that._columns) : []),
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
                        fromIndex = getColumnIndexByVisibleIndex(that, fromVisibleIndex, sourceLocation),
                        toIndex = getColumnIndexByVisibleIndex(that, toVisibleIndex, targetLocation),
                        targetGroupIndex,
                        isGroupMoving = sourceLocation === GROUP_LOCATION || targetLocation === GROUP_LOCATION,
                        column;

                    if(fromIndex >= 0) {
                        column = that._columns[fromIndex];
                        toVisibleIndex = typeUtils.isObject(toVisibleIndex) ? toVisibleIndex.columnIndex : toVisibleIndex;
                        targetGroupIndex = toIndex >= 0 ? that._columns[toIndex].groupIndex : -1;

                        if(isDefined(column.groupIndex) && sourceLocation === GROUP_LOCATION) {
                            if(targetGroupIndex > column.groupIndex) {
                                targetGroupIndex--;
                            }
                            delete column.groupIndex;
                            delete column.sortOrder;
                            updateColumnGroupIndexes(that);
                        }

                        if(targetLocation === GROUP_LOCATION) {
                            moveColumnToGroup(that, column, targetGroupIndex);
                            updateColumnGroupIndexes(that);
                        } else if(toVisibleIndex >= 0) {
                            var targetColumn = that._columns[toIndex];

                            if(!targetColumn || column.ownerBand !== targetColumn.ownerBand) {
                                column.visibleIndex = undefined;
                            } else {

                                if(column.fixed ^ targetColumn.fixed) {
                                    column.visibleIndex = undefined;
                                } else {
                                    column.visibleIndex = targetColumn.visibleIndex;
                                }
                            }
                            updateColumnVisibleIndexes(that, column);
                        }

                        var isVisible = targetLocation !== COLUMN_CHOOSER_LOCATION,
                            changeType = isGroupMoving ? "grouping" : "columns";

                        if(column.visible !== isVisible) {
                            column.visible = isVisible;
                            updateColumnChanges(that, changeType, "visible", column.index);
                        } else {
                            updateColumnChanges(that, changeType);
                        }

                        fireColumnsChanged(that);
                    }
                },
                changeSortOrder: function(columnIndex, sortOrder) {
                    var that = this,
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

                                delete column.sortOrder;
                                delete column.sortIndex;
                            } else if(isDefined(column.groupIndex) || isDefined(column.sortIndex)) {
                                column.sortOrder = column.sortOrder === "desc" ? "asc" : "desc";
                            } else {
                                column.sortOrder = "asc";
                            }

                            return true;
                        },
                        isSortingChanged = false;

                    if(allowSorting && column && column.allowSorting) {
                        if(needResetSorting && !isDefined(column.groupIndex)) {
                            iteratorUtils.each(that._columns, function(index) {
                                if(index !== columnIndex && this.sortOrder && !isDefined(this.groupIndex)) {
                                    delete this.sortOrder;
                                    delete this.sortIndex;
                                    isSortingChanged = true;
                                }
                            });
                        }
                        if(isSortOrderValid(sortOrder)) {
                            if(column.sortOrder !== sortOrder) {
                                column.sortOrder = sortOrder;
                                isSortingChanged = true;
                            }
                        } else if(sortOrder === "none") {
                            if(column.sortOrder) {
                                delete column.sortIndex;
                                delete column.sortOrder;
                                isSortingChanged = true;
                            }
                        } else {
                            isSortingChanged = nextSortOrder(column);
                        }
                    }
                    if(isSortingChanged) {
                        updateColumnSortIndexes(that);
                        updateColumnChanges(that, "sorting");
                        fireColumnsChanged(that);
                    }
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
                        if(!isDefined(column.filterOperations)) {
                            column.filterOperations = !lookup && DATATYPE_OPERATIONS[dataType] || [];
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
                                    valueDataType = column.dataType || getValueDataType(value);
                                    dataType = dataType || valueDataType;
                                    if(dataType && valueDataType && dataType !== valueDataType) {
                                        dataType = "string";
                                    }
                                    if(lookup) {
                                        valueDataType = lookup.dataType || getValueDataType(gridCoreUtils.getDisplayValue(column, value, firstItems[i]));
                                        lookupDataType = lookupDataType || valueDataType;
                                        if(lookupDataType && valueDataType && lookupDataType !== valueDataType) {
                                            lookupDataType = "string";
                                        }
                                    }
                                }
                                column.dataType = dataType;
                                if(lookup) {
                                    lookup.dataType = lookupDataType;
                                }
                                if(dataType) {
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
                        customizeColumns = that.option("customizeColumns");

                    if(customizeColumns) {
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
                                filter[filter.length - 1] = column.serializeValue(filter[filter.length - 1]);
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
                 * @name GridBaseMethods_columnCount
                 * @publicName columnCount()
                 * @return number
                 */
                columnCount: function() {
                    return this._columns.length;
                },
                /**
                 * @name GridBaseMethods_columnOption
                 * @publicName columnOption(id)
                 * @param1 id:number|string
                 * @return object
                 */
                /**
                 * @name GridBaseMethods_columnOption
                 * @publicName columnOption(id, optionName)
                 * @param1 id:number|string
                 * @param2 optionName:string
                 * @return any
                 */
                /**
                 * @name GridBaseMethods_columnOption
                 * @publicName columnOption(id, optionName, optionValue)
                 * @param1 id:number|string
                 * @param2 optionName:string
                 * @param3 optionValue:any
                 */
                /**
                 * @name GridBaseMethods_columnOption
                 * @publicName columnOption(id, options)
                 * @param1 id:number|string
                 * @param2 options:object
                 */
                columnOption: function(identifier, option, value, notFireEvent) {
                    var that = this,
                        i,
                        identifierOptionName = typeUtils.isString(identifier) && identifier.substr(0, identifier.indexOf(":")),
                        columns = (identifier < 0 || identifierOptionName === "command") ? that._commandColumns : that._columns,
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
                 * @name GridBaseMethods_clearSorting
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
                 * @name dxDataGridMethods_clearGrouping
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
                 * @name dxDataGridMethods_addColumn
                 * @publicName addColumn(columnOptions)
                 * @param1 columnOptions:object|string
                 */
                /**
                 * @name dxTreeListMethods_addColumn
                 * @publicName addColumn(columnOptions)
                 * @param1 columnOptions:object|string
                 */
                addColumn: function(options) {
                    var that = this,
                        column = createColumn(that, options);

                    column.added = options;

                    that._columns.push(column);
                    updateIndexes(that, column);
                    that.updateColumns(that._dataSource);
                },
                /**
                 * @name GridBaseMethods_deleteColumn
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
                        return gridCoreUtils.defaultCalculateFilterExpression.apply(this, arguments);
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
                                    if(typeUtils.isObject(dataSource) || Array.isArray(dataSource)) {
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
