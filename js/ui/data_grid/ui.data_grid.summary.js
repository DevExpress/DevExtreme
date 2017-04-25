"use strict";

var $ = require("../../core/renderer"),
    commonUtils = require("../../core/utils/common"),
    isEmptyObject = require("../../core/utils/type").isEmptyObject,
    extend = require("../../core/utils/extend").extend,
    compileGetter = require("../../core/utils/data").compileGetter,
    errors = require("../widget/ui.errors"),
    gridCore = require("./ui.data_grid.core"),
    messageLocalization = require("../../localization/message"),
    dataSourceAdapter = require("./ui.data_grid.data_source_adapter"),
    columnsView = require("../grid_core/ui.grid_core.columns_view"),
    AggregateCalculator = require("./aggregate_calculator"),
    dataQuery = require("../../data/query"),
    dataUtils = require("../../data/utils");

var DATAGRID_TOTAL_FOOTER_CLASS = "dx-datagrid-total-footer",
    DATAGRID_SUMMARY_ITEM_CLASS = "dx-datagrid-summary-item",
    DATAGRID_TEXT_CONTENT_CLASS = "dx-datagrid-text-content",
    DATAGRID_GROUP_FOOTER_CLASS = "dx-datagrid-group-footer",
    DATAGRID_GROUP_TEXT_CONTENT_CLASS = "dx-datagrid-group-text-content",
    DATAGRID_NOWRAP_CLASS = "dx-datagrid-nowrap",

    DATAGRID_GROUP_FOOTER_ROW_TYPE = "groupFooter";

var renderSummaryCell = function($cell, options) {
        var i,
            column = options.column,
            summaryItems = options.summaryItems,
            summaryItem,
            $summaryItems = [];

        if(!column.command && summaryItems) {
            for(i = 0; i < summaryItems.length; i++) {
                summaryItem = summaryItems[i];
                $summaryItems.push($("<div>")
                    .css("text-align", summaryItem.alignment || column.alignment)
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
            if(e.changeType === "refresh") {
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
    return {
        init: function() {
            this.callBase.apply(this, arguments);
            this._totalAggregates = [];
            this._summaryGetter = commonUtils.noop;
        },
        summaryGetter: function(summaryGetter) {
            if(!arguments.length) {
                return this._summaryGetter;
            }

            if(commonUtils.isFunction(summaryGetter)) {
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
            $.each(sorts, function(index) {
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
            $.each(items, function() {
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
        },
        _handleDataLoadedCore: function(options) {
            var that = this,
                groups = dataUtils.normalizeSortingInfo(options.loadOptions.group || []),
                remoteOperations = options.remoteOperations || {},
                summary = that.summaryGetter()(remoteOperations),
                totalAggregates;

            if(remoteOperations.summary) {
                if(!remoteOperations.paging && !remoteOperations.grouping && groups.length && summary) {
                    calculateAggregates(that, { groupAggregates: summary.groupAggregates }, options.data, groups.length);

                    options.data = sortGroupsBySummary(options.data, groups, summary);
                }
            } else if(!remoteOperations.paging) {
                totalAggregates = calculateAggregates(that, summary, options.data, groups.length);

                options.data = sortGroupsBySummary(options.data, groups, summary);
                options.extra = options.extra || {};
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
             * @name dxDataGridOptions_summary
             * @publicName summary
             * @type object
             */
            summary: {
                /**
                 * @name dxDataGridOptions_summary_groupItems
                 * @publicName groupItems
                 * @type array
                 * @default undefined
                 */
                groupItems: undefined,
                /**
                 * @name dxDataGridOptions_summary_groupItems_name
                 * @publicName name
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions_summary_groupItems_column
                 * @publicName column
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions_summary_groupItems_summaryType
                 * @publicName summaryType
                 * @type string
                 * @acceptValues "sum" | "min" | "max" | "avg" | "count" | "custom"
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions_summary_groupItems_valueFormat
                 * @publicName valueFormat
                 * @type format
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions_summary_groupItems_precision
                 * @publicName precision
                 * @type number
                 * @default undefined
                 * @deprecated
                 */
                /**
                 * @name dxDataGridOptions_summary_groupItems_displayFormat
                 * @publicName displayFormat
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions_summary_groupItems_customizeText
                 * @publicName customizeText
                 * @type function(itemInfo)
                 * @type_function_param1 itemInfo:object
                 * @type_function_param1_field1 value:string|number|date
                 * @type_function_param1_field2 valueText:string
                 * @type_function_return string
                 */
                /**
                 * @name dxDataGridOptions_summary_groupItems_showInGroupFooter
                 * @publicName showInGroupFooter
                 * @type boolean
                 * @default false
                 */
                /**
                 * @name dxDataGridOptions_summary_groupItems_alignByColumn
                 * @publicName alignByColumn
                 * @type boolean
                 * @default false
                 */
                /**
                 * @name dxDataGridOptions_summary_groupItems_showInColumn
                 * @publicName showInColumn
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions_summary_groupItems_skipEmptyValues
                 * @publicName skipEmptyValues
                 * @type boolean
                 */
                /**
                 * @name dxDataGridOptions_summary_totalItems
                 * @publicName totalItems
                 * @type array
                 * @default undefined
                 */
                totalItems: undefined,
                /**
                 * @name dxDataGridOptions_summary_totalItems_name
                 * @publicName name
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions_summary_totalItems_column
                 * @publicName column
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions_summary_totalItems_showInColumn
                 * @publicName showInColumn
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions_summary_totalItems_summaryType
                 * @publicName summaryType
                 * @type string
                 * @acceptValues "sum" | "min" | "max" | "avg" | "count" | "custom"
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions_summary_totalItems_valueFormat
                 * @publicName valueFormat
                 * @type format
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions_summary_totalItems_precision
                 * @publicName precision
                 * @type number
                 * @default undefined
                 * @deprecated
                 */
                /**
                 * @name dxDataGridOptions_summary_totalItems_displayFormat
                 * @publicName displayFormat
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions_summary_totalItems_customizeText
                 * @publicName customizeText
                 * @type function(itemInfo)
                 * @type_function_param1 itemInfo:object
                 * @type_function_param1_field1 value:string|number|date
                 * @type_function_param1_field2 valueText:string
                 * @type_function_return string
                 */
                /**
                 * @name dxDataGridOptions_summary_totalItems_alignment
                 * @publicName alignment
                 * @type string
                 * @acceptValues "left" | "center" | "right"
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions_summary_totalItems_cssClass
                 * @publicName cssClass
                 * @type string
                 * @default undefined
                 */
                /**
                 * @name dxDataGridOptions_summary_totalItems_skipEmptyValues
                 * @publicName skipEmptyValues
                 * @type boolean
                 */
                /**
                 * @name dxDataGridOptions_summary_calculateCustomSummary
                 * @publicName calculateCustomSummary
                 * @type function(options)
                 * @type_function_param1 options:object
                 * @type_function_param1_field1 component:object
                 * @type_function_param1_field2 name:string
                 * @type_function_param1_field3 summaryProcess:string
                 * @type_function_param1_field4 value:any
                 * @type_function_param1_field5 totalValue:any
                 */
                calculateCustomSummary: undefined,
                /**
                 * @name dxDataGridOptions_summary_skipEmptyValues
                 * @publicName skipEmptyValues
                 * @type boolean
                 * @default true
                 */
                skipEmptyValues: true,
                /**
                 * @name dxDataGridOptions_summary_texts
                 * @publicName texts
                 * @type object
                 */
                texts: {
                    /**
                     * @name dxDataGridOptions_summary_texts_sum
                     * @publicName sum
                     * @type string
                     * @default "Sum={0}"
                     */
                    sum: messageLocalization.getFormatter("dxDataGrid-summarySum"),
                    /**
                     * @name dxDataGridOptions_summary_texts_sumOtherColumn
                     * @publicName sumOtherColumn
                     * @type string
                     * @default "Sum of {1} is {0}"
                     */
                    sumOtherColumn: messageLocalization.getFormatter("dxDataGrid-summarySumOtherColumn"),
                    /**
                     * @name dxDataGridOptions_summary_texts_min
                     * @publicName min
                     * @type string
                     * @default "Min={0}"
                     */
                    min: messageLocalization.getFormatter("dxDataGrid-summaryMin"),
                    /**
                     * @name dxDataGridOptions_summary_texts_minOtherColumn
                     * @publicName minOtherColumn
                     * @type string
                     * @default "Min of {1} is {0}"
                     */
                    minOtherColumn: messageLocalization.getFormatter("dxDataGrid-summaryMinOtherColumn"),
                    /**
                     * @name dxDataGridOptions_summary_texts_max
                     * @publicName max
                     * @type string
                     * @default "Max={0}"
                     */
                    max: messageLocalization.getFormatter("dxDataGrid-summaryMax"),
                    /**
                     * @name dxDataGridOptions_summary_texts_maxOtherColumn
                     * @publicName maxOtherColumn
                     * @type string
                     * @default "Max of {1} is {0}"
                     */
                    maxOtherColumn: messageLocalization.getFormatter("dxDataGrid-summaryMaxOtherColumn"),
                    /**
                     * @name dxDataGridOptions_summary_texts_avg
                     * @publicName avg
                     * @type string
                     * @default "Avg={0}"
                     */
                    avg: messageLocalization.getFormatter("dxDataGrid-summaryAvg"),
                    /**
                     * @name dxDataGridOptions_summary_texts_avgOtherColumn
                     * @publicName avgOtherColumn
                     * @type string
                     * @default "Avg of {1} is {0}"
                     */
                    avgOtherColumn: messageLocalization.getFormatter("dxDataGrid-summaryAvgOtherColumn"),
                    /**
                     * @name dxDataGridOptions_summary_texts_count
                     * @publicName count
                     * @type string
                     * @default "Count={0}"
                     */
                    count: messageLocalization.getFormatter("dxDataGrid-summaryCount")
                }
            },
            /**
             * @name dxDataGridOptions_sortByGroupSummaryInfo
             * @publicName sortByGroupSummaryInfo
             * @type array
             * @default undefined
             */
            sortByGroupSummaryInfo: undefined
            /**
             * @name dxDataGridOptions_sortByGroupSummaryInfo_summaryItem
             * @publicName summaryItem
             * @type string
             * @default undefined
             */
            /**
             * @name dxDataGridOptions_sortByGroupSummaryInfo_groupColumn
             * @publicName groupColumn
             * @type string
             * @default undefined
             */
            /**
             * @name dxDataGridOptions_sortByGroupSummaryInfo_sortOrder
             * @publicName sortOrder
             * @type string
             * @default undefined
             * @acceptValues undefined | "asc" | "desc"
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
                        return column && (!commonUtils.isDefined(column.groupIndex) || column.showWhenGrouped);
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
                        var result = this.callBase.apply(this, arguments);

                        if(options) {
                            if(options.isGroupFooterVisible === undefined) {
                                options.isGroupFooterVisible = this._isGroupFooterVisible();
                            }

                            if(options.data && options.data.items && options.isGroupFooterVisible && (options.collectContinuationItems || !options.data.isContinuationOnNextPage)) {
                                result.push({
                                    rowType: DATAGRID_GROUP_FOOTER_ROW_TYPE,
                                    data: options.data,
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

                            $.each(options.visibleColumns, function(visibleIndex) {
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

                                if(summaryItem.alignByColumn && column && !commonUtils.isDefined(column.groupIndex) && (column.index !== afterGroupColumnIndex)) {
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

                        $.each(summaryItems, function(summaryIndex, summaryItem) {
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
                                    summaryCellsByColumns[columnIndex].push(extend({}, summaryItem, {
                                        value: commonUtils.isString(aggregate) && column && column.deserializeValue ? column.deserializeValue(aggregate) : aggregate,
                                        valueFormat: !commonUtils.isDefined(summaryItem.valueFormat) ? gridCore.getFormatByDataType(column && column.dataType) : summaryItem.valueFormat,
                                        columnCaption: (column && column.index !== columnIndex) ? column.caption : undefined
                                    }));
                                }
                            }
                        });
                        if(!isEmptyObject(summaryCellsByColumns)) {
                            $.each(visibleColumns, function() {
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

                        that.callBase(change);
                        that._footerItems = [];

                        if(dataSource && summaryTotalItems && summaryTotalItems.length) {
                            totalAggregates = dataSource.totalAggregates();
                            summaryCells = this._getSummaryCells(summaryTotalItems, totalAggregates);

                            if(summaryCells.length) {
                                that._footerItems.push({
                                    rowType: "totalFooter",
                                    summaryCells: summaryCells
                                });
                            }
                        }
                    },

                    _getAggregates: function(summaryItems, remoteOperations) {
                        var that = this,
                            columnsController = that.getController("columns"),
                            calculateCustomSummary = that.option("summary.calculateCustomSummary"),
                            commonSkipEmptyValues = that.option("summary.skipEmptyValues");

                        return $.map(summaryItems || [], function(summaryItem) {

                            var column = columnsController.columnOption(summaryItem.column),
                                calculateCellValue = (column && column.calculateCellValue) ? column.calculateCellValue.bind(column) : compileGetter(column ? column.dataField : summaryItem.column),
                                aggregator = summaryItem.summaryType || "count",
                                selector = summaryItem.column,
                                skipEmptyValues = commonUtils.isDefined(summaryItem.skipEmptyValues) ? summaryItem.skipEmptyValues : commonSkipEmptyValues,
                                options;

                            if(remoteOperations) {
                                return {
                                    selector: summaryItem.column,
                                    summaryType: summaryItem.summaryType
                                };
                            } else {
                                if(aggregator === "avg" || aggregator === "sum") {
                                    selector = function(data) {
                                        var value = calculateCellValue(data);
                                        return commonUtils.isDefined(value) ? Number(value) : value;
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
                            if(commonUtils.isDefined(groupIndex)) {
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

                        if(commonUtils.isDefined(name)) {
                            $.each(summaryItems || [], function(index) {
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

                        $.each(sortByGroupSummaryInfo || [], function() {
                            var sortOrder = this.sortOrder,
                                groupColumn = this.groupColumn,
                                summaryItemIndex = that._findSummaryItem(groupSummaryItems, this.summaryItem);

                            if(summaryItemIndex < 0) return;

                            var selector = function(data) {
                                return getGroupAggregates(data)[summaryItemIndex];
                            };

                            if(commonUtils.isDefined(groupColumn)) {
                                groupColumn = columnsController.columnOption(groupColumn);
                                that._addSortInfo(sortByGroups, groupColumn, selector, sortOrder);
                            } else {
                                $.each(groupColumns, function(groupIndex, groupColumn) {
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
                     * @name dxDataGridMethods_getTotalSummaryValue
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
                        return !commonUtils.isDefined(options.columns[columnIndex].groupIndex) && options.row.summaryCells[columnIndex].length;
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
                            groupCellColSpan = Number($groupCell.attr("colspan")) || 1,
                            alignByColumnCellCount = this._getAlignByColumnCellCount(groupCellColSpan, options);

                        this._renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount);
                    },

                    _renderGroupSummaryCellsCore: function($groupCell, options, groupCellColSpan, alignByColumnCellCount) {
                        if(alignByColumnCellCount > 0) {
                            $groupCell.attr("colspan", groupCellColSpan - alignByColumnCellCount);

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
                        if(!options.column.command && !commonUtils.isDefined(options.column.groupIndex) && options.summaryItems && options.summaryItems.length) {
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
