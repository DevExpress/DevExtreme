import $ from '../../core/renderer';
import { noop } from '../../core/utils/common';
import { isDefined, isPlainObject, isEmptyObject, isString, isFunction } from '../../core/utils/type';
import { each, map } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { compileGetter } from '../../core/utils/data';
import errors from '../widget/ui.errors';
import gridCore from './ui.data_grid.core';
import messageLocalization from '../../localization/message';
import dataSourceAdapter from './ui.data_grid.data_source_adapter';
import { ColumnsView } from '../grid_core/ui.grid_core.columns_view';
import AggregateCalculator from './aggregate_calculator';
import dataQuery from '../../data/query';
import storeHelper from '../../data/store_helper';
import dataUtils from '../../data/utils';

const DATAGRID_TOTAL_FOOTER_CLASS = 'dx-datagrid-total-footer';
const DATAGRID_SUMMARY_ITEM_CLASS = 'dx-datagrid-summary-item';
const DATAGRID_TEXT_CONTENT_CLASS = 'dx-datagrid-text-content';
const DATAGRID_GROUP_FOOTER_CLASS = 'dx-datagrid-group-footer';
const DATAGRID_GROUP_TEXT_CONTENT_CLASS = 'dx-datagrid-group-text-content';
const DATAGRID_NOWRAP_CLASS = 'dx-datagrid-nowrap';

const DATAGRID_GROUP_FOOTER_ROW_TYPE = 'groupFooter';

export const renderSummaryCell = function(cell, options) {
    const $cell = $(cell);
    const column = options.column;
    const summaryItems = options.summaryItems;
    const $summaryItems = [];

    if(!column.command && summaryItems) {
        for(let i = 0; i < summaryItems.length; i++) {
            const summaryItem = summaryItems[i];
            $summaryItems.push($('<div>')
                .css('textAlign', summaryItem.alignment || column.alignment)
                .addClass(DATAGRID_SUMMARY_ITEM_CLASS)
                .addClass(DATAGRID_TEXT_CONTENT_CLASS)
                .addClass(summaryItem.cssClass)
                .toggleClass(DATAGRID_GROUP_TEXT_CONTENT_CLASS, options.rowType === 'group')
                .text(gridCore.getSummaryText(summaryItem, options.summaryTexts)));
        }
        $cell.append($summaryItems);
    }
};
const getSummaryCellOptions = function(that, options) {
    const summaryTexts = that.option('summary.texts') || {};

    return {
        totalItem: options.row,
        summaryItems: options.row.summaryCells[options.columnIndex],
        summaryTexts: summaryTexts
    };
};

const getGroupAggregates = function(data) {
    return data.summary || data.aggregates || [];
};

const recalculateWhileEditing = function(that) {
    return that.option('summary.recalculateWhileEditing');
};

export const FooterView = ColumnsView.inherit((function() {
    return {
        _getRows: function() {
            return this._dataController.footerItems();
        },

        _getCellOptions: function(options) {
            return extend(this.callBase(options), getSummaryCellOptions(this, options));
        },

        _renderCellContent: function($cell, options) {
            renderSummaryCell($cell, options);
            this.callBase($cell, options);
        },

        _renderCore: function(change) {
            const totalItem = this._dataController.footerItems()[0];

            if(!change || !change.columnIndices) {
                this.element()
                    .empty()
                    .addClass(DATAGRID_TOTAL_FOOTER_CLASS)
                    .toggleClass(DATAGRID_NOWRAP_CLASS, !this.option('wordWrapEnabled'));
            }

            if(totalItem && totalItem.summaryCells && totalItem.summaryCells.length) {
                this._updateContent(this._renderTable({ change: change }), change);
            }
        },

        _updateContent: function($newTable, change) {
            if(change && change.changeType === 'update' && change.columnIndices) {
                const $row = this._getTableElement().find('.dx-row');
                const $newRow = $newTable.find('.dx-row');

                this._updateCells($row, $newRow, change.columnIndices[0]);
            } else {
                return this.callBase.apply(this, arguments);
            }
        },

        _rowClick: function(e) {
            const item = this._dataController.footerItems()[e.rowIndex] || {};
            this.executeAction('onRowClick', extend({}, e, item));
        },

        _columnOptionChanged: function(e) {
            const optionNames = e.optionNames;

            if(e.changeTypes.grouping) return;

            if(optionNames.width || optionNames.visibleWidth) {
                this.callBase(e);
            }
        },

        _handleDataChanged: function(e) {
            const changeType = e.changeType;

            if(e.changeType === 'update' && e.repaintChangesOnly) {
                if(!e.totalColumnIndices) {
                    this.render();
                } else if(e.totalColumnIndices.length) {
                    this.render(null, { changeType: 'update', columnIndices: [e.totalColumnIndices] });
                }
            } else if(changeType === 'refresh' || changeType === 'append' || changeType === 'prepend') {
                this.render();
            }
        },

        getHeight: function() {
            return this.getElementHeight();
        },

        isVisible: function() {
            return !!this._dataController.footerItems().length;
        }
    };
})());

const SummaryDataSourceAdapterExtender = (function() {

    function forEachGroup(groups, groupCount, callback, path) {
        path = path || [];
        for(let i = 0; i < groups.length; i++) {
            path.push(groups[i].key);
            if(groupCount === 1) {
                callback(path, groups[i].items);
            } else {
                forEachGroup(groups[i].items, groupCount - 1, callback, path);
            }
            path.pop();
        }
    }

    return {
        init: function() {
            this.callBase.apply(this, arguments);
            this._totalAggregates = [];
            this._summaryGetter = noop;
        },
        summaryGetter: function(summaryGetter) {
            if(!arguments.length) {
                return this._summaryGetter;
            }

            if(isFunction(summaryGetter)) {
                this._summaryGetter = summaryGetter;
            }
        },
        summary: function(summary) {
            if(!arguments.length) {
                return this._summaryGetter();
            }

            this._summaryGetter = function() { return summary; };
        },
        totalAggregates: function() {
            return this._totalAggregates;
        },
        isLastLevelGroupItemsPagingLocal: function() {
            const summary = this.summary();
            const sortByGroupsInfo = summary && summary.sortByGroups();

            return sortByGroupsInfo && sortByGroupsInfo.length;
        },
        sortLastLevelGroupItems: function(items, groups, paths) {
            const groupedItems = storeHelper.multiLevelGroup(dataQuery(items), groups).toArray();
            let result = [];

            paths.forEach(function(path) {
                forEachGroup(groupedItems, groups.length, function(itemsPath, items) {
                    if(path.toString() === itemsPath.toString()) {
                        result = result.concat(items);
                    }
                });
            });

            return result;
        }
    };
})();

const SummaryDataSourceAdapterClientExtender = (function() {
    const applyAddedData = function(data, insertedData, groupLevel) {
        if(groupLevel) {
            return applyAddedData(data, insertedData.map(item => {
                return { items: [item] };
            }, groupLevel - 1));
        }

        return data.concat(insertedData);
    };

    const applyRemovedData = function(data, removedData, groupLevel) {
        if(groupLevel) {
            return data.map(data => {
                const updatedData = {};
                const updatedItems = applyRemovedData(data.items || [], removedData, groupLevel - 1);

                Object.defineProperty(updatedData, 'aggregates', {
                    get: () => data.aggregates,
                    set: value => {
                        data.aggregates = value;
                    }
                });

                return extend(updatedData, data, { items: updatedItems });
            });
        }

        return data.filter(data => removedData.indexOf(data) < 0);
    };

    const calculateAggregates = function(that, summary, data, groupLevel) {
        let calculator;

        if(recalculateWhileEditing(that)) {
            const editingController = that.getController('editing');
            if(editingController) {
                const insertedData = editingController.getInsertedData();
                if(insertedData.length) {
                    data = applyAddedData(data, insertedData, groupLevel);
                }

                const removedData = editingController.getRemovedData();
                if(removedData.length) {
                    data = applyRemovedData(data, removedData, groupLevel);
                }
            }
        }

        if(summary) {
            calculator = new AggregateCalculator({
                totalAggregates: summary.totalAggregates,
                groupAggregates: summary.groupAggregates,
                data: data,
                groupLevel: groupLevel
            });

            calculator.calculate();
        }
        return calculator ? calculator.totalAggregates() : [];
    };

    const sortGroupsBySummaryCore = function(items, groups, sortByGroups) {
        if(!items || !groups.length) return items;

        const group = groups[0];
        const sorts = sortByGroups[0];
        let query;

        if(group && sorts && sorts.length) {
            query = dataQuery(items);
            each(sorts, function(index) {
                if(index === 0) {
                    query = query.sortBy(this.selector, this.desc);
                } else {
                    query = query.thenBy(this.selector, this.desc);
                }
            });
            query.enumerate().done(function(sortedItems) {
                items = sortedItems;
            });
        }

        groups = groups.slice(1);
        sortByGroups = sortByGroups.slice(1);
        if(groups.length && sortByGroups.length) {
            each(items, function() {
                this.items = sortGroupsBySummaryCore(this.items, groups, sortByGroups);
            });
        }

        return items;
    };

    const sortGroupsBySummary = function(data, group, summary) {
        const sortByGroups = summary && summary.sortByGroups && summary.sortByGroups();

        if(sortByGroups && sortByGroups.length) {
            return sortGroupsBySummaryCore(data, group, sortByGroups);
        }
        return data;
    };

    return {
        _customizeRemoteOperations: function(options) {
            const summary = this.summary();

            if(summary) {
                if(options.remoteOperations.summary) {
                    if(!options.isCustomLoading || options.storeLoadOptions.isLoadingAll) {
                        if(options.storeLoadOptions.group) {
                            if(options.remoteOperations.grouping) {
                                options.storeLoadOptions.groupSummary = summary.groupAggregates;
                            } else if(summary.groupAggregates.length) {
                                options.remoteOperations.paging = false;
                            }
                        }
                        options.storeLoadOptions.totalSummary = summary.totalAggregates;
                    }
                } else if(summary.totalAggregates.length || (summary.groupAggregates.length && options.storeLoadOptions.group)) {
                    options.remoteOperations.paging = false;
                }
            }
            this.callBase.apply(this, arguments);

            const cachedExtra = options.cachedPagesData.extra;

            if(cachedExtra && cachedExtra.summary && !options.isCustomLoading) {
                options.storeLoadOptions.totalSummary = undefined;
            }
        },
        _handleDataLoadedCore: function(options) {
            const that = this;
            const groups = dataUtils.normalizeSortingInfo(options.storeLoadOptions.group || options.loadOptions.group || []);
            const remoteOperations = options.remoteOperations || {};
            const summary = that.summaryGetter()(remoteOperations);
            let totalAggregates;

            if(!options.isCustomLoading || options.storeLoadOptions.isLoadingAll) {
                if(remoteOperations.summary) {
                    if(!remoteOperations.paging && groups.length && summary) {
                        if(!remoteOperations.grouping) {
                            calculateAggregates(that, { groupAggregates: summary.groupAggregates }, options.data, groups.length);
                        }
                        options.data = sortGroupsBySummary(options.data, groups, summary);
                    }
                } else if(!remoteOperations.paging) {
                    totalAggregates = calculateAggregates(that, summary, options.data, groups.length);

                    options.data = sortGroupsBySummary(options.data, groups, summary);
                    options.extra = isPlainObject(options.extra) ? options.extra : {};
                    options.extra.summary = totalAggregates;
                }
            }

            if(!options.isCustomLoading) {
                that._totalAggregates = options.extra && options.extra.summary || that._totalAggregates;
            }

            that.callBase(options);
        }
    };
})();

dataSourceAdapter.extend(SummaryDataSourceAdapterExtender);
dataSourceAdapter.extend(SummaryDataSourceAdapterClientExtender);

gridCore.registerModule('summary', {
    defaultOptions: function() {
        return {
            summary: {
                /**
                 * @name dxDataGridOptions.summary.groupItems
                 * @type Array<Object>
                 * @default undefined
                 */
                groupItems: undefined,
                /**
                 * @name dxDataGridOptions.summary.groupItems.name
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions.summary.groupItems.column
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions.summary.groupItems.summaryType
                 * @type Enums.SummaryType|string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions.summary.groupItems.valueFormat
                 * @type format
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions.summary.groupItems.displayFormat
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions.summary.groupItems.customizeText
                 * @type function(itemInfo)
                 * @type_function_param1 itemInfo:object
                 * @type_function_param1_field1 value:string|number|date
                 * @type_function_param1_field2 valueText:string
                 * @type_function_return string
                 */
                /**
                 * @name dxDataGridOptions.summary.groupItems.showInGroupFooter
                 * @type boolean
                 * @default false
                 */
                /**
                 * @name dxDataGridOptions.summary.groupItems.alignByColumn
                 * @type boolean
                 * @default false
                 */
                /**
                 * @name dxDataGridOptions.summary.groupItems.showInColumn
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions.summary.groupItems.skipEmptyValues
                 * @type boolean
                 */
                /**
                 * @name dxDataGridOptions.summary.totalItems
                 * @type Array<Object>
                 * @default undefined
                 */
                totalItems: undefined,
                /**
                 * @name dxDataGridOptions.summary.totalItems.name
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions.summary.totalItems.column
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions.summary.totalItems.showInColumn
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions.summary.totalItems.summaryType
                 * @type Enums.SummaryType|string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions.summary.totalItems.valueFormat
                 * @type format
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions.summary.totalItems.displayFormat
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions.summary.totalItems.customizeText
                 * @type function(itemInfo)
                 * @type_function_param1 itemInfo:object
                 * @type_function_param1_field1 value:string|number|date
                 * @type_function_param1_field2 valueText:string
                 * @type_function_return string
                 */
                /**
                 * @name dxDataGridOptions.summary.totalItems.alignment
                 * @type Enums.HorizontalAlignment
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions.summary.totalItems.cssClass
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions.summary.totalItems.skipEmptyValues
                 * @type boolean
                 */
                /**
                 * @name dxDataGridOptions.summary.calculateCustomSummary
                 * @type function(options)
                 * @type_function_param1 options:object
                 * @type_function_param1_field1 component:dxDataGrid
                 * @type_function_param1_field2 name:string
                 * @type_function_param1_field3 summaryProcess:string
                 * @type_function_param1_field4 value:any
                 * @type_function_param1_field5 totalValue:any
                 * @type_function_param1_field6 groupIndex:number
                 */
                calculateCustomSummary: undefined,
                /**
                 * @name dxDataGridOptions.summary.skipEmptyValues
                 * @type boolean
                 * @default true
                 */
                skipEmptyValues: true,
                /**
                 * @name dxDataGridOptions.summary.recalculateWhileEditing
                 * @type boolean
                 * @default false
                 */
                recalculateWhileEditing: false,
                /**
                 * @name dxDataGridOptions.summary.texts
                 * @type object
                 */
                texts: {
                    /**
                     * @name dxDataGridOptions.summary.texts.sum
                     * @type string
                     * @default "Sum={0}"
                     */
                    sum: messageLocalization.getFormatter('dxDataGrid-summarySum'),
                    /**
                     * @name dxDataGridOptions.summary.texts.sumOtherColumn
                     * @type string
                     * @default "Sum of {1} is {0}"
                     */
                    sumOtherColumn: messageLocalization.getFormatter('dxDataGrid-summarySumOtherColumn'),
                    /**
                     * @name dxDataGridOptions.summary.texts.min
                     * @type string
                     * @default "Min={0}"
                     */
                    min: messageLocalization.getFormatter('dxDataGrid-summaryMin'),
                    /**
                     * @name dxDataGridOptions.summary.texts.minOtherColumn
                     * @type string
                     * @default "Min of {1} is {0}"
                     */
                    minOtherColumn: messageLocalization.getFormatter('dxDataGrid-summaryMinOtherColumn'),
                    /**
                     * @name dxDataGridOptions.summary.texts.max
                     * @type string
                     * @default "Max={0}"
                     */
                    max: messageLocalization.getFormatter('dxDataGrid-summaryMax'),
                    /**
                     * @name dxDataGridOptions.summary.texts.maxOtherColumn
                     * @type string
                     * @default "Max of {1} is {0}"
                     */
                    maxOtherColumn: messageLocalization.getFormatter('dxDataGrid-summaryMaxOtherColumn'),
                    /**
                     * @name dxDataGridOptions.summary.texts.avg
                     * @type string
                     * @default "Avg={0}"
                     */
                    avg: messageLocalization.getFormatter('dxDataGrid-summaryAvg'),
                    /**
                     * @name dxDataGridOptions.summary.texts.avgOtherColumn
                     * @type string
                     * @default "Avg of {1} is {0}"
                     */
                    avgOtherColumn: messageLocalization.getFormatter('dxDataGrid-summaryAvgOtherColumn'),
                    /**
                     * @name dxDataGridOptions.summary.texts.count
                     * @type string
                     * @default "Count={0}"
                     */
                    count: messageLocalization.getFormatter('dxDataGrid-summaryCount')
                }
            },
            sortByGroupSummaryInfo: undefined
            /**
             * @name dxDataGridOptions.sortByGroupSummaryInfo.summaryItem
             * @type string|number
             * @default undefined
             */
            /**
             * @name dxDataGridOptions.sortByGroupSummaryInfo.groupColumn
             * @type string
             * @default undefined
             */
            /**
             * @name dxDataGridOptions.sortByGroupSummaryInfo.sortOrder
             * @type Enums.SortOrder
             * @default undefined
             * @acceptValues undefined
             */
        };
    },
    views: {
        footerView: FooterView
    },
    extenders: {
        controllers: {
            data: (function() {
                return {
                    _isDataColumn: function(column) {
                        return column && (!isDefined(column.groupIndex) || column.showWhenGrouped);
                    },

                    _isGroupFooterVisible: function() {
                        const groupItems = this.option('summary.groupItems') || [];

                        for(let i = 0; i < groupItems.length; i++) {
                            const groupItem = groupItems[i];
                            const column = this._columnsController.columnOption(groupItem.showInColumn || groupItem.column);
                            if(groupItem.showInGroupFooter && this._isDataColumn(column)) {
                                return true;
                            }
                        }

                        return false;
                    },

                    _processGroupItems: function(items, groupCount, options) {
                        const data = options && options.data;
                        const result = this.callBase.apply(this, arguments);

                        if(options) {
                            if(options.isGroupFooterVisible === undefined) {
                                options.isGroupFooterVisible = this._isGroupFooterVisible();
                            }

                            if(data && data.items && options.isGroupFooterVisible && (options.collectContinuationItems || !data.isContinuationOnNextPage)) {
                                result.push({
                                    rowType: DATAGRID_GROUP_FOOTER_ROW_TYPE,
                                    key: options.path.slice(),
                                    data: data,
                                    groupIndex: options.path.length - 1,
                                    values: []
                                });
                            }
                        }
                        return result;
                    },

                    _processGroupItem: function(groupItem, options) {
                        const that = this;

                        if(!options.summaryGroupItems) {
                            options.summaryGroupItems = that.option('summary.groupItems') || [];
                        }
                        if(groupItem.rowType === 'group') {
                            let groupColumnIndex = -1;
                            let afterGroupColumnIndex = -1;

                            each(options.visibleColumns, function(visibleIndex) {
                                const prevColumn = options.visibleColumns[visibleIndex - 1];

                                if(groupItem.groupIndex === this.groupIndex) {
                                    groupColumnIndex = this.index;
                                }

                                if(visibleIndex > 0 && prevColumn.command === 'expand' && this.command !== 'expand') {
                                    afterGroupColumnIndex = this.index;
                                }
                            });

                            groupItem.summaryCells = this._calculateSummaryCells(options.summaryGroupItems, getGroupAggregates(groupItem.data), options.visibleColumns, function(summaryItem, column) {
                                if(summaryItem.showInGroupFooter) {
                                    return -1;
                                }

                                if(summaryItem.alignByColumn && column && !isDefined(column.groupIndex) && (column.index !== afterGroupColumnIndex)) {
                                    return column.index;
                                } else {
                                    return groupColumnIndex;
                                }
                            });
                        }
                        if(groupItem.rowType === DATAGRID_GROUP_FOOTER_ROW_TYPE) {
                            groupItem.summaryCells = this._calculateSummaryCells(options.summaryGroupItems, getGroupAggregates(groupItem.data), options.visibleColumns, function(summaryItem, column) {
                                return summaryItem.showInGroupFooter && that._isDataColumn(column) ? column.index : -1;
                            });
                        }

                        return groupItem;
                    },

                    _calculateSummaryCells: function(summaryItems, aggregates, visibleColumns, calculateTargetColumnIndex) {
                        const that = this;
                        const summaryCells = [];
                        const summaryCellsByColumns = {};

                        each(summaryItems, function(summaryIndex, summaryItem) {
                            const column = that._columnsController.columnOption(summaryItem.column);
                            const showInColumn = summaryItem.showInColumn && that._columnsController.columnOption(summaryItem.showInColumn) || column;
                            const columnIndex = calculateTargetColumnIndex(summaryItem, showInColumn);

                            if(columnIndex >= 0) {
                                if(!summaryCellsByColumns[columnIndex]) {
                                    summaryCellsByColumns[columnIndex] = [];
                                }

                                const aggregate = aggregates[summaryIndex];
                                if(aggregate === aggregate) {
                                    let valueFormat;
                                    if(isDefined(summaryItem.valueFormat)) {
                                        valueFormat = summaryItem.valueFormat;
                                    } else if(summaryItem.summaryType !== 'count') {
                                        valueFormat = gridCore.getFormatByDataType(column && column.dataType);
                                    }
                                    summaryCellsByColumns[columnIndex].push(extend({}, summaryItem, {
                                        value: isString(aggregate) && column && column.deserializeValue ? column.deserializeValue(aggregate) : aggregate,
                                        valueFormat: valueFormat,
                                        columnCaption: (column && column.index !== columnIndex) ? column.caption : undefined
                                    }));
                                }
                            }
                        });
                        if(!isEmptyObject(summaryCellsByColumns)) {
                            each(visibleColumns, function() {
                                summaryCells.push(summaryCellsByColumns[this.index] || []);
                            });
                        }

                        return summaryCells;
                    },

                    _getSummaryCells: function(summaryTotalItems, totalAggregates) {
                        const that = this;
                        const columnsController = that._columnsController;

                        return that._calculateSummaryCells(summaryTotalItems, totalAggregates, columnsController.getVisibleColumns(), function(summaryItem, column) {
                            return that._isDataColumn(column) ? column.index : -1;
                        });
                    },

                    _updateItemsCore: function(change) {
                        const that = this;
                        let summaryCells;
                        const dataSource = that._dataSource;
                        const footerItems = that._footerItems;
                        const oldSummaryCells = footerItems && footerItems[0] && footerItems[0].summaryCells;
                        const summaryTotalItems = that.option('summary.totalItems');

                        that._footerItems = [];
                        if(dataSource && summaryTotalItems && summaryTotalItems.length) {
                            const totalAggregates = dataSource.totalAggregates();
                            summaryCells = that._getSummaryCells(summaryTotalItems, totalAggregates);

                            if(change && change.repaintChangesOnly && oldSummaryCells) {
                                change.totalColumnIndices = summaryCells.map(function(summaryCell, index) {
                                    if(JSON.stringify(summaryCell) !== JSON.stringify(oldSummaryCells[index])) {
                                        return index;
                                    }
                                    return -1;
                                }).filter(index => index >= 0);
                            }

                            if(summaryCells.length) {
                                that._footerItems.push({
                                    rowType: 'totalFooter',
                                    summaryCells: summaryCells
                                });
                            }
                        }
                        that.callBase(change);
                    },

                    _prepareUnsavedDataSelector: function(selector) {
                        const that = this;

                        if(recalculateWhileEditing(that)) {
                            const editingController = that.getController('editing');
                            if(editingController) {
                                return function(data) {
                                    data = editingController.getUpdatedData(data);
                                    return selector(data);
                                };
                            }
                        }

                        return selector;
                    },

                    _prepareAggregateSelector: function(selector, aggregator) {
                        selector = this._prepareUnsavedDataSelector(selector);

                        if(aggregator === 'avg' || aggregator === 'sum') {
                            return function(data) {
                                const value = selector(data);
                                return isDefined(value) ? Number(value) : value;
                            };
                        }

                        return selector;
                    },

                    _getAggregates: function(summaryItems, remoteOperations) {
                        const that = this;
                        const columnsController = that.getController('columns');
                        let calculateCustomSummary = that.option('summary.calculateCustomSummary');
                        const commonSkipEmptyValues = that.option('summary.skipEmptyValues');

                        return map(summaryItems || [], function(summaryItem) {

                            const column = columnsController.columnOption(summaryItem.column);
                            const calculateCellValue = (column && column.calculateCellValue) ? column.calculateCellValue.bind(column) : compileGetter(column ? column.dataField : summaryItem.column);
                            let aggregator = summaryItem.summaryType || 'count';
                            let selector = summaryItem.column;
                            const skipEmptyValues = isDefined(summaryItem.skipEmptyValues) ? summaryItem.skipEmptyValues : commonSkipEmptyValues;

                            if(remoteOperations) {
                                return {
                                    selector: summaryItem.column,
                                    summaryType: aggregator
                                };
                            } else {
                                selector = that._prepareAggregateSelector(calculateCellValue, aggregator);

                                if(aggregator === 'custom') {
                                    if(!calculateCustomSummary) {
                                        errors.log('E1026');
                                        calculateCustomSummary = function() { };
                                    }
                                    const options = {
                                        component: that.component,
                                        name: summaryItem.name
                                    };
                                    calculateCustomSummary(options);
                                    options.summaryProcess = 'calculate';
                                    aggregator = {
                                        seed: function(groupIndex) {
                                            options.summaryProcess = 'start';
                                            options.totalValue = undefined;
                                            options.groupIndex = groupIndex;
                                            delete options.value;
                                            calculateCustomSummary(options);
                                            return options.totalValue;
                                        },
                                        step: function(totalValue, value) {
                                            options.summaryProcess = 'calculate';
                                            options.totalValue = totalValue;
                                            options.value = value;
                                            calculateCustomSummary(options);
                                            return options.totalValue;
                                        },
                                        finalize: function(totalValue) {
                                            options.summaryProcess = 'finalize';
                                            options.totalValue = totalValue;
                                            delete options.value;
                                            calculateCustomSummary(options);
                                            return options.totalValue;
                                        }
                                    };
                                }
                                return {
                                    selector: selector,
                                    aggregator: aggregator,
                                    skipEmptyValues: skipEmptyValues
                                };
                            }
                        });
                    },

                    _addSortInfo: function(sortByGroups, groupColumn, selector, sortOrder) {
                        if(groupColumn) {
                            const groupIndex = groupColumn.groupIndex;
                            sortOrder = sortOrder || groupColumn.sortOrder;
                            if(isDefined(groupIndex)) {
                                sortByGroups[groupIndex] = sortByGroups[groupIndex] || [];
                                sortByGroups[groupIndex].push({
                                    selector: selector,
                                    desc: sortOrder === 'desc'
                                });
                            }
                        }
                    },

                    _findSummaryItem: function(summaryItems, name) {
                        let summaryItemIndex = -1;

                        const getFullName = function(summaryItem) {
                            const summaryType = summaryItem.summaryType;
                            const column = summaryItem.column;

                            return summaryType && column && summaryType + '_' + column;
                        };

                        if(isDefined(name)) {
                            each(summaryItems || [], function(index) {
                                if(this.name === name || index === name || this.summaryType === name || this.column === name || getFullName(this) === name) {
                                    summaryItemIndex = index;
                                    return false;
                                }
                            });
                        }
                        return summaryItemIndex;
                    },

                    _getSummarySortByGroups: function(sortByGroupSummaryInfo, groupSummaryItems) {
                        const that = this;
                        const columnsController = that._columnsController;
                        const groupColumns = columnsController.getGroupColumns();
                        const sortByGroups = [];

                        if(!groupSummaryItems || !groupSummaryItems.length) return;

                        each(sortByGroupSummaryInfo || [], function() {
                            const sortOrder = this.sortOrder;
                            let groupColumn = this.groupColumn;
                            const summaryItemIndex = that._findSummaryItem(groupSummaryItems, this.summaryItem);

                            if(summaryItemIndex < 0) return;

                            const selector = function(data) {
                                return getGroupAggregates(data)[summaryItemIndex];
                            };

                            if(isDefined(groupColumn)) {
                                groupColumn = columnsController.columnOption(groupColumn);
                                that._addSortInfo(sortByGroups, groupColumn, selector, sortOrder);
                            } else {
                                each(groupColumns, function(groupIndex, groupColumn) {
                                    that._addSortInfo(sortByGroups, groupColumn, selector, sortOrder);
                                });
                            }
                        });
                        return sortByGroups;
                    },

                    _createDataSourceAdapterCore: function(dataSource, remoteOperations) {
                        const that = this;
                        const dataSourceAdapter = this.callBase(dataSource, remoteOperations);

                        dataSourceAdapter.summaryGetter(function(currentRemoteOperations) {
                            return that._getSummaryOptions(currentRemoteOperations || remoteOperations);
                        });

                        return dataSourceAdapter;
                    },

                    _getSummaryOptions: function(remoteOperations) {
                        const that = this;
                        const groupSummaryItems = that.option('summary.groupItems');
                        const totalSummaryItems = that.option('summary.totalItems');
                        const sortByGroupSummaryInfo = that.option('sortByGroupSummaryInfo');
                        const groupAggregates = that._getAggregates(groupSummaryItems, remoteOperations && remoteOperations.grouping && remoteOperations.summary);
                        const totalAggregates = that._getAggregates(totalSummaryItems, remoteOperations && remoteOperations.summary);
                        const sortByGroups = function() {
                            return that._getSummarySortByGroups(sortByGroupSummaryInfo, groupSummaryItems);
                        };

                        if(groupAggregates.length || totalAggregates.length) {
                            return {
                                groupAggregates: groupAggregates,
                                totalAggregates: totalAggregates,
                                sortByGroups: sortByGroups
                            };
                        }
                    },

                    publicMethods: function() {
                        const methods = this.callBase();
                        methods.push('getTotalSummaryValue');
                        return methods;
                    },

                    getTotalSummaryValue: function(summaryItemName) {
                        const summaryItemIndex = this._findSummaryItem(this.option('summary.totalItems'), summaryItemName);
                        const aggregates = this._dataSource.totalAggregates();

                        if(aggregates.length && summaryItemIndex > -1) {
                            return aggregates[summaryItemIndex];
                        }
                    },

                    optionChanged: function(args) {
                        if(args.name === 'summary' || args.name === 'sortByGroupSummaryInfo') {
                            args.name = 'dataSource';
                        }
                        this.callBase(args);
                    },

                    init: function() {
                        this._footerItems = [];
                        this.callBase();
                    },

                    footerItems: function() {
                        return this._footerItems;
                    }
                };
            })(),
            editing: (function() {
                return {
                    _refreshSummary: function() {
                        if(recalculateWhileEditing(this) && !this.isSaving()) {
                            this._dataController.refresh({
                                load: true,
                                changesOnly: true
                            });
                        }
                    },
                    _addChange: function(params) {
                        const result = this.callBase.apply(this, arguments);

                        if(params.type) {
                            this._refreshSummary();
                        }

                        return result;
                    },
                    _removeChange: function() {
                        const result = this.callBase.apply(this, arguments);

                        this._refreshSummary();

                        return result;
                    },
                    cancelEditData: function() {
                        const result = this.callBase.apply(this, arguments);

                        this._refreshSummary();

                        return result;
                    }
                };
            })()
        },
        views: {
            rowsView: (function() {
                return {
                    _createRow: function(row) {
                        const $row = this.callBase(row);

                        row && $row.addClass(row.rowType === DATAGRID_GROUP_FOOTER_ROW_TYPE ? DATAGRID_GROUP_FOOTER_CLASS : '');
                        return $row;
                    },

                    _renderCells: function($row, options) {
                        this.callBase.apply(this, arguments);

                        if(options.row.rowType === 'group' && options.row.summaryCells && options.row.summaryCells.length) {
                            this._renderGroupSummaryCells($row, options);
                        }
                    },

                    _hasAlignByColumnSummaryItems: function(columnIndex, options) {
                        return !isDefined(options.columns[columnIndex].groupIndex) && options.row.summaryCells[columnIndex].length;
                    },

                    _getAlignByColumnCellCount: function(groupCellColSpan, options) {
                        let alignByColumnCellCount = 0;

                        for(let i = 1; i < groupCellColSpan; i++) {
                            const columnIndex = options.row.summaryCells.length - i;
                            alignByColumnCellCount = this._hasAlignByColumnSummaryItems(columnIndex, options) ? i : alignByColumnCellCount;
                        }

                        return alignByColumnCellCount;
                    },

                    _renderGroupSummaryCells: function($row, options) {
                        const $groupCell = $row.children().last();
                        const groupCellColSpan = Number($groupCell.attr('colSpan')) || 1;
                        const alignByColumnCellCount = this._getAlignByColumnCellCount(groupCellColSpan, options);

                        this._renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount);
                    },

                    _renderGroupSummaryCellsCore: function($groupCell, options, groupCellColSpan, alignByColumnCellCount) {
                        if(alignByColumnCellCount > 0) {
                            $groupCell.attr('colSpan', groupCellColSpan - alignByColumnCellCount);

                            for(let i = 0; i < alignByColumnCellCount; i++) {
                                const columnIndex = options.columns.length - alignByColumnCellCount + i;

                                this._renderCell($groupCell.parent(), extend({ column: options.columns[columnIndex], columnIndex: this._getSummaryCellIndex(columnIndex, options.columns) }, options));
                            }
                        }
                    },

                    _getSummaryCellIndex: function(columnIndex) {
                        return columnIndex;
                    },

                    _getCellTemplate: function(options) {
                        if(!options.column.command && !isDefined(options.column.groupIndex) && options.summaryItems && options.summaryItems.length) {
                            return renderSummaryCell;
                        } else {
                            return this.callBase(options);
                        }
                    },

                    _getCellOptions: function(options) {
                        const that = this;
                        const parameters = that.callBase(options);

                        if(options.row.summaryCells) {
                            return extend(parameters, getSummaryCellOptions(that, options));
                        } else {
                            return parameters;
                        }
                    }
                };
            })()
        }
    }
});
