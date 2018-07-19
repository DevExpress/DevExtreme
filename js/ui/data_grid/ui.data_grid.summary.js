"use strict";

var $ = require("../../core/renderer"),
    noop = require("../../core/utils/common").noop,
    typeUtils = require("../../core/utils/type"),
    iteratorUtils = require("../../core/utils/iterator"),
    extend = require("../../core/utils/extend").extend,
    compileGetter = require("../../core/utils/data").compileGetter,
    errors = require("../widget/ui.errors"),
    gridCore = require("./ui.data_grid.core"),
    messageLocalization = require("../../localization/message"),
    dataSourceAdapter = require("./ui.data_grid.data_source_adapter"),
    columnsView = require("../grid_core/ui.grid_core.columns_view"),
    AggregateCalculator = require("./aggregate_calculator"),
    dataQuery = require("../../data/query"),
    storeHelper = require("../../data/store_helper"),
    dataUtils = require("../../data/utils");

var DATAGRID_TOTAL_FOOTER_CLASS = "dx-datagrid-total-footer",
    DATAGRID_SUMMARY_ITEM_CLASS = "dx-datagrid-summary-item",
    DATAGRID_TEXT_CONTENT_CLASS = "dx-datagrid-text-content",
    DATAGRID_GROUP_FOOTER_CLASS = "dx-datagrid-group-footer",
    DATAGRID_GROUP_TEXT_CONTENT_CLASS = "dx-datagrid-group-text-content",
    DATAGRID_NOWRAP_CLASS = "dx-datagrid-nowrap",

    DATAGRID_GROUP_FOOTER_ROW_TYPE = "groupFooter";

var renderSummaryCell = function(cell, options) {
        var i,
            $cell = $(cell),
            column = options.column,
            summaryItems = options.summaryItems,
            summaryItem,
            $summaryItems = [];

        if(!column.command && summaryItems) {
            for(i = 0; i < summaryItems.length; i++) {
                summaryItem = summaryItems[i];
                $summaryItems.push($("<div>")
                    .css("textAlign", summaryItem.alignment || column.alignment)
                    .addClass(DATAGRID_SUMMARY_ITEM_CLASS)
                    .addClass(DATAGRID_TEXT_CONTENT_CLASS)
                    .addClass(summaryItem.cssClass)
                    .toggleClass(DATAGRID_GROUP_TEXT_CONTENT_CLASS, options.rowType === "group")
                    .text(gridCore.getSummaryText(summaryItem, options.summaryTexts)));
            }
            $cell.append($summaryItems);
        }
    },
    getSummaryCellOptions = function(that, options) {
        var summaryTexts = that.option("summary.texts") || {};

        return {
            totalItem: options.row,
            summaryItems: options.row.summaryCells[options.columnIndex],
            summaryTexts: summaryTexts
        };
    };

var getGroupAggregates = function(data) {
    return data.summary || data.aggregates || [];
};


exports.FooterView = columnsView.ColumnsView.inherit((function() {
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

        _renderCore: function() {
            var totalItem = this._dataController.footerItems()[0];

            this.element()
                .empty()
                .addClass(DATAGRID_TOTAL_FOOTER_CLASS)
                .toggleClass(DATAGRID_NOWRAP_CLASS, !this.option("wordWrapEnabled"));

            if(totalItem && totalItem.summaryCells && totalItem.summaryCells.length) {
                this._updateContent(this._renderTable());
            }
        },

        _rowClick: function(e) {
            var item = this._dataController.footerItems()[e.rowIndex] || {};
            this.executeAction("onRowClick", extend({}, e, item));
        },

        _columnOptionChanged: function(e) {
            var optionNames = e.optionNames;

            if(e.changeTypes.grouping) return;

            if(optionNames.width || optionNames.visibleWidth) {
                this.callBase(e);
            }
        },

        _handleDataChanged: function(e) {
            var changeType = e.changeType;
            if(changeType === "refresh" || changeType === "append" || changeType === "prepend") {
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

var SummaryDataSourceAdapterExtender = (function() {

    function forEachGroup(groups, groupCount, callback, path) {
        path = path || [];
        for(var i = 0; i < groups.length; i++) {
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

            if(typeUtils.isFunction(summaryGetter)) {
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
            var summary = this.summary(),
                sortByGroupsInfo = summary && summary.sortByGroups();

            return sortByGroupsInfo && sortByGroupsInfo.length;
        },
        sortLastLevelGroupItems: function(items, groups, paths) {
            var groupedItems = storeHelper.multiLevelGroup(dataQuery(items), groups).toArray(),
                result = [];

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

var SummaryDataSourceAdapterClientExtender = (function() {
    var calculateAggregates = function(that, summary, data, groupLevel) {
        var calculator;

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

    var sortGroupsBySummaryCore = function(items, groups, sortByGroups) {
        if(!items || !groups.length) return items;

        var group = groups[0],
            sorts = sortByGroups[0],
            query;

        if(group && sorts && sorts.length) {
            query = dataQuery(items);
            iteratorUtils.each(sorts, function(index) {
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
            iteratorUtils.each(items, function() {
                this.items = sortGroupsBySummaryCore(this.items, groups, sortByGroups);
            });
        }

        return items;
    };

    var sortGroupsBySummary = function(data, group, summary) {
        var sortByGroups = summary && summary.sortByGroups && summary.sortByGroups();

        if(sortByGroups && sortByGroups.length) {
            return sortGroupsBySummaryCore(data, group, sortByGroups);
        }
        return data;
    };

    return {
        _customizeRemoteOperations: function(options) {
            var summary = this.summary();

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

            var cachedExtra = options.cachedPagesData.extra;

            if(cachedExtra && cachedExtra.summary && !options.isCustomLoading) {
                options.storeLoadOptions.totalSummary = undefined;
            }
        },
        _handleDataLoadedCore: function(options) {
            var that = this,
                groups = dataUtils.normalizeSortingInfo(options.storeLoadOptions.group || options.loadOptions.group || []),
                remoteOperations = options.remoteOperations || {},
                summary = that.summaryGetter()(remoteOperations),
                totalAggregates;

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
                options.extra = typeUtils.isPlainObject(options.extra) ? options.extra : {};
                options.extra.summary = totalAggregates;
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

exports.renderSummaryCell = renderSummaryCell;

gridCore.registerModule("summary", {
    defaultOptions: function() {
        return {
            /**
             * @name dxDataGridOptions.summary
             * @type object
             */
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
                 */
                calculateCustomSummary: undefined,
                /**
                 * @name dxDataGridOptions.summary.skipEmptyValues
                 * @type boolean
                 * @default true
                 */
                skipEmptyValues: true,
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
                    sum: messageLocalization.getFormatter("dxDataGrid-summarySum"),
                    /**
                     * @name dxDataGridOptions.summary.texts.sumOtherColumn
                     * @type string
                     * @default "Sum of {1} is {0}"
                     */
                    sumOtherColumn: messageLocalization.getFormatter("dxDataGrid-summarySumOtherColumn"),
                    /**
                     * @name dxDataGridOptions.summary.texts.min
                     * @type string
                     * @default "Min={0}"
                     */
                    min: messageLocalization.getFormatter("dxDataGrid-summaryMin"),
                    /**
                     * @name dxDataGridOptions.summary.texts.minOtherColumn
                     * @type string
                     * @default "Min of {1} is {0}"
                     */
                    minOtherColumn: messageLocalization.getFormatter("dxDataGrid-summaryMinOtherColumn"),
                    /**
                     * @name dxDataGridOptions.summary.texts.max
                     * @type string
                     * @default "Max={0}"
                     */
                    max: messageLocalization.getFormatter("dxDataGrid-summaryMax"),
                    /**
                     * @name dxDataGridOptions.summary.texts.maxOtherColumn
                     * @type string
                     * @default "Max of {1} is {0}"
                     */
                    maxOtherColumn: messageLocalization.getFormatter("dxDataGrid-summaryMaxOtherColumn"),
                    /**
                     * @name dxDataGridOptions.summary.texts.avg
                     * @type string
                     * @default "Avg={0}"
                     */
                    avg: messageLocalization.getFormatter("dxDataGrid-summaryAvg"),
                    /**
                     * @name dxDataGridOptions.summary.texts.avgOtherColumn
                     * @type string
                     * @default "Avg of {1} is {0}"
                     */
                    avgOtherColumn: messageLocalization.getFormatter("dxDataGrid-summaryAvgOtherColumn"),
                    /**
                     * @name dxDataGridOptions.summary.texts.count
                     * @type string
                     * @default "Count={0}"
                     */
                    count: messageLocalization.getFormatter("dxDataGrid-summaryCount")
                }
            },
            /**
             * @name dxDataGridOptions.sortByGroupSummaryInfo
             * @type Array<Object>
             * @default undefined
             */
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
        footerView: exports.FooterView
    },
    extenders: {
        controllers: {
            data: (function() {
                return {
                    _isDataColumn: function(column) {
                        return column && (!typeUtils.isDefined(column.groupIndex) || column.showWhenGrouped);
                    },

                    _isGroupFooterVisible: function() {
                        var groupItems = this.option("summary.groupItems") || [],
                            groupItem,
                            column,
                            i;

                        for(i = 0; i < groupItems.length; i++) {
                            groupItem = groupItems[i];
                            column = this._columnsController.columnOption(groupItem.showInColumn || groupItem.column);
                            if(groupItem.showInGroupFooter && this._isDataColumn(column)) {
                                return true;
                            }
                        }

                        return false;
                    },

                    _processGroupItems: function(items, groupCount, options) {
                        var data = options && options.data,
                            result = this.callBase.apply(this, arguments);

                        if(options) {
                            if(options.isGroupFooterVisible === undefined) {
                                options.isGroupFooterVisible = this._isGroupFooterVisible();
                            }

                            if(data && data.items && options.isGroupFooterVisible && (options.collectContinuationItems || !data.isContinuationOnNextPage)) {
                                result.push({
                                    rowType: DATAGRID_GROUP_FOOTER_ROW_TYPE,
                                    data: data,
                                    groupIndex: options.path.length - 1,
                                    values: []
                                });
                            }
                        }
                        return result;
                    },

                    _processGroupItem: function(groupItem, options) {
                        var that = this;

                        if(!options.summaryGroupItems) {
                            options.summaryGroupItems = that.option("summary.groupItems") || [];
                        }
                        if(groupItem.rowType === "group") {
                            var groupColumnIndex = -1,
                                afterGroupColumnIndex = -1;

                            iteratorUtils.each(options.visibleColumns, function(visibleIndex) {
                                var prevColumn = options.visibleColumns[visibleIndex - 1];

                                if(groupItem.groupIndex === this.groupIndex) {
                                    groupColumnIndex = this.index;
                                }

                                if(visibleIndex > 0 && prevColumn.command === "expand" && this.command !== "expand") {
                                    afterGroupColumnIndex = this.index;
                                }
                            });

                            groupItem.summaryCells = this._calculateSummaryCells(options.summaryGroupItems, getGroupAggregates(groupItem.data), options.visibleColumns, function(summaryItem, column) {
                                if(summaryItem.showInGroupFooter) {
                                    return -1;
                                }

                                if(summaryItem.alignByColumn && column && !typeUtils.isDefined(column.groupIndex) && (column.index !== afterGroupColumnIndex)) {
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
                        var that = this,
                            summaryCells = [],
                            summaryCellsByColumns = {};

                        iteratorUtils.each(summaryItems, function(summaryIndex, summaryItem) {
                            var column = that._columnsController.columnOption(summaryItem.column),
                                showInColumn = summaryItem.showInColumn && that._columnsController.columnOption(summaryItem.showInColumn) || column,
                                columnIndex = calculateTargetColumnIndex(summaryItem, showInColumn),
                                aggregate;

                            if(columnIndex >= 0) {
                                if(!summaryCellsByColumns[columnIndex]) {
                                    summaryCellsByColumns[columnIndex] = [];
                                }

                                aggregate = aggregates[summaryIndex];
                                if(aggregate === aggregate) {
                                    var valueFormat;
                                    if(typeUtils.isDefined(summaryItem.valueFormat)) {
                                        valueFormat = summaryItem.valueFormat;
                                    } else if(summaryItem.summaryType !== "count") {
                                        valueFormat = gridCore.getFormatByDataType(column && column.dataType);
                                    }
                                    summaryCellsByColumns[columnIndex].push(extend({}, summaryItem, {
                                        value: typeUtils.isString(aggregate) && column && column.deserializeValue ? column.deserializeValue(aggregate) : aggregate,
                                        valueFormat: valueFormat,
                                        columnCaption: (column && column.index !== columnIndex) ? column.caption : undefined
                                    }));
                                }
                            }
                        });
                        if(!typeUtils.isEmptyObject(summaryCellsByColumns)) {
                            iteratorUtils.each(visibleColumns, function() {
                                summaryCells.push(summaryCellsByColumns[this.index] || []);
                            });
                        }

                        return summaryCells;
                    },

                    _getSummaryCells: function(summaryTotalItems, totalAggregates) {
                        var that = this,
                            columnsController = that._columnsController;

                        return that._calculateSummaryCells(summaryTotalItems, totalAggregates, columnsController.getVisibleColumns(), function(summaryItem, column) {
                            return that._isDataColumn(column) ? column.index : -1;
                        });
                    },

                    _updateItemsCore: function(change) {
                        var that = this,
                            summaryCells,
                            totalAggregates,
                            dataSource = that._dataSource,
                            summaryTotalItems = that.option("summary.totalItems");

                        that._footerItems = [];
                        if(dataSource && summaryTotalItems && summaryTotalItems.length) {
                            totalAggregates = dataSource.totalAggregates();
                            summaryCells = that._getSummaryCells(summaryTotalItems, totalAggregates);

                            if(summaryCells.length) {
                                that._footerItems.push({
                                    rowType: "totalFooter",
                                    summaryCells: summaryCells
                                });
                            }
                        }
                        that.callBase(change);
                    },

                    _getAggregates: function(summaryItems, remoteOperations) {
                        var that = this,
                            columnsController = that.getController("columns"),
                            calculateCustomSummary = that.option("summary.calculateCustomSummary"),
                            commonSkipEmptyValues = that.option("summary.skipEmptyValues");

                        return iteratorUtils.map(summaryItems || [], function(summaryItem) {

                            var column = columnsController.columnOption(summaryItem.column),
                                calculateCellValue = (column && column.calculateCellValue) ? column.calculateCellValue.bind(column) : compileGetter(column ? column.dataField : summaryItem.column),
                                aggregator = summaryItem.summaryType || "count",
                                selector = summaryItem.column,
                                skipEmptyValues = typeUtils.isDefined(summaryItem.skipEmptyValues) ? summaryItem.skipEmptyValues : commonSkipEmptyValues,
                                options;

                            if(remoteOperations) {
                                return {
                                    selector: summaryItem.column,
                                    summaryType: aggregator
                                };
                            } else {
                                if(aggregator === "avg" || aggregator === "sum") {
                                    selector = function(data) {
                                        var value = calculateCellValue(data);
                                        return typeUtils.isDefined(value) ? Number(value) : value;
                                    };
                                } else {
                                    selector = calculateCellValue;
                                }

                                if(aggregator === "custom") {
                                    if(!calculateCustomSummary) {
                                        errors.log("E1026");
                                        calculateCustomSummary = function() { };
                                    }
                                    options = {
                                        component: that.component,
                                        name: summaryItem.name
                                    };
                                    calculateCustomSummary(options);
                                    options.summaryProcess = "calculate";
                                    aggregator = {
                                        seed: function() {
                                            options.summaryProcess = "start";
                                            options.totalValue = undefined;
                                            delete options.value;
                                            calculateCustomSummary(options);
                                            return options.totalValue;
                                        },
                                        step: function(totalValue, value) {
                                            options.summaryProcess = "calculate";
                                            options.totalValue = totalValue;
                                            options.value = value;
                                            calculateCustomSummary(options);
                                            return options.totalValue;
                                        },
                                        finalize: function(totalValue) {
                                            options.summaryProcess = "finalize";
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
                        var groupIndex;
                        if(groupColumn) {
                            groupIndex = groupColumn.groupIndex;
                            sortOrder = sortOrder || groupColumn.sortOrder;
                            if(typeUtils.isDefined(groupIndex)) {
                                sortByGroups[groupIndex] = sortByGroups[groupIndex] || [];
                                sortByGroups[groupIndex].push({
                                    selector: selector,
                                    desc: sortOrder === "desc"
                                });
                            }
                        }
                    },

                    _findSummaryItem: function(summaryItems, name) {
                        var summaryItemIndex = -1;

                        var getFullName = function(summaryItem) {
                            var summaryType = summaryItem.summaryType,
                                column = summaryItem.column;

                            return summaryType && column && summaryType + "_" + column;
                        };

                        if(typeUtils.isDefined(name)) {
                            iteratorUtils.each(summaryItems || [], function(index) {
                                if(this.name === name || index === name || this.summaryType === name || this.column === name || getFullName(this) === name) {
                                    summaryItemIndex = index;
                                    return false;
                                }
                            });
                        }
                        return summaryItemIndex;
                    },

                    _getSummarySortByGroups: function(sortByGroupSummaryInfo, groupSummaryItems) {
                        var that = this,
                            columnsController = that._columnsController,
                            groupColumns = columnsController.getGroupColumns(),
                            sortByGroups = [];

                        if(!groupSummaryItems || !groupSummaryItems.length) return;

                        iteratorUtils.each(sortByGroupSummaryInfo || [], function() {
                            var sortOrder = this.sortOrder,
                                groupColumn = this.groupColumn,
                                summaryItemIndex = that._findSummaryItem(groupSummaryItems, this.summaryItem);

                            if(summaryItemIndex < 0) return;

                            var selector = function(data) {
                                return getGroupAggregates(data)[summaryItemIndex];
                            };

                            if(typeUtils.isDefined(groupColumn)) {
                                groupColumn = columnsController.columnOption(groupColumn);
                                that._addSortInfo(sortByGroups, groupColumn, selector, sortOrder);
                            } else {
                                iteratorUtils.each(groupColumns, function(groupIndex, groupColumn) {
                                    that._addSortInfo(sortByGroups, groupColumn, selector, sortOrder);
                                });
                            }
                        });
                        return sortByGroups;
                    },

                    _createDataSourceAdapterCore: function(dataSource, remoteOperations) {
                        var that = this,
                            dataSourceAdapter = this.callBase(dataSource, remoteOperations);

                        dataSourceAdapter.summaryGetter(function(currentRemoteOperations) {
                            return that._getSummaryOptions(currentRemoteOperations || remoteOperations);
                        });

                        return dataSourceAdapter;
                    },

                    _getSummaryOptions: function(remoteOperations) {
                        var that = this,
                            groupSummaryItems = that.option("summary.groupItems"),
                            totalSummaryItems = that.option("summary.totalItems"),
                            sortByGroupSummaryInfo = that.option("sortByGroupSummaryInfo"),
                            groupAggregates = that._getAggregates(groupSummaryItems, remoteOperations && remoteOperations.grouping && remoteOperations.summary),
                            totalAggregates = that._getAggregates(totalSummaryItems, remoteOperations && remoteOperations.summary),
                            sortByGroups = function() {
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
                        var methods = this.callBase();
                        methods.push("getTotalSummaryValue");
                        return methods;
                    },

                    /**
                     * @name dxDataGridMethods.getTotalSummaryValue
                     * @publicName getTotalSummaryValue(summaryItemName)
                     * @param1 summaryItemName:String
                     * @return any
                     */
                    getTotalSummaryValue: function(summaryItemName) {
                        var summaryItemIndex = this._findSummaryItem(this.option("summary.totalItems"), summaryItemName),
                            aggregates = this._dataSource.totalAggregates();

                        if(aggregates.length && summaryItemIndex > -1) {
                            return aggregates[summaryItemIndex];
                        }
                    },

                    optionChanged: function(args) {
                        if(args.name === "summary" || args.name === "sortByGroupSummaryInfo") {
                            args.name = "dataSource";
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
            })()
        },
        views: {
            rowsView: (function() {
                return {
                    _createRow: function(row) {
                        var $row = this.callBase(row);

                        row && $row.addClass(row.rowType === DATAGRID_GROUP_FOOTER_ROW_TYPE ? DATAGRID_GROUP_FOOTER_CLASS : "");
                        return $row;
                    },

                    _renderCells: function($row, options) {
                        this.callBase.apply(this, arguments);

                        if(options.row.rowType === "group" && options.row.summaryCells && options.row.summaryCells.length) {
                            this._renderGroupSummaryCells($row, options);
                        }
                    },

                    _hasAlignByColumnSummaryItems: function(columnIndex, options) {
                        return !typeUtils.isDefined(options.columns[columnIndex].groupIndex) && options.row.summaryCells[columnIndex].length;
                    },

                    _getAlignByColumnCellCount: function(groupCellColSpan, options) {
                        var alignByColumnCellCount = 0,
                            columnIndex;

                        for(var i = 1; i < groupCellColSpan; i++) {
                            columnIndex = options.row.summaryCells.length - i;
                            alignByColumnCellCount = this._hasAlignByColumnSummaryItems(columnIndex, options) ? i : alignByColumnCellCount;
                        }

                        return alignByColumnCellCount;
                    },

                    _renderGroupSummaryCells: function($row, options) {
                        var $groupCell = $row.children().last(),
                            groupCellColSpan = Number($groupCell.attr("colSpan")) || 1,
                            alignByColumnCellCount = this._getAlignByColumnCellCount(groupCellColSpan, options);

                        this._renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount);
                    },

                    _renderGroupSummaryCellsCore: function($groupCell, options, groupCellColSpan, alignByColumnCellCount) {
                        if(alignByColumnCellCount > 0) {
                            $groupCell.attr("colSpan", groupCellColSpan - alignByColumnCellCount);

                            for(var i = 0; i < alignByColumnCellCount; i++) {
                                var columnIndex = options.columns.length - alignByColumnCellCount + i;

                                this._renderCell($groupCell.parent(), extend({ column: options.columns[columnIndex], columnIndex: this._getSummaryCellIndex(columnIndex, options.columns) }, options));
                            }
                        }
                    },

                    _getSummaryCellIndex: function(columnIndex) {
                        return columnIndex;
                    },

                    _getCellTemplate: function(options) {
                        if(!options.column.command && !typeUtils.isDefined(options.column.groupIndex) && options.summaryItems && options.summaryItems.length) {
                            return renderSummaryCell;
                        } else {
                            return this.callBase(options);
                        }
                    },

                    _getCellOptions: function(options) {
                        var that = this,
                            parameters = that.callBase(options);

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
