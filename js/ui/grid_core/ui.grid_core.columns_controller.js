import $ from "../../core/renderer";
import Callbacks from "../../core/utils/callbacks";
import { isWrapped } from "../../core/utils/variable_wrapper";
import dataCoreUtils from "../../core/utils/data";
import { grep } from "../../core/utils/common";
import { isDefined, isString, isNumeric, isFunction, isObject, isPlainObject, type } from "../../core/utils/type";
import iteratorUtils from "../../core/utils/iterator";
import { getDefaultAlignment } from "../../core/utils/position";
import { extend } from "../../core/utils/extend";
import { inArray } from "../../core/utils/array";
import config from "../../core/config";
import { orderEach, deepExtendArraySafe } from "../../core/utils/object";
import errors from "../widget/ui.errors";
import modules from "./ui.grid_core.modules";
import { isDateType, getFormatByDataType, getDisplayValue, normalizeSortingInfo, equalSortParameters } from "./ui.grid_core.utils";
import { normalizeIndexes } from "../../core/utils/array";
import inflector from "../../core/utils/inflector";
import dateSerialization from "../../core/utils/date_serialization";
import numberLocalization from "../../localization/number";
import dateLocalization from "../../localization/date";
import messageLocalization from "../../localization/message";
import { when, Deferred } from "../../core/utils/deferred";
import Store from "../../data/abstract_store";
import { DataSource, normalizeDataSourceOptions } from "../../data/data_source/data_source";
import filterUtils from "../shared/filtering";

var USER_STATE_FIELD_NAMES_15_1 = ["filterValues", "filterType", "fixed", "fixedPosition"],
    USER_STATE_FIELD_NAMES = ["visibleIndex", "dataField", "name", "dataType", "width", "visible", "sortOrder", "lastSortOrder", "sortIndex", "groupIndex", "filterValue", "selectedFilterOperation", "added"].concat(USER_STATE_FIELD_NAMES_15_1),
    IGNORE_COLUMN_OPTION_NAMES = { visibleWidth: true, bestFitWidth: true, bufferedFilterValue: true },
    COMMAND_EXPAND_CLASS = "dx-command-expand",
    MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991/* IE11 */,
    GROUP_COMMAND_COLUMN_NAME = "groupExpand";

var regExp = /columns\[(\d+)\]\.?/gi;

var globalColumnId = 1;

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
             * @type Array<GridBaseColumn, string>
             * @fires GridBaseOptions.onOptionChanged
             * @default undefined
             */
            /**
             * @name dxDataGridOptions.columns
             * @type Array<dxDataGridColumn,string>
             * @default undefined
             */
            /**
             * @name dxTreeListOptions.columns
             * @type Array<dxTreeListColumn,string>
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
             * @fires GridBaseOptions.onOptionChanged
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
             * @type Array<dxDataGridColumn,string>
             * @default undefined
             */
            /**
             * @name dxTreeListColumn.columns
             * @type Array<dxTreeListColumn,string>
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
             * @fires GridBaseOptions.onOptionChanged
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
             * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
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
             * @type_function_return void|Promise<void>
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
             * @fires GridBaseOptions.onOptionChanged
             */
            /**
             * @name GridBaseColumn.sortIndex
             * @type number
             * @default undefined
             * @fires GridBaseOptions.onOptionChanged
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
             * @name GridBaseColumn.filterOperations
             * @type Array<string>
             * @acceptValues "=" | "<>" | "<" | "<=" | ">" | ">=" | "notcontains" | "contains" | "startswith" | "endswith" | "between"
             * @default undefined
             */
            /**
             * @name GridBaseColumn.selectedFilterOperation
             * @type Enums.FilterOperations
             * @default undefined
             * @fires GridBaseOptions.onOptionChanged
             */
            /**
             * @name GridBaseColumn.filterValue
             * @type any
             * @default undefined
             * @fires GridBaseOptions.onOptionChanged
             */
            /**
             * @name GridBaseColumn.filterValues
             * @type Array<any>
             * @default undefined
             * @fires GridBaseOptions.onOptionChanged
            */
            /**
             * @name GridBaseColumn.filterType
             * @type Enums.FilterType
             * @default "include"
            */

            /**
             * @name dxDataGridColumn.cellTemplate
             * @type template|function
             * @type_function_param1 cellElement:dxElement
             * @type_function_param2 cellInfo:object
             * @type_function_param2_field1 data:object
             * @type_function_param2_field2 component:dxDataGrid
             * @type_function_param2_field3 value:any
             * @type_function_param2_field4 oldValue:any
             * @type_function_param2_field5 displayValue:any
             * @type_function_param2_field6 text:string
             * @type_function_param2_field7 columnIndex:number
             * @type_function_param2_field8 rowIndex:number
             * @type_function_param2_field9 column:dxDataGridColumn
             * @type_function_param2_field10 row:dxDataGridRowObject
             * @type_function_param2_field11 rowType:string
             * @type_function_param2_field12 watch:function
             */

            /**
            * @name dxTreeListColumn.cellTemplate
            * @type template|function
            * @type_function_param1 cellElement:dxElement
            * @type_function_param2 cellInfo:object
            * @type_function_param2_field1 data:object
            * @type_function_param2_field2 component:dxTreeList
            * @type_function_param2_field3 value:any
            * @type_function_param2_field4 oldValue:any
            * @type_function_param2_field5 displayValue:any
            * @type_function_param2_field6 text:string
            * @type_function_param2_field7 columnIndex:number
            * @type_function_param2_field8 rowIndex:number
            * @type_function_param2_field9 column:dxTreeListColumn
            * @type_function_param2_field10 row:dxTreeListRowObject
            * @type_function_param2_field11 rowType:string
            * @type_function_param2_field12 watch:function
            */

            /**
             * @name dxDataGridColumn.headerCellTemplate
             * @type template|function
             * @type_function_param1 columnHeader:dxElement
             * @type_function_param2 headerInfo:object
             * @type_function_param2_field1 component:dxDataGrid
             * @type_function_param2_field2 columnIndex:number
             * @type_function_param2_field3 column:dxDataGridColumn
             */

            /**
             * @name dxTreeListColumn.headerCellTemplate
             * @type template|function
             * @type_function_param1 columnHeader:dxElement
             * @type_function_param2 headerInfo:object
             * @type_function_param2_field1 component:dxTreeList
             * @type_function_param2_field2 columnIndex:number
             * @type_function_param2_field3 column:dxTreeListColumn
             */

            /**
             * @name dxDataGridColumn.editCellTemplate
             * @type template|function
             * @type_function_param1 cellElement:dxElement
             * @type_function_param2 cellInfo:object
             * @type_function_param2_field1 setValue(newValue, newText):any
             * @type_function_param2_field2 data:object
             * @type_function_param2_field3 component:dxDataGrid
             * @type_function_param2_field4 value:any
             * @type_function_param2_field5 displayValue:any
             * @type_function_param2_field6 text:string
             * @type_function_param2_field7 columnIndex:number
             * @type_function_param2_field8 rowIndex:number
             * @type_function_param2_field9 column:dxDataGridColumn
             * @type_function_param2_field10 row:dxDataGridRowObject
             * @type_function_param2_field11 rowType:string
             * @type_function_param2_field12 watch:function
             */

            /**
             * @name dxTreeListColumn.editCellTemplate
             * @type template|function
             * @type_function_param1 cellElement:dxElement
             * @type_function_param2 cellInfo:object
             * @type_function_param2_field1 setValue(newValue, newText):any
             * @type_function_param2_field2 data:object
             * @type_function_param2_field3 component:dxTreeList
             * @type_function_param2_field4 value:any
             * @type_function_param2_field5 displayValue:any
             * @type_function_param2_field6 text:string
             * @type_function_param2_field7 columnIndex:number
             * @type_function_param2_field8 rowIndex:number
             * @type_function_param2_field9 column:dxTreeListColumn
             * @type_function_param2_field10 row:dxTreeListRowObject
             * @type_function_param2_field11 rowType:string
             * @type_function_param2_field12 watch:function
             */

            /**
             * @name dxDataGridColumn.groupCellTemplate
             * @type template|function
             * @type_function_param1 cellElement:dxElement
             * @type_function_param2 cellInfo:object
             * @type_function_param2_field1 data:object
             * @type_function_param2_field2 component:dxDataGrid
             * @type_function_param2_field3 value:any
             * @type_function_param2_field4 text:string
             * @type_function_param2_field5 displayValue:any
             * @type_function_param2_field6 columnIndex:number
             * @type_function_param2_field7 rowIndex:number
             * @type_function_param2_field8 column:dxDataGridColumn
             * @type_function_param2_field9 row:dxDataGridRowObject
             * @type_function_param2_field10 summaryItems:Array<any>
             * @type_function_param2_field11 groupContinuesMessage:string
             * @type_function_param2_field12 groupContinuedMessage:string
             */
            /**
             * @name dxDataGridColumn.groupIndex
             * @type number
             * @default undefined
             * @fires dxDataGridOptions.onOptionChanged
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
             * @name GridBaseColumn.renderAsync
             * @type boolean
             * @default false
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
             * @name GridBaseColumn.editorOptions
             * @type object
             */
            /**
             * @name GridBaseColumn.formItem
             * @type dxFormSimpleItem
             */
            /**
             * @name dxDataGridColumn.type
             * @publicName type
             * @type Enums.GridCommandColumnType
             */
            /**
             * @name dxTreeListColumn.type
             * @publicName type
             * @type Enums.TreeListCommandColumnType
             */
            /**
             * @name dxDataGridColumn.buttons
             * @type Array<Enums.GridColumnButtonName,dxDataGridColumnButton>
             */
            /**
             * @name dxTreeListColumn.buttons
             * @type Array<Enums.TreeListColumnButtonName,dxTreeListColumnButton>
             */
            /**
             * @name GridBaseColumnButton
             * @type Object
             */
            /**
             * @name GridBaseColumnButton.text
             * @type string
             */
            /**
             * @name GridBaseColumnButton.icon
             * @type string
             */
            /**
             * @name GridBaseColumnButton.hint
             * @type string
             */
            /**
             * @name GridBaseColumnButton.cssClass
             * @type string
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
            /**
             * @name dxDataGridColumnButton.name
             * @type Enums.GridColumnButtonName|string
             */
            /**
             * @name dxTreeListColumnButton.name
             * @type Enums.TreeListColumnButtonName|string
             */
            /**
             * @name dxDataGridColumnButton.onClick
             * @type function(e)|string
             * @type_function_param1 e:object
             * @type_function_param1_field1 component:dxDataGrid
             * @type_function_param1_field2 element:dxElement
             * @type_function_param1_field3 model:object
             * @type_function_param1_field4 event:event
             * @type_function_param1_field5 row:dxDataGridRowObject
             * @type_function_param1_field6 column:dxDataGridColumn
             */
            /**
             * @name dxTreeListColumnButton.onClick
             * @type function(e)|string
             * @type_function_param1 e:object
             * @type_function_param1_field1 component:dxTreeList
             * @type_function_param1_field2 element:dxElement
             * @type_function_param1_field3 model:object
             * @type_function_param1_field4 event:event
             * @type_function_param1_field5 row:dxTreeListRowObject
             * @type_function_param1_field6 column:dxTreeListColumn
             */
            /**
             * @name dxDataGridColumnButton.visible
             * @type boolean|function
             * @default true
             * @type_function_param1 options:object
             * @type_function_param1_field1 component:dxDataGrid
             * @type_function_param1_field2 row:dxDataGridRowObject
             * @type_function_param1_field3 column:dxDataGridColumn
             * @type_function_return Boolean
             */
            /**
             * @name dxTreeListColumnButton.visible
             * @type boolean|function
             * @default true
             * @type_function_param1 options:object
             * @type_function_param1_field1 component:dxTreeList
             * @type_function_param1_field2 row:dxTreeListRowObject
             * @type_function_param1_field3 column:dxTreeListColumn
             * @type_function_return Boolean
             */
            /**
             * @name dxDataGridColumnButton.template
             * @type template|function
             * @type_function_param1 cellElement:dxElement
             * @type_function_param2 cellInfo:object
             * @type_function_param2_field1 component:dxDataGrid
             * @type_function_param2_field2 data:object
             * @type_function_param2_field3 key:any
             * @type_function_param2_field4 columnIndex:number
             * @type_function_param2_field5 column:dxDataGridColumn
             * @type_function_param2_field6 rowIndex:number
             * @type_function_param2_field7 rowType:string
             * @type_function_param2_field8 row:dxDataGridRowObject
             * @type_function_return string|Node|jQuery
             */
            /**
             * @name dxTreeListColumnButton.template
             * @type template|function
             * @type_function_param1 cellElement:dxElement
             * @type_function_param2 cellInfo:object
             * @type_function_param2_field1 component:dxTreeList
             * @type_function_param2_field2 data:object
             * @type_function_param2_field3 key:any
             * @type_function_param2_field4 columnIndex:number
             * @type_function_param2_field5 column:dxTreeListColumn
             * @type_function_param2_field6 rowIndex:number
             * @type_function_param2_field7 rowType:string
             * @type_function_param2_field8 row:dxTreeListRowObject
             * @type_function_return string|Node|jQuery
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

            var setFilterOperationsAsDefaultValues = function(column) {
                column.filterOperations = column.defaultFilterOperations;
            };

            var createColumn = function(that, columnOptions, userStateColumnOptions, bandColumn) {
                var commonColumnOptions = {},
                    calculatedColumnOptions;

                if(columnOptions) {
                    if(isString(columnOptions)) {
                        columnOptions = {
                            dataField: columnOptions
                        };
                    }

                    let result = { };
                    if(columnOptions.command) {
                        result = deepExtendArraySafe(commonColumnOptions, columnOptions);
                    } else {
                        commonColumnOptions = that.getCommonSettings(columnOptions);
                        if(userStateColumnOptions && userStateColumnOptions.name && userStateColumnOptions.dataField) {
                            columnOptions = extend({}, columnOptions, { dataField: userStateColumnOptions.dataField });
                        }
                        calculatedColumnOptions = that._createCalculatedColumnOptions(columnOptions, bandColumn);
                        if(columnOptions.dataField && !columnOptions.type) {
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
                    columns,
                    bandColumnsCache = that.getBandColumnsCache(),
                    callbackFilter = function(column) {
                        var ownerBand = result ? result.index : undefined;
                        return column.ownerBand === ownerBand;
                    };

                if(bandColumnsCache.isPlain) {
                    result = that._columns[columnIndexes[0]];
                } else {
                    columns = that._columns.filter(callbackFilter);

                    for(var i = 0; i < columnIndexes.length; i++) {
                        result = columns[columnIndexes[i]];

                        if(result) {
                            columns = that._columns.filter(callbackFilter);
                        }
                    }
                }

                return result;
            };

            var getColumnFullPath = function(that, column) {
                var result = [],
                    columns,
                    bandColumnsCache = that.getBandColumnsCache(),
                    callbackFilter = function(item) {
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

                return result.join(".");
            };

            var calculateColspan = function(that, columnID) {
                var colspan = 0,
                    columns = that.getChildrenByBandColumn(columnID, true);

                iteratorUtils.each(columns, function(_, column) {
                    if(column.isBand) {
                        column.colspan = column.colspan || calculateColspan(that, column.index);
                        colspan += column.colspan || 1;
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
                var dataType = type(value);
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
                        if(isString(value)) {
                            return "string";
                        }

                        if(isNumeric(value)) {
                            return null;
                        }
                }
            };

            var updateSerializers = function(options, dataType) {
                if(!options.deserializeValue) {
                    if(isDateType(dataType)) {
                        options.deserializeValue = function(value) {
                            return dateSerialization.deserializeDate(value);
                        };
                        options.serializeValue = function(value) {
                            return isString(value) ? value : dateSerialization.serializeDate(value, this.serializationFormat);
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
                            if(!isFunction(firstItems[i][fieldName]) || isWrapped(firstItems[i][fieldName])) {
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
                    if(isObject(column.ownerBand)) {
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
                var rowIndex = isObject(visibleIndex) ? visibleIndex.rowIndex : null,
                    columns = location === GROUP_LOCATION ? that.getGroupColumns() : location === COLUMN_CHOOSER_LOCATION ? that.getChooserColumns() : that.getVisibleColumns(rowIndex),
                    column;

                visibleIndex = isObject(visibleIndex) ? visibleIndex.columnIndex : visibleIndex;
                column = columns[visibleIndex];

                if(column && column.type === GROUP_COMMAND_COLUMN_NAME) {
                    column = that._columns.filter((col) => column.type === col.type)[0] || column;
                }

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
                            if(fieldName === "selectedFilterOperation" && userStateColumn[fieldName]) {
                                column.defaultSelectedFilterOperation = column[fieldName] || null;
                            }
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

                    var hasAddedBands = false;
                    for(i = 0; i < columnsUserState.length; i++) {
                        columnUserState = columnsUserState[i];
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

            var updateIndexes = function(that, column) {
                updateColumnIndexes(that);
                updateColumnGroupIndexes(that, column);
                updateColumnSortIndexes(that, column);

                resetBandColumnsCache(that);
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
                    columnChanges = that._columnChanges,
                    reinitOptionNames = ["dataField", "lookup", "dataType", "columns"],
                    needReinit = (options) => options && reinitOptionNames.some(name => options[name]);

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

                if(!IGNORE_COLUMN_OPTION_NAMES[optionName] && !that._skipProcessingColumnsChange) {
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
                    fullOptionName,
                    initialColumn;

                if(arguments.length === 3) {
                    return optionGetter(column, { functionsAsIs: true });
                }
                prevValue = optionGetter(column, { functionsAsIs: true });
                if(prevValue !== value) {
                    if(optionName === "groupIndex" || optionName === "calculateGroupValue") {
                        changeType = "grouping";
                        updateSortOrderWhenGrouping(column, value, prevValue);
                    } else if(optionName === "sortIndex" || optionName === "sortOrder" || optionName === "calculateSortValue") {
                        changeType = "sorting";
                    } else {
                        changeType = "columns";
                    }

                    optionSetter = dataCoreUtils.compileSetter(optionName);
                    optionSetter(column, value, { functionsAsIs: true });
                    fullOptionName = getColumnFullPath(that, column);

                    if(COLUMN_INDEX_OPTIONS[optionName]) {
                        updateIndexes(that, column);
                        value = optionGetter(column);
                    }

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

            var getRowCount = function(that) {
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

            var getFixedPosition = function(that, column) {
                var rtlEnabled = that.option("rtlEnabled");

                if(column.command && !isCustomCommandColumn(that, column) || !column.fixedPosition) {
                    return rtlEnabled ? "right" : "left";
                }

                return column.fixedPosition;
            };

            var processExpandColumns = function(columns, expandColumns, type, columnIndex) {
                var customColumnIndex,
                    rowCount = this.getRowCount(),
                    rowspan = columns[columnIndex] && columns[columnIndex].rowspan,
                    expandColumnsByType = expandColumns.filter((column) => column.type === type);

                columns.forEach((column, index) => {
                    if(column.type === type) {
                        customColumnIndex = index;
                        rowspan = columns[index + 1] ? columns[index + 1].rowspan : rowCount;
                    }
                });

                if(rowspan > 1) {
                    expandColumnsByType = iteratorUtils.map(expandColumnsByType, function(expandColumn) { return extend({}, expandColumn, { rowspan: rowspan }); });
                }
                expandColumnsByType.unshift.apply(expandColumnsByType, isDefined(customColumnIndex) ? [customColumnIndex, 1] : [columnIndex, 0]);
                columns.splice.apply(columns, expandColumnsByType);

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

            var mergeColumns = (that, columns, commandColumns, needToExtend) => {
                var i,
                    column,
                    columnOptions,
                    commandColumnIndex,
                    result = columns.slice().map(column => extend({}, column)),
                    isColumnFixing = that._isColumnFixing(),
                    defaultCommandColumns = commandColumns.slice().map(column => extend({ fixed: isColumnFixing }, column)),
                    getCommandColumnIndex = (column) => commandColumns.reduce((result, commandColumn, index) => {
                        var columnType = needToExtend && column.type === GROUP_COMMAND_COLUMN_NAME ? "expand" : column.type;
                        return commandColumn.type === columnType || commandColumn.command === column.command ? index : result;
                    }, -1),
                    callbackFilter = (commandColumn) => commandColumn.command !== commandColumns[commandColumnIndex].command;

                for(i = 0; i < columns.length; i++) {
                    column = columns[i];

                    commandColumnIndex = column && (column.type || column.command) ? getCommandColumnIndex(column) : -1;
                    if(commandColumnIndex >= 0) {
                        if(needToExtend) {
                            result[i] = extend({ fixed: isColumnFixing }, commandColumns[commandColumnIndex], column);
                            if(column.type !== GROUP_COMMAND_COLUMN_NAME) {
                                defaultCommandColumns = defaultCommandColumns.filter(callbackFilter);
                            }
                        } else {
                            columnOptions = {
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

            var isCustomCommandColumn = (that, commandColumn) => !!that._columns.filter((column) => column.type === commandColumn.type).length;

            var isColumnFixed = (that, column) => isDefined(column.fixed) || !column.type ? column.fixed : that._isColumnFixing();

            var convertOwnerBandToColumnReference = (columns) => {
                columns.forEach((column) => {
                    if(isDefined(column.ownerBand)) {
                        column.ownerBand = columns[column.ownerBand];
                    }
                });
            };

            var resetBandColumnsCache = (that) => that._bandColumnsCache = undefined;

            return {
                _getExpandColumnOptions: function() {
                    return {
                        type: "expand",
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
                    !this._skipProcessingColumnsChange && fireColumnsChanged(this);
                },
                init: function() {
                    var that = this,
                        columns = that.option("columns");

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
                        case "adaptColumnWidthByRatio":
                            args.handled = true;
                            break;
                        case "dataSource":
                            if(args.value !== args.previousValue && !this.option("columns") && (!Array.isArray(args.value) || !Array.isArray(args.previousValue))) {
                                this._columns = [];
                            }
                            break;
                        case "columns":
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
                        case "columnWidth": {
                            args.handled = true;
                            let ignoreColumnOptionNames = args.fullName === "columnWidth" && ["width"],
                                isEditingPopup = args.fullName && args.fullName.indexOf("editing.popup") === 0,
                                isEditingForm = args.fullName && args.fullName.indexOf("editing.form") === 0;

                            if(!isEditingPopup && !isEditingForm) {
                                this.reinit(ignoreColumnOptionNames);
                            }
                            break;
                        }
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
                        this._skipProcessingColumnsChange = true;
                        this.columnOption(column.index, columnOptionValue);
                        this._skipProcessingColumnsChange = false;
                    }
                },

                _updateRequireResize: function(args) {
                    var component = this.component;

                    if(args.fullName.replace(regExp, "") === "width" && component._updateLockCount) {
                        component._requireResize = true;
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
                    return !!this._columns.length || !!this.option("columns");
                },
                isDataSourceApplied: function() {
                    return this._dataSourceApplied;
                },
                getCommonSettings: function(column) {
                    var commonColumnSettings = (!column || !column.type) && this.option("commonColumnSettings") || {},
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
                getFilteringColumns: function() {
                    return this.getColumns().filter(item => (item.dataField || item.name) && (item.allowFiltering || item.allowHeaderFiltering)).map(item => {
                        let field = extend(true, {}, item);
                        if(!isDefined(field.dataField)) {
                            field.dataField = field.name;
                        }
                        field.filterOperations = item.filterOperations !== item.defaultFilterOperations ? field.filterOperations : null;
                        return field;
                    });
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
                        expandColumn,
                        firstGroupColumn = expandColumns.filter((column) => column.groupIndex === 0)[0],
                        isFixedFirstGroupColumn = firstGroupColumn && firstGroupColumn.fixed,
                        isColumnFixing = this._isColumnFixing();

                    if(expandColumns.length) {
                        expandColumn = this.columnOption("command:expand");
                    }

                    expandColumns = iteratorUtils.map(expandColumns, (column) => {
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
                        var columns = this._columns,
                            columnChildrenByIndex = {},
                            columnParentByIndex = {},
                            isPlain = true;

                        columns.forEach(function(column) {
                            var parentIndex = column.ownerBand,
                                parent = columns[parentIndex];

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
                    var that = this,
                        i,
                        result = [],
                        rowspanGroupColumns = 0,
                        rowspanExpandColumns = 0,
                        firstPositiveIndexColumn,
                        rowCount = that.getRowCount(),
                        positiveIndexedColumns = [],
                        negativeIndexedColumns = [],
                        notGroupedColumnsCount = 0,
                        isFixedToEnd,
                        rtlEnabled = that.option("rtlEnabled"),
                        bandColumnsCache = that.getBandColumnsCache(),
                        expandColumns = mergeColumns(that, that.getExpandColumns(), that._columns),
                        columns = mergeColumns(that, that._columns, that._commandColumns, true),
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

                                if(column.fixed) {
                                    isFixedToEnd = column.fixedPosition === "right";

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

                    iteratorUtils.each(result, function(rowIndex) {
                        orderEach(negativeIndexedColumns[rowIndex], function(_, columns) {
                            result[rowIndex].unshift.apply(result[rowIndex], columns);
                        });

                        firstPositiveIndexColumn = result[rowIndex].length;
                        iteratorUtils.each(positiveIndexedColumns[rowIndex], function(index, columnsByFixing) {
                            orderEach(columnsByFixing, function(_, columnsByVisibleIndex) {
                                result[rowIndex].push.apply(result[rowIndex], columnsByVisibleIndex);
                            });
                        });

                        // The order of processing is important
                        if(rowspanExpandColumns < (rowIndex + 1)) {
                            rowspanExpandColumns += processExpandColumns.call(that, result[rowIndex], expandColumns, "detailExpand", firstPositiveIndexColumn);
                        }

                        if(rowspanGroupColumns < (rowIndex + 1)) {
                            rowspanGroupColumns += processExpandColumns.call(that, result[rowIndex], expandColumns, GROUP_COMMAND_COLUMN_NAME, firstPositiveIndexColumn);
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
                    var that = this,
                        options = {},
                        prevGroupIndex,
                        fromIndex = getColumnIndexByVisibleIndex(that, fromVisibleIndex, sourceLocation),
                        toIndex = getColumnIndexByVisibleIndex(that, toVisibleIndex, targetLocation),
                        targetGroupIndex,
                        column;

                    if(fromIndex >= 0) {
                        column = that._columns[fromIndex];
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
                            var targetColumn = that._columns[toIndex];

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
                        if(isFunction(calculateCallback) && !calculateCallback.originalCallback) {
                            column[calculateCallbackName] = function(data) { return calculateCallback.call(column, data); };
                            column[calculateCallbackName].originalCallback = calculateCallback;
                        }
                    });

                    if(isString(column.calculateDisplayValue)) {
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
                        column.format = column.format || getFormatByDataType(dataType);
                        column.customizeText = column.customizeText || getCustomizeTextByDataType(dataType);
                        column.defaultFilterOperations = column.defaultFilterOperations || !lookup && DATATYPE_OPERATIONS[dataType] || [];
                        if(!isDefined(column.filterOperations)) {
                            setFilterOperationsAsDefaultValues(column);
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

                        if(isDateType(column.dataType) && column.serializationFormat === undefined) {
                            column.serializationFormat = dateSerializationFormat;
                        }
                        if(lookup && isDateType(lookup.dataType) && column.serializationFormat === undefined) {
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
                                        valueDataType = getValueDataType(getDisplayValue(column, value, firstItems[i]));
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
                            return isObject(column.ownerBand);
                        });

                        if(hasOwnerBand) {
                            updateIndexes(that);
                        }

                        customizeColumns(columns);
                        assignColumns(that, createColumnsFromOptions(that, columns));
                    }
                },
                _checkAsyncValidationRules: function() {
                    const currentEditMode = this.option("editing.mode");
                    if(currentEditMode !== "form" && currentEditMode !== "popup") {
                        const hasAsyncRules = this._columns.some(function(col) {
                            return (col.validationRules || []).some(rule => rule.type === "async");
                        });
                        if(hasAsyncRules) {
                            errors.log("E1057", this.component.NAME, currentEditMode);
                        }
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

                        that._checkAsyncValidationRules();

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

                updateFilter: function(filter, remoteFiltering, columnIndex, filterValue) {
                    var that = this;

                    if(!Array.isArray(filter)) return filter;

                    var column,
                        i;

                    filter = extend([], filter);

                    columnIndex = filter.columnIndex !== undefined ? filter.columnIndex : columnIndex;
                    filterValue = filter.filterValue !== undefined ? filter.filterValue : filterValue;

                    if(isString(filter[0])) {
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
                    } else if(isFunction(filter[0])) {
                        filter[0].columnIndex = columnIndex;
                        filter[0].filterValue = filterValue;
                    }

                    for(i = 0; i < filter.length; i++) {
                        filter[i] = that.updateFilter(filter[i], remoteFiltering, columnIndex, filterValue);
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
                        identifierOptionName = isString(identifier) && identifier.substr(0, identifier.indexOf(":")),
                        columns = that._columns.concat(that._commandColumns),
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
                        if(isString(option)) {
                            if(arguments.length === 2) {
                                return columnOptionCore(that, column, option);
                            } else {
                                columnOptionCore(that, column, option, value, notFireEvent);
                            }
                        } else if(isObject(option)) {
                            iteratorUtils.each(option, function(optionName, value) {
                                columnOptionCore(that, column, optionName, value, notFireEvent);
                            });
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
                        childIndexes,
                        column = that.columnOption(id);

                    if(column && column.index >= 0) {
                        convertOwnerBandToColumnReference(that._columns);
                        that._columns.splice(column.index, 1);

                        if(column.isBand) {
                            childIndexes = that.getChildrenByBandColumn(column.index).map((column) => column.index);
                            that._columns = that._columns.filter((column) => childIndexes.indexOf(column.index) < 0);
                        }

                        updateIndexes(that);
                        that.updateColumns(that._dataSource);
                    }
                },
                addCommandColumn: function(options) {
                    var commandColumn = this._commandColumns.filter((column) => column.command === options.command)[0];

                    if(!commandColumn) {
                        commandColumn = options;
                        this._commandColumns.push(commandColumn);
                    }
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
                        dataSource = that._dataSource,
                        ignoreColumnOptionNames = that.option("stateStoring.ignoreColumnOptionNames");

                    if(!ignoreColumnOptionNames) {
                        ignoreColumnOptionNames = [];
                        commonColumnSettings = that.getCommonSettings();

                        if(!that.option("columnChooser.enabled")) ignoreColumnOptionNames.push("visible");
                        if(that.option("sorting.mode") === "none") ignoreColumnOptionNames.push("sortIndex", "sortOrder");
                        if(!commonColumnSettings.allowGrouping) ignoreColumnOptionNames.push("groupIndex");
                        if(!commonColumnSettings.allowFixing) ignoreColumnOptionNames.push("fixed", "fixedPosition");
                        if(!commonColumnSettings.allowResizing) ignoreColumnOptionNames.push("width", "visibleWidth");

                        const isFilterPanelHidden = !that.option("filterPanel.visible");
                        if(!that.option("filterRow.visible") && isFilterPanelHidden) ignoreColumnOptionNames.push("filterValue", "selectedFilterOperation");
                        if(!that.option("headerFilter.visible") && isFilterPanelHidden) ignoreColumnOptionNames.push("filterValues", "filterType");
                    }

                    that._columnsUserState = state;
                    that._ignoreColumnOptionNames = ignoreColumnOptionNames;
                    that._hasUserState = !!state;

                    updateColumnChanges(that, "filtering");
                    updateColumnChanges(that, "grouping");

                    that.init();

                    if(dataSource) {
                        dataSource.sort(null);
                        dataSource.group(null);
                    }
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
                        if(isString(dataField)) {
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
                                        if(isString(text) && column.format) {
                                            parsedValue = numberLocalization.parse(text);

                                            if(isNumeric(parsedValue)) {
                                                result = parsedValue;
                                            }
                                        } else if(isDefined(text) && isNumeric(text)) {
                                            result = Number(text);
                                        }
                                    } else if(column.dataType === "boolean") {
                                        if(text === column.trueText) {
                                            result = true;
                                        } else if(text === column.falseText) {
                                            result = false;
                                        }
                                    } else if(isDateType(column.dataType)) {
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
                        var result;
                        if(this.calculateFilterExpression) {
                            result = this.calculateFilterExpression.apply(this, arguments);
                        }
                        if(isFunction(result)) {
                            result = [result, "=", true];
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
                    if(columnOptions.selectedFilterOperation && !("defaultSelectedFilterOperation" in calculatedColumnOptions)) {
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
                                    if(isFunction(dataSource) && !isWrapped(dataSource)) {
                                        dataSource = dataSource({});
                                    }
                                    if(isPlainObject(dataSource) || (dataSource instanceof Store) || Array.isArray(dataSource)) {
                                        if(that.valueExpr) {
                                            dataSourceOptions = normalizeDataSourceOptions(dataSource);
                                            dataSourceOptions.paginate = false;
                                            dataSource = new DataSource(dataSourceOptions);
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
                        if(isFunction(calculatedColumnOptions[optionName]) && optionName.indexOf("default") !== 0) {
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
                },
                getColumnId: function(column) {
                    if(column.command && column.type === GROUP_COMMAND_COLUMN_NAME) {
                        if(isCustomCommandColumn(this, column)) {
                            return "type:" + column.type;
                        }

                        return "command:" + column.command;
                    }

                    return column.index;
                }
            };
        })())
    }
};
