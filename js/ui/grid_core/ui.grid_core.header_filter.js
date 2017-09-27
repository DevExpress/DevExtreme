"use strict";

var eventsEngine = require("../../events/core/events_engine"),
    modules = require("./ui.grid_core.modules"),
    gridCoreUtils = require("./ui.grid_core.utils"),
    headerFilterCore = require("./ui.grid_core.header_filter_core"),
    headerFilterMixin = headerFilterCore.headerFilterMixin,
    messageLocalization = require("../../localization/message"),
    allowHeaderFiltering = headerFilterCore.allowHeaderFiltering,
    clickEvent = require("../../events/click"),
    dataUtils = require("../../data/utils"),
    dataCoreUtils = require("../../core/utils/data"),
    each = require("../../core/utils/iterator").each,
    typeUtils = require("../../core/utils/type"),
    getDefaultAlignment = require("../../core/utils/position").getDefaultAlignment,
    extend = require("../../core/utils/extend").extend,
    normalizeDataSourceOptions = require("../../data/data_source/data_source").normalizeDataSourceOptions,
    dateLocalization = require("../../localization/date"),
    isWrapped = require("../../core/utils/variable_wrapper").isWrapped,
    Deferred = require("../../core/utils/deferred").Deferred;

var DATE_INTERVAL_FORMATS = {
    'month': function(value) {
        return dateLocalization.getMonthNames()[value - 1];
    },
    'quarter': function(value) {
        return dateLocalization.format(new Date(2000, value * 3 - 1), 'quarter');
    }
};

var HeaderFilterController = modules.ViewController.inherit((function() {
    var getFormatOptions = function(value, column, currentLevel) {
        var groupInterval = gridCoreUtils.getGroupInterval(column),
            result = gridCoreUtils.getFormatOptionsByColumn(column, "headerFilter");

        if(groupInterval) {
            result.groupInterval = groupInterval[currentLevel];

            if(gridCoreUtils.isDateType(column.dataType)) {
                result.format = DATE_INTERVAL_FORMATS[groupInterval[currentLevel]];
            } else if(column.dataType === "number") {
                result.getDisplayFormat = function() {
                    var formatOptions = { format: column.format, precision: column.precision, target: "headerFilter" },
                        firstValueText = gridCoreUtils.formatValue(value, formatOptions),
                        secondValue = value + groupInterval[currentLevel],
                        secondValueText = gridCoreUtils.formatValue(secondValue, formatOptions);

                    return firstValueText && secondValueText ? firstValueText + " - " + secondValueText : "";
                };
            }
        }

        return result;
    };

    return {
        init: function() {
            this._columnsController = this.getController("columns");
            this._dataController = this.getController("data");
            this._headerFilterView = this.getView("headerFilterView");
        },

        _updateSelectedState: function(items, column) {
            var i = items.length,
                isExclude = column.filterType === "exclude";

            while(i--) {
                var item = items[i];

                if("items" in items[i]) {
                    this._updateSelectedState(items[i].items, column);
                }

                headerFilterCore.updateHeaderFilterItemSelectionState(item, gridCoreUtils.getIndexByKey(items[i].value, column.filterValues, null) > -1, isExclude);
            }
        },

        _normalizeGroupItem: function(item, currentLevel, options) {
            var value,
                displayValue,
                path = options.path,
                valueSelector = options.valueSelector,
                displaySelector = options.displaySelector,
                column = options.column;

            if(valueSelector && displaySelector) {
                value = valueSelector(item);
                displayValue = displaySelector(item);
            } else {
                value = item.key;
                displayValue = value;
            }

            item = typeUtils.isObject(item) ? item : {};

            path.push(value);

            if(path.length === 1) {
                item.value = path[0];
            } else {
                item.value = path.join("/");
            }

            item.text = gridCoreUtils.formatValue(displayValue, getFormatOptions(displayValue, column, currentLevel));

            if(!item.text) {
                item.text = options.headerFilterOptions.texts.emptyValue;
            }

            delete item.key;
            return item;
        },

        _processGroupItems: function(groupItems, currentLevel, path, options) {
            var that = this,
                displaySelector,
                valueSelector,
                column = options.column,
                lookup = column.lookup,
                level = options.level;

            path = path || [];
            currentLevel = currentLevel || 0;

            if(lookup) {
                displaySelector = dataCoreUtils.compileGetter(lookup.displayExpr);
                valueSelector = dataCoreUtils.compileGetter(lookup.valueExpr);
            }

            for(var i = 0; i < groupItems.length; i++) {
                groupItems[i] = that._normalizeGroupItem(groupItems[i], currentLevel, {
                    column: options.column,
                    headerFilterOptions: options.headerFilterOptions,
                    displaySelector: displaySelector,
                    valueSelector: valueSelector,
                    path: path
                });

                if("items" in groupItems[i]) {
                    if(currentLevel === level || !typeUtils.isDefined(groupItems[i].value)) {
                        delete groupItems[i].items;
                    } else {
                        that._processGroupItems(groupItems[i].items, currentLevel + 1, path, options);
                    }
                }

                path.pop();
            }
        },

        getDataSource: function(column) {
            var that = this,
                filter,
                cutoffLevel,
                origPostProcess,
                dataSource = that._dataController.dataSource(),
                group = gridCoreUtils.getHeaderFilterGroupParameters(column, dataSource && dataSource.remoteOperations().grouping),
                headerFilterDataSource = column.headerFilter && column.headerFilter.dataSource,
                headerFilterOptions = that.option("headerFilter"),
                options = {
                    component: that.component
                };

            if(!dataSource) return;

            if(typeUtils.isDefined(headerFilterDataSource) && !typeUtils.isFunction(headerFilterDataSource)) {
                dataSource = normalizeDataSourceOptions(headerFilterDataSource);
                dataSource.postProcess = function(items) {
                    that._updateSelectedState(items, column);
                    return items;
                };
                return dataSource;
            }
            if(column.lookup) {
                dataSource = column.lookup.dataSource;
                if(typeUtils.isFunction(dataSource) && !isWrapped(dataSource)) {
                    dataSource = dataSource({});
                }
                dataSource = normalizeDataSourceOptions(dataSource);
                dataSource.postProcess = function(items) {
                    if(this.pageIndex() === 0 && !this.searchValue()) {
                        items = items.slice(0);
                        items.unshift(null);
                    }
                    that._processGroupItems(items, null, null, {
                        level: 0,
                        column: column,
                        headerFilterOptions: headerFilterOptions
                    });
                    that._updateSelectedState(items, column);
                    return items;
                };

                options.dataSource = dataSource;
            } else {
                cutoffLevel = Array.isArray(group) ? group.length - 1 : 0;

                that._currentColumn = column;
                filter = that._dataController.getCombinedFilter();
                that._currentColumn = null;

                options.dataSource = {
                    filter: filter,
                    group: group,
                    load: function(options) {
                        var d = new Deferred();
                        //TODO remove in 16.1
                        options.dataField = column.dataField || column.name;

                        if(options.searchValue) {
                            options.filter = gridCoreUtils.combineFilters([options.filter, [options.searchExpr, options.searchOperation, options.searchValue]]);
                        }

                        dataSource.load(options).done(function(data) {
                            that._processGroupItems(data, null, null, {
                                level: cutoffLevel,
                                column: column,
                                headerFilterOptions: headerFilterOptions
                            });
                            that._updateSelectedState(data, column);
                            d.resolve(data);
                        }).fail(d.reject);

                        return d;
                    }
                };
            }

            if(typeUtils.isFunction(headerFilterDataSource)) {
                headerFilterDataSource.call(column, options);
                origPostProcess = options.dataSource.postProcess;
                options.dataSource.postProcess = function(data) {
                    var items = origPostProcess && origPostProcess.apply(this, arguments) || data;

                    that._updateSelectedState(items, column);
                    return items;
                };
            }

            return options.dataSource;
        },

        getCurrentColumn: function() {
            return this._currentColumn;
        },

        showHeaderFilterMenu: function(columnIndex, isGroupPanel) {
            var that = this,
                column = extend(true, {}, that._columnsController.getColumns()[columnIndex]);

            if(column) {
                var visibleIndex = that._columnsController.getVisibleIndex(columnIndex),
                    view = isGroupPanel ? that.getView("headerPanel") : that.getView("columnHeadersView"),
                    $columnElement = view.getColumnElements().eq(isGroupPanel ? column.groupIndex : visibleIndex),
                    groupInterval = gridCoreUtils.getGroupInterval(column);

                var options = extend(column, {
                    type: groupInterval && groupInterval.length > 1 ? "tree" : "list",
                    apply: function() {
                        that._columnsController.columnOption(columnIndex, {
                            filterValues: this.filterValues,
                            filterType: this.filterType
                        });
                    },
                    onShowing: function(e) {
                        var dxResizableInstance = e.component.overlayContent().dxResizable("instance");

                        dxResizableInstance && dxResizableInstance.option("onResizeEnd", function(e) {
                            var columnsController = that.getController("columns"),
                                headerFilterByColumn = columnsController.columnOption(options.dataField, "headerFilter");

                            headerFilterByColumn = headerFilterByColumn || {};
                            headerFilterByColumn.width = e.width;
                            headerFilterByColumn.height = e.height;

                            columnsController.columnOption(options.dataField, "headerFilter", headerFilterByColumn, true);
                        });
                    }
                });

                options.dataSource = that.getDataSource(options);

                that._headerFilterView.showHeaderFilterMenu($columnElement, options);
            }
        },

        hideHeaderFilterMenu: function() {
            this._headerFilterView.hideHeaderFilterMenu();
        }
    };
})());

var ColumnHeadersViewHeaderFilterExtender = extend({}, headerFilterCore.headerFilterMixin, {
    _renderCellContent: function($cell, options) {
        var that = this,
            $headerFilterIndicator,
            column = options.column;

        if(!column.command && allowHeaderFiltering(column) && that.option("headerFilter.visible") && options.rowType === "header") {
            $headerFilterIndicator = that._applyColumnState({
                name: "headerFilter",
                rootElement: $cell,
                column: column,
                showColumnLines: that.option("showColumnLines")
            });

            $headerFilterIndicator && that._subscribeToIndicatorEvent($headerFilterIndicator, column, "headerFilter");
        }

        that.callBase($cell, options);
    },

    _subscribeToIndicatorEvent: function($indicator, column, indicatorName) {
        var that = this;

        if(indicatorName === "headerFilter") {
            eventsEngine.on($indicator, clickEvent.name, that.createAction(function(e) {
                var event = e.jQueryEvent;

                event.stopPropagation();
                that.getController("headerFilter").showHeaderFilterMenu(column.index, false);
            }));
        }
    },

    _updateIndicator: function($cell, column, indicatorName) {
        var $indicator = this.callBase($cell, column, indicatorName);

        $indicator && this._subscribeToIndicatorEvent($indicator, column, indicatorName);
    },

    _columnOptionChanged: function(e) {
        var optionNames = e.optionNames;

        if(gridCoreUtils.checkChanges(optionNames, ["filterValues", "filterType"])) {
            if(this.option("headerFilter.visible")) {
                this._updateIndicators("headerFilter");
            }
            return;
        }

        this.callBase(e);
    }
});

var HeaderPanelHeaderFilterExtender = extend({}, headerFilterMixin, {
    _createGroupPanelItem: function($rootElement, groupColumn) {
        var that = this,
            $item = that.callBase.apply(that, arguments),
            $headerFilterIndicator;

        if(!groupColumn.command && allowHeaderFiltering(groupColumn) && that.option("headerFilter.visible")) {
            $headerFilterIndicator = that._applyColumnState({
                name: "headerFilter",
                rootElement: $item,
                column: {
                    alignment: getDefaultAlignment(that.option("rtlEnabled")),
                    filterValues: groupColumn.filterValues,
                    allowHeaderFiltering: true
                },
                showColumnLines: true
            });

            $headerFilterIndicator && eventsEngine.on($headerFilterIndicator, clickEvent.name, that.createAction(function(e) {
                var event = e.jQueryEvent;

                event.stopPropagation();
                that.getController("headerFilter").showHeaderFilterMenu(groupColumn.index, true);
            }));
        }

        return $item;
    }
});

var INVERTED_BINARY_OPERATIONS = {
    "=": "<>",
    "<>": "=",
    ">": "<=",
    ">=": "<",
    "<": ">=",
    "<=": ">",
    "contains": "notcontains",
    "notcontains": "contains",
    "startswith": "notcontains", //TODO
    "endswith": "notcontains" //TODO
};

function invertFilterExpression(filter) {
    var i,
        currentGroupOperation,
        result;

    if(Array.isArray(filter[0])) {
        result = [];
        for(i = 0; i < filter.length; i++) {
            if(Array.isArray(filter[i])) {
                if(currentGroupOperation) {
                    result.push(currentGroupOperation);
                }
                result.push(invertFilterExpression(filter[i]));
                currentGroupOperation = "or";
            } else {
                currentGroupOperation = dataUtils.isConjunctiveOperator(filter[i]) ? "or" : "and";
            }
        }
        return result;
    }

    result = dataUtils.normalizeBinaryCriterion(filter);
    result[1] = INVERTED_BINARY_OPERATIONS[result[1]] || result[1];

    return result;
}

var DataControllerFilterRowExtender = {
    _calculateAdditionalFilter: function() {
        var that = this,
            filters = [that.callBase()],
            columns = that._columnsController.getVisibleColumns(),
            headerFilterController = that.getController("headerFilter"),
            currentColumn = headerFilterController.getCurrentColumn();

        each(columns, function(_, column) {
            var filter;

            if(currentColumn && currentColumn.index === column.index) {
                return;
            }

            if(allowHeaderFiltering(column) && column.calculateFilterExpression && Array.isArray(column.filterValues) && column.filterValues.length) {
                var filterValues = [],
                    isExclude = column.filterType === "exclude";

                each(column.filterValues, function(_, filterValue) {

                    if(Array.isArray(filterValue)) {
                        filter = isExclude ? invertFilterExpression(filterValue) : filterValue;
                    } else {
                        if(column.deserializeValue && !gridCoreUtils.isDateType(column.dataType) && column.dataType !== "number") {
                            filterValue = column.deserializeValue(filterValue);
                        }

                        filter = column.createFilterExpression(filterValue, isExclude ? "<>" : "=", "headerFilter");
                    }
                    if(filter) {
                        filter.columnIndex = column.index;
                    }
                    filterValues.push(filter);
                });

                filterValues = gridCoreUtils.combineFilters(filterValues, isExclude ? "and" : "or");

                filters.push(filterValues);
            }
        });

        return gridCoreUtils.combineFilters(filters);
    }
};

module.exports = {
    invertFilterExpression: invertFilterExpression,
    defaultOptions: function() {
        return {
            /**
             * @name GridBaseOptions_headerFilter
             * @publicName headerFilter
             * @type object
             */
            headerFilter: {
                /**
                 * @name GridBaseOptions_headerFilter_visible
                 * @publicName visible
                 * @type boolean
                 * @default false
                 */
                visible: false,
                /**
                 * @name GridBaseOptions_headerFilter_width
                 * @publicName width
                 * @type number
                 * @default 252
                 */
                width: 252,
                /**
                 * @name GridBaseOptions_headerFilter_height
                 * @publicName height
                 * @type number
                 * @default 325
                 */
                height: 325,
                /**
                 * @name GridBaseOptions_headerFilter_searchEnabled
                 * @publicName searchEnabled
                 * @type boolean
                 * @default false
                 */
                searchEnabled: false,
                /**
                 * @name GridBaseOptions_headerFilter_texts
                 * @publicName texts
                 * @type object
                 */
                texts: {
                    /**
                     * @name GridBaseOptions_headerFilter_texts_emptyValue
                     * @publicName emptyValue
                     * @type string
                     * @default "(Blanks)"
                     */
                    emptyValue: messageLocalization.format("dxDataGrid-headerFilterEmptyValue"),
                    /**
                     * @name GridBaseOptions_headerFilter_texts_ok
                     * @publicName ok
                     * @type string
                     * @default "Ok"
                     */
                    ok: messageLocalization.format("dxDataGrid-headerFilterOK"),
                    /**
                     * @name GridBaseOptions_headerFilter_texts_cancel
                     * @publicName cancel
                     * @type string
                     * @default "Cancel"
                     */
                    cancel: messageLocalization.format("dxDataGrid-headerFilterCancel")
                }
            }
        };
    },
    controllers: {
        headerFilter: HeaderFilterController
    },

    views: {
        headerFilterView: headerFilterCore.HeaderFilterView
    },
    extenders: {
        controllers: {
            data: DataControllerFilterRowExtender
        },
        views: {
            columnHeadersView: ColumnHeadersViewHeaderFilterExtender,
            headerPanel: HeaderPanelHeaderFilterExtender
        }
    }
};
