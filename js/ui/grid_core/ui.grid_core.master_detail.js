import $ from '../../core/renderer';
import gridCoreUtils from './ui.grid_core.utils';
import { grep } from '../../core/utils/common';
import { each } from '../../core/utils/iterator';
import { isDefined } from '../../core/utils/type';
import { when } from '../../core/utils/deferred';

const MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
const MASTER_DETAIL_ROW_CLASS = 'dx-master-detail-row';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const ROW_LINES_CLASS = 'dx-row-lines';


module.exports = {
    defaultOptions: function() {
        return {
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
                    const expandColumns = this.callBase();

                    if(this.option('masterDetail.enabled')) {
                        expandColumns.push({
                            type: 'detailExpand',
                            cellTemplate: gridCoreUtils.getExpandCellTemplate()
                        });
                    }
                    return expandColumns;
                }
            },
            data: (function() {
                const initMasterDetail = function(that) {
                    that._expandedItems = [];
                    that._isExpandAll = that.option('masterDetail.autoExpandAll');
                };

                return {
                    init: function() {
                        const that = this;

                        initMasterDetail(that);
                        that.callBase();
                    },
                    expandAll: function(groupIndex) {
                        const that = this;

                        if(groupIndex < 0) {
                            that._isExpandAll = true;
                            that._expandedItems = [];
                            that.updateItems();
                        } else {
                            that.callBase.apply(that, arguments);
                        }
                    },
                    collapseAll: function(groupIndex) {
                        const that = this;

                        if(groupIndex < 0) {
                            that._isExpandAll = false;
                            that._expandedItems = [];
                            that.updateItems();
                        } else {
                            that.callBase.apply(that, arguments);
                        }
                    },
                    isRowExpanded: function(key) {
                        const that = this;
                        const expandIndex = gridCoreUtils.getIndexByKey(key, that._expandedItems);

                        if(Array.isArray(key)) {
                            return that.callBase.apply(that, arguments);
                        } else {
                            return !!(that._isExpandAll ^ (expandIndex >= 0 && that._expandedItems[expandIndex].visible));
                        }
                    },
                    _getRowIndicesForExpand: function(key) {
                        const rowIndex = this.getRowIndexByKey(key);

                        return [rowIndex, rowIndex + 1];
                    },
                    _changeRowExpandCore: function(key) {
                        const that = this;
                        let expandIndex;
                        let editingController;

                        if(Array.isArray(key)) {
                            return that.callBase.apply(that, arguments);
                        } else {
                            expandIndex = gridCoreUtils.getIndexByKey(key, that._expandedItems);
                            if(expandIndex >= 0) {
                                const visible = that._expandedItems[expandIndex].visible;

                                that._expandedItems[expandIndex].visible = !visible;
                            } else {
                                that._expandedItems.push({ key: key, visible: true });

                                editingController = that.getController('editing');
                                if(editingController) {
                                    editingController.correctEditRowIndexAfterExpand(key);
                                }
                            }

                            that.updateItems({
                                changeType: 'update',
                                rowIndices: that._getRowIndicesForExpand(key)
                            });
                        }
                    },
                    _processDataItem: function(data, options) {
                        const that = this;
                        const dataItem = that.callBase.apply(that, arguments);

                        dataItem.isExpanded = that.isRowExpanded(dataItem.key);

                        if(options.detailColumnIndex === undefined) {
                            options.detailColumnIndex = -1;
                            each(options.visibleColumns, function(index, column) {
                                if(column.command === 'expand' && !isDefined(column.groupIndex)) {
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
                    _processItems: function(items, change) {
                        const that = this;
                        const changeType = change.changeType;
                        let expandIndex;
                        const result = [];

                        items = that.callBase.apply(that, arguments);

                        if(changeType === 'loadingAll') {
                            return items;
                        }

                        if(changeType === 'refresh') {
                            that._expandedItems = grep(that._expandedItems, function(item) { return item.visible; });
                        }

                        each(items, function(index, item) {
                            result.push(item);
                            expandIndex = gridCoreUtils.getIndexByKey(item.key, that._expandedItems);

                            if(item.rowType === 'data' && (item.isExpanded || expandIndex >= 0) && !item.isNewRow) {
                                result.push({
                                    visible: item.isExpanded,
                                    rowType: 'detail',
                                    key: item.key,
                                    data: item.data,
                                    values: []
                                });
                            }
                        });

                        return result;
                    },
                    optionChanged: function(args) {
                        const that = this;
                        let value;
                        let previousValue;
                        let isEnabledChanged;
                        let isAutoExpandAllChanged;

                        if(args.name === 'masterDetail') {
                            args.name = 'dataSource';

                            switch(args.fullName) {
                                case 'masterDetail':
                                    value = args.value || {};
                                    previousValue = args.previousValue || {};
                                    isEnabledChanged = value.enabled !== previousValue.enabled;
                                    isAutoExpandAllChanged = value.autoExpandAll !== previousValue.autoExpandAll;
                                    break;

                                case 'masterDetail.enabled':
                                    isEnabledChanged = true;
                                    break;

                                case 'masterDetail.autoExpandAll':
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
            })(),
            resizing: {
                fireContentReadyAction: function() {
                    this.callBase.apply(this, arguments);

                    this._updateParentDataGrids(this.component.$element());
                },
                _updateParentDataGrids: function($element) {
                    const $masterDetailRow = $element.closest('.' + MASTER_DETAIL_ROW_CLASS);

                    if($masterDetailRow.length) {
                        when(this._updateMasterDataGrid($masterDetailRow, $element)).done(() => {
                            this._updateParentDataGrids($masterDetailRow.parent());
                        });
                    }
                },
                _updateMasterDataGrid: function($masterDetailRow, $detailElement) {
                    const masterRowOptions = $($masterDetailRow).data('options');
                    const masterDataGrid = $($masterDetailRow).closest('.' + this.getWidgetContainerClass()).parent().data('dxDataGrid');

                    if(masterRowOptions && masterDataGrid) {
                        if(masterDataGrid.getView('rowsView').isFixedColumns()) {
                            this._updateFixedMasterDetailGrids(masterDataGrid, masterRowOptions.rowIndex, $detailElement);
                        } else {
                            const scrollable = masterDataGrid.getScrollable();
                            // T607490
                            return scrollable && scrollable.update();
                        }
                    }
                },
                _updateFixedMasterDetailGrids: function(masterDataGrid, masterRowIndex, $detailElement) {
                    const $rows = $(masterDataGrid.getRowElement(masterRowIndex));
                    if($rows && $rows.length === 2 && $rows.eq(0).height() !== $rows.eq(1).height()) {
                        const detailElementWidth = $detailElement.width();
                        return masterDataGrid.updateDimensions().done(() => {
                            const isDetailHorizontalScrollCanBeShown = this.option('columnAutoWidth') && masterDataGrid.option('scrolling.useNative') === true;
                            const isDetailGridWidthChanged = isDetailHorizontalScrollCanBeShown && detailElementWidth !== $detailElement.width();

                            if(isDetailHorizontalScrollCanBeShown && isDetailGridWidthChanged) {
                                this.updateDimensions();
                            }
                        });
                    }
                }
            }
        },
        views: {
            rowsView: (function() {
                return {
                    _getCellTemplate: function(options) {
                        const that = this;
                        const column = options.column;
                        const editingController = that.getController('editing');
                        const isEditRow = editingController && editingController.isEditRow(options.rowIndex);
                        let template;

                        if(column.command === 'detail' && !isEditRow) {
                            template = that.option('masterDetail.template') || { allowRenderToDetachedContainer: false, render: that._getDefaultTemplate(column) };
                        } else {
                            template = that.callBase.apply(that, arguments);
                        }

                        return template;
                    },

                    _isDetailRow: function(row) {
                        return row && row.rowType && row.rowType.indexOf('detail') === 0;
                    },

                    _createRow: function(row) {
                        const $row = this.callBase(row);

                        if(row && this._isDetailRow(row)) {
                            this.option('showRowLines') && $row.addClass(ROW_LINES_CLASS);
                            $row.addClass(MASTER_DETAIL_ROW_CLASS);

                            if(isDefined(row.visible)) {
                                $row.toggle(row.visible);
                            }
                        }
                        return $row;
                    },

                    _renderCells: function($row, options) {
                        const row = options.row;
                        let $detailCell;
                        const visibleColumns = this._columnsController.getVisibleColumns();

                        if(row.rowType && this._isDetailRow(row)) {
                            if(this._needRenderCell(0, options.columnIndices)) {
                                $detailCell = this._renderCell($row, {
                                    value: null,
                                    row: row,
                                    rowIndex: row.rowIndex,
                                    column: { command: 'detail' },
                                    columnIndex: 0
                                });

                                $detailCell
                                    .addClass(CELL_FOCUS_DISABLED_CLASS)
                                    .addClass(MASTER_DETAIL_CELL_CLASS)
                                    .attr('colSpan', visibleColumns.length);
                            }
                        } else {
                            this.callBase.apply(this, arguments);
                        }
                    }
                };
            })()
        }
    }
};
