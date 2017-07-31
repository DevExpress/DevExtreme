"use strict";

var $ = require("../../core/renderer"),
    gridCoreUtils = require("./ui.grid_core.utils"),
    grep = require("../../core/utils/common").grep,
    each = require("../../core/utils/iterator").each,
    isDefined = require("../../core/utils/type").isDefined;

var MASTER_DETAIL_CELL_CLASS = "dx-master-detail-cell",
    MASTER_DETAIL_ROW_CLASS = "dx-master-detail-row",
    CELL_FOCUS_DISABLED_CLASS = "dx-cell-focus-disabled",
    ROW_LINES_CLASS = "dx-row-lines";


module.exports = {
    defaultOptions: function() {
        return {
            /**
             * @name dxDataGridOptions_masterDetail
             * @publicName masterDetail
             * @type object
             */
            masterDetail: {
                /**
                 * @name dxDataGridOptions_masterDetail_enabled
                 * @publicName enabled
                 * @type boolean
                 * @default false
                 */
                enabled: false,
                /**
                 * @name dxDataGridOptions_masterDetail_autoExpandAll
                 * @publicName autoExpandAll
                 * @type boolean
                 * @default false
                 */
                autoExpandAll: false,
                /**
                 * @name dxDataGridOptions_masterDetail_template
                 * @publicName template
                 * @type template
                 * @type_function_param1 detailElement:jQuery
                 * @type_function_param2 detailInfo:object
                 * @type_function_param2_field1 key:any
                 * @type_function_param2_field2 data:object
                 */
                template: null
            }
        };
    },
    extenders: {
        controllers: {
            columns: {
                _getExpandColumnsCore: function() {
                    var expandColumns = this.callBase();

                    if(this.option("masterDetail.enabled")) {
                        expandColumns.push({});
                    }
                    return expandColumns;
                }
            },
            data: (function() {
                var initMasterDetail = function(that) {
                    that._expandedItems = [];
                    that._isExpandAll = that.option("masterDetail.autoExpandAll");
                };

                return {
                    init: function() {
                        var that = this;

                        initMasterDetail(that);
                        that.callBase();
                    },
                    expandAll: function(groupIndex) {
                        var that = this;

                        if(groupIndex < 0) {
                            that._isExpandAll = true;
                            that._expandedItems = [];
                            that.updateItems();
                        } else {
                            that.callBase.apply(that, arguments);
                        }
                    },
                    collapseAll: function(groupIndex) {
                        var that = this;

                        if(groupIndex < 0) {
                            that._isExpandAll = false;
                            that._expandedItems = [];
                            that.updateItems();
                        } else {
                            that.callBase.apply(that, arguments);
                        }
                    },
                    isRowExpanded: function(key) {
                        var that = this,
                            expandIndex = gridCoreUtils.getIndexByKey(key, that._expandedItems);

                        if(Array.isArray(key)) {
                            return that.callBase.apply(that, arguments);
                        } else {
                            return !!(that._isExpandAll ^ (expandIndex >= 0 && that._expandedItems[expandIndex].visible));
                        }
                    },
                    _getRowIndicesForExpand: function(key) {
                        var rowIndex = this.getRowIndexByKey(key);

                        return [rowIndex, rowIndex + 1];
                    },
                    _changeRowExpandCore: function(key) {
                        var that = this,
                            expandIndex;

                        if(Array.isArray(key)) {
                            return that.callBase.apply(that, arguments);
                        } else {
                            expandIndex = gridCoreUtils.getIndexByKey(key, that._expandedItems);
                            if(expandIndex >= 0) {
                                var visible = that._expandedItems[expandIndex].visible;

                                that._expandedItems[expandIndex].visible = !visible;
                            } else {
                                that._expandedItems.push({ key: key, visible: true });
                            }

                            that.updateItems({
                                changeType: "update",
                                rowIndices: that._getRowIndicesForExpand(key)
                            });
                        }
                    },
                    _processDataItem: function(data, options) {
                        var that = this,
                            dataItem = that.callBase.apply(that, arguments);

                        dataItem.isExpanded = that.isRowExpanded(dataItem.key);

                        if(options.detailColumnIndex === undefined) {
                            options.detailColumnIndex = -1;
                            each(options.visibleColumns, function(index, column) {
                                if(column.command === "expand" && !isDefined(column.groupIndex)) {
                                    options.detailColumnIndex = index;
                                    return false;
                                }
                            });
                        }
                        if(options.detailColumnIndex >= 0) {
                            dataItem.values[options.detailColumnIndex] = dataItem.isExpanded;
                        }
                        return dataItem;
                    },
                    _processItems: function(items, changeType) {
                        var that = this,
                            expandIndex,
                            result = [];

                        items = that.callBase.apply(that, arguments);

                        if(changeType === "loadingAll") {
                            return items;
                        }

                        if(changeType === "refresh") {
                            that._expandedItems = grep(that._expandedItems, function(item) { return item.visible; });
                        }

                        each(items, function(index, item) {
                            result.push(item);
                            expandIndex = gridCoreUtils.getIndexByKey(item.key, that._expandedItems);

                            if(item.rowType === "data" && (item.isExpanded || expandIndex >= 0) && !item.inserted) {
                                result.push({
                                    visible: item.isExpanded,
                                    rowType: "detail",
                                    key: item.key,
                                    data: item.data,
                                    values: []
                                });
                            }
                        });

                        return result;
                    },
                    optionChanged: function(args) {
                        var that = this,
                            value,
                            previousValue,
                            isEnabledChanged,
                            isAutoExpandAllChanged;

                        if(args.name === "masterDetail") {
                            args.name = "dataSource";

                            switch(args.fullName) {
                                case "masterDetail":
                                    value = args.value || {};
                                    previousValue = args.previousValue || {};
                                    isEnabledChanged = value.enabled !== previousValue.enabled;
                                    isAutoExpandAllChanged = value.autoExpandAll !== previousValue.autoExpandAll;
                                    break;

                                case "masterDetail.enabled":
                                    isEnabledChanged = true;
                                    break;

                                case "masterDetail.autoExpandAll":
                                    isAutoExpandAllChanged = true;
                                    break;
                            }
                            if(isEnabledChanged || isAutoExpandAllChanged) {
                                initMasterDetail(that);
                            }
                        }
                        that.callBase(args);
                    }
                };
            })()
        },
        views: {
            rowsView: (function() {
                return {
                    _getCellTemplate: function(options) {
                        var that = this,
                            column = options.column,
                            editingController = that.getController("editing"),
                            isEditRow = editingController && editingController.isEditRow(options.rowIndex),
                            template;

                        if(column.command === "detail" && !isEditRow) {
                            template = that.option("masterDetail.template") || that._getDefaultTemplate(column);
                        } else {
                            template = that.callBase.apply(that, arguments);
                        }

                        return template;
                    },

                    _cellPrepared: function($cell, options) {
                        var that = this,
                            component = that.component;

                        that.callBase.apply(that, arguments);

                        if(that._isFixedColumns && options.rowType === "detail" && options.column.command === "detail") {
                            $cell.find("." + that.getWidgetContainerClass()).each(function() {
                                var dataGrid = $(this).parent().data("dxDataGrid");

                                if(dataGrid) {
                                    dataGrid.on("contentReady", function() {
                                        var $rows = component.getRowElement(options.rowIndex);
                                        if($rows && $rows.length === 2 && $rows.eq(0).height() !== $rows.eq(1).height()) {
                                            component.updateDimensions();
                                        }
                                    });
                                }
                            });
                        }
                    },

                    _isDetailRow: function(row) {
                        return row && row.rowType && row.rowType.indexOf("detail") === 0;
                    },

                    _createRow: function(row) {
                        var $row = this.callBase(row);

                        if(row && this._isDetailRow(row)) {
                            this.option("showRowLines") && $row.addClass(ROW_LINES_CLASS);
                            $row.addClass(MASTER_DETAIL_ROW_CLASS);

                            if(isDefined(row.visible)) {
                                $row.toggle(row.visible);
                            }
                        }
                        return $row;
                    },

                    _getGroupCellOptions: function(options) {
                        var row = options.row,
                            groupColumns = this._columnsController.getGroupColumns(),
                            columnIndex = groupColumns.length + options.columnsCountBeforeGroups,
                            emptyCellsCount = columnIndex + Number(this.option("masterDetail.enabled"));

                        if(row && this._isDetailRow(row)) {
                            return {
                                columnIndex: columnIndex,
                                emptyCellsCount: emptyCellsCount,
                                colspan: options.columns.length - emptyCellsCount
                            };
                        }

                        return this.callBase(options);
                    },

                    _renderCells: function($row, options) {
                        var row = options.row,
                            $detailCell,
                            groupCellOptions,
                            i;

                        if(row.rowType && this._isDetailRow(row)) {
                            groupCellOptions = this._getGroupCellOptions(options);
                            for(i = 0; i < groupCellOptions.emptyCellsCount; i++) {
                                this._renderCell($row, {
                                    value: null,
                                    row: row,
                                    rowIndex: row.rowIndex,
                                    column: options.columns[i]
                                });
                            }

                            $detailCell = this._renderCell($row, {
                                value: null,
                                row: row,
                                rowIndex: row.rowIndex,
                                column: { command: "detail" },
                                columnIndex: groupCellOptions.columnIndex
                            });

                            $detailCell
                                .addClass(CELL_FOCUS_DISABLED_CLASS)
                                .addClass(MASTER_DETAIL_CELL_CLASS)
                                .attr("colSpan", groupCellOptions.colspan);
                        } else {
                            this.callBase.apply(this, arguments);
                        }
                    }
                };
            })()
        }
    }
};
