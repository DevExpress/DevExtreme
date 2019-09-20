import $ from "../../core/renderer";
import gridCoreUtils from "./ui.grid_core.utils";
import { grep } from "../../core/utils/common";
import { each } from "../../core/utils/iterator";
import { isDefined } from "../../core/utils/type";

var MASTER_DETAIL_CELL_CLASS = "dx-master-detail-cell",
    MASTER_DETAIL_ROW_CLASS = "dx-master-detail-row",
    CELL_FOCUS_DISABLED_CLASS = "dx-cell-focus-disabled",
    ROW_LINES_CLASS = "dx-row-lines";


module.exports = {
    defaultOptions: function() {
        return {
            /**
             * @name dxDataGridOptions.masterDetail
             * @type object
             */
            masterDetail: {
                /**
                 * @name dxDataGridOptions.masterDetail.enabled
                 * @type boolean
                 * @default false
                 */
                enabled: false,
                /**
                 * @name dxDataGridOptions.masterDetail.autoExpandAll
                 * @type boolean
                 * @default false
                 */
                autoExpandAll: false,
                /**
                 * @name dxDataGridOptions.masterDetail.template
                 * @type template|function
                 * @type_function_param1 detailElement:dxElement
                 * @type_function_param2 detailInfo:object
                 * @type_function_param2_field1 key:any
                 * @type_function_param2_field2 data:object
                 * @type_function_param2_field3 watch:function
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
                        expandColumns.push({
                            type: "detailExpand",
                            cellTemplate: gridCoreUtils.getExpandCellTemplate()
                        });
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
                            expandIndex,
                            editingController;

                        if(Array.isArray(key)) {
                            return that.callBase.apply(that, arguments);
                        } else {
                            expandIndex = gridCoreUtils.getIndexByKey(key, that._expandedItems);
                            if(expandIndex >= 0) {
                                var visible = that._expandedItems[expandIndex].visible;

                                that._expandedItems[expandIndex].visible = !visible;
                            } else {
                                that._expandedItems.push({ key: key, visible: true });

                                editingController = that.getController("editing");
                                if(editingController) {
                                    editingController.correctEditRowIndexAfterExpand(key);
                                }
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

                            if(item.rowType === "data" && (item.isExpanded || expandIndex >= 0) && !item.isNewRow) {
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
                            template = that.option("masterDetail.template") || { allowRenderToDetachedContainer: false, render: that._getDefaultTemplate(column) };
                        } else {
                            template = that.callBase.apply(that, arguments);
                        }

                        return template;
                    },

                    _cellPrepared: function($cell, options) {
                        var that = this,
                            masterGrid = that.component;

                        that.callBase.apply(that, arguments);

                        if(options.rowType === "detail" && options.column.command === "detail") {
                            $cell.find("." + that.getWidgetContainerClass()).each(function() {
                                var detailGrid = $(this).parent().data("dxDataGrid");

                                if(detailGrid) {
                                    detailGrid.on("contentReady", () => {
                                        that._handleDetailGridContentReady(masterGrid, options.rowIndex, detailGrid);
                                    });
                                }
                            });
                        }
                    },

                    _handleDetailGridContentReady: function(masterGrid, masterRowIndex, detailGrid) {
                        if(this._isFixedColumns) {
                            let $rows = $(masterGrid.getRowElement(masterRowIndex));
                            if($rows && $rows.length === 2 && $rows.eq(0).height() !== $rows.eq(1).height()) {
                                let detailGridWidth = detailGrid.$element().width();

                                masterGrid.updateDimensions().done(function() {
                                    let isDetailHorizontalScrollCanBeShown = detailGrid.option("columnAutoWidth") && masterGrid.option("scrolling.useNative") === true,
                                        isDetailGridWidthChanged = isDetailHorizontalScrollCanBeShown && detailGridWidth !== detailGrid.$element().width();

                                    if(isDetailGridWidthChanged) {
                                        detailGrid.updateDimensions();
                                    }
                                });
                            }
                        } else {
                            let scrollable = masterGrid.getScrollable();
                            // T607490
                            scrollable && scrollable.update();
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

                    _renderCells: function($row, options) {
                        var row = options.row,
                            $detailCell,
                            visibleColumns = this._columnsController.getVisibleColumns();

                        if(row.rowType && this._isDetailRow(row)) {
                            $detailCell = this._renderCell($row, {
                                value: null,
                                row: row,
                                rowIndex: row.rowIndex,
                                column: { command: "detail" },
                                columnIndex: 0
                            });

                            $detailCell
                                .addClass(CELL_FOCUS_DISABLED_CLASS)
                                .addClass(MASTER_DETAIL_CELL_CLASS)
                                .attr("colSpan", visibleColumns.length);
                        } else {
                            this.callBase.apply(this, arguments);
                        }
                    }
                };
            })()
        }
    }
};
