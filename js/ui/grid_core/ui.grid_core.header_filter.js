var eventsEngine = require("../../events/core/events_engine"),
    modules = require("./ui.grid_core.modules"),
    filterUtils = require("../shared/filtering"),
    gridCoreUtils = require("./ui.grid_core.utils"),
    headerFilterCore = require("./ui.grid_core.header_filter_core"),
    headerFilterMixin = headerFilterCore.headerFilterMixin,
    messageLocalization = require("../../localization/message"),
    allowHeaderFiltering = headerFilterCore.allowHeaderFiltering,
    clickEvent = require("../../events/click"),
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
        var groupInterval = filterUtils.getGroupInterval(column),
            result = gridCoreUtils.getFormatOptionsByColumn(column, "headerFilter");

        if(groupInterval) {
            result.groupInterval = groupInterval[currentLevel];

            if(gridCoreUtils.isDateType(column.dataType)) {
                result.format = DATE_INTERVAL_FORMATS[groupInterval[currentLevel]];
            } else if(column.dataType === "number") {
                result.getDisplayFormat = function() {
                    var formatOptions = { format: column.format, target: "headerFilter" },
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

            if(!typeUtils.isObject(item)) {
                item = {};
            } else if(item === value) {
                item = extend({}, item);
            }

            path.push(value);

            if(path.length === 1) {
                item.value = path[0];
            } else {
                item.value = path.join("/");
            }

            item.text = this.getHeaderItemText(displayValue, column, currentLevel, options.headerFilterOptions);

            delete item.key;
            return item;
        },

        getHeaderItemText: function(displayValue, column, currentLevel, headerFilterOptions) {
            var text = gridCoreUtils.formatValue(displayValue, getFormatOptions(displayValue, column, currentLevel));

            if(!text) {
                text = headerFilterOptions.texts.emptyValue;
            }

            return text;
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
                isLookup = false,
                options = {
                    component: that.component
                };

            if(!dataSource) return;

            if(typeUtils.isDefined(headerFilterDataSource) && !typeUtils.isFunction(headerFilterDataSource)) {
                options.dataSource = normalizeDataSourceOptions(headerFilterDataSource);
            } else if(column.lookup) {
                isLookup = true;
                dataSource = column.lookup.dataSource;
                if(typeUtils.isFunction(dataSource) && !isWrapped(dataSource)) {
                    dataSource = dataSource({});
                }
                dataSource = normalizeDataSourceOptions(dataSource);
                options.dataSource = dataSource;
            } else {
                cutoffLevel = Array.isArray(group) ? group.length - 1 : 0;

                that._currentColumn = column;
                filter = that._dataController.getCombinedFilter();
                that._currentColumn = null;

                options.dataSource = {
                    filter: filter,
                    group: group,
                    useDefaultSearch: true,
                    load: function(options) {
                        var d = new Deferred();
                        // TODO remove in 16.1
                        options.dataField = column.dataField || column.name;

                        dataSource.load(options).done(function(data) {
                            that._processGroupItems(data, null, null, {
                                level: cutoffLevel,
                                column: column,
                                headerFilterOptions: headerFilterOptions
                            });
                            d.resolve(data);
                        }).fail(d.reject);

                        return d;
                    }
                };
            }

            if(typeUtils.isFunction(headerFilterDataSource)) {
                headerFilterDataSource.call(column, options);
            }

            origPostProcess = options.dataSource.postProcess;
            options.dataSource.postProcess = function(data) {
                var items = data;

                if(isLookup) {
                    if(this.pageIndex() === 0 && !this.searchValue()) {
                        items = items.slice(0);
                        items.unshift(null);
                    }
                    that._processGroupItems(items, null, null, {
                        level: 0,
                        column: column,
                        headerFilterOptions: headerFilterOptions
                    });
                }

                items = origPostProcess && origPostProcess.call(this, items) || items;
                that._updateSelectedState(items, column);
                return items;
            };

            return options.dataSource;
        },

        getCurrentColumn: function() {
            return this._currentColumn;
        },

        showHeaderFilterMenu: function(columnIndex, isGroupPanel) {
            var columnsController = this._columnsController,
                column = extend(true, {}, this._columnsController.getColumns()[columnIndex]);
            if(column) {
                var visibleIndex = columnsController.getVisibleIndex(columnIndex),
                    view = isGroupPanel ? this.getView("headerPanel") : this.getView("columnHeadersView"),
                    $columnElement = $columnElement || view.getColumnElements().eq(isGroupPanel ? column.groupIndex : visibleIndex);

                this.showHeaderFilterMenuBase({
                    columnElement: $columnElement,
                    column: column,
                    applyFilter: true,
                    apply: function() {
                        columnsController.columnOption(columnIndex, {
                            filterValues: this.filterValues,
                            filterType: this.filterType
                        });
                    }
                });
            }
        },

        showHeaderFilterMenuBase: function(options) {
            var that = this,
                column = options.column;

            if(column) {
                var groupInterval = filterUtils.getGroupInterval(column);

                extend(options, column, {
                    type: groupInterval && groupInterval.length > 1 ? "tree" : "list",
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

                if(options.isFilterBuilder) {
                    options.dataSource.filter = null;
                    options.alignment = "right";
                }

                that._headerFilterView.showHeaderFilterMenu(options.columnElement, options);
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
                var event = e.event;

                event.stopPropagation();
                that.getController("headerFilter").showHeaderFilterMenu(column.index, false);
            }));
        }
    },

    _updateIndicator: function($cell, column, indicatorName) {
        var $indicator = this.callBase($cell, column, indicatorName);

        $indicator && this._subscribeToIndicatorEvent($indicator, column, indicatorName);
    },

    _updateHeaderFilterIndicators: function() {
        if(this.option("headerFilter.visible")) {
            this._updateIndicators("headerFilter");
        }
    },

    _needUpdateFilterIndicators: function() {
        return true;
    },

    _columnOptionChanged: function(e) {
        var optionNames = e.optionNames;

        if(gridCoreUtils.checkChanges(optionNames, ["filterValues", "filterType"])) {
            if(this._needUpdateFilterIndicators()) {
                this._updateHeaderFilterIndicators();
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
                var event = e.event;

                event.stopPropagation();
                that.getController("headerFilter").showHeaderFilterMenu(groupColumn.index, true);
            }));
        }

        return $item;
    }
});

function invertFilterExpression(filter) {
    return ["!", filter];
}

var DataControllerFilterRowExtender = {
    skipCalculateColumnFilters: function() {
        return false;
    },

    _calculateAdditionalFilter: function() {
        if(this.skipCalculateColumnFilters()) {
            return this.callBase();
        }

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
                var filterValues = [];

                each(column.filterValues, function(_, filterValue) {

                    if(Array.isArray(filterValue)) {
                        filter = filterValue;
                    } else {
                        if(column.deserializeValue && !gridCoreUtils.isDateType(column.dataType) && column.dataType !== "number") {
                            filterValue = column.deserializeValue(filterValue);
                        }

                        filter = column.createFilterExpression(filterValue, "=", "headerFilter");
                    }
                    if(filter) {
                        filter.columnIndex = column.index;
                    }
                    filterValues.push(filter);
                });

                filterValues = gridCoreUtils.combineFilters(filterValues, "or");

                filters.push(column.filterType === "exclude" ? ["!", filterValues] : filterValues);
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
             * @name GridBaseOptions.headerFilter
             * @type object
             */
            headerFilter: {
                /**
                 * @name GridBaseOptions.headerFilter.visible
                 * @type boolean
                 * @default false
                 */
                visible: false,
                /**
                 * @name GridBaseOptions.headerFilter.width
                 * @type number
                 * @default 252
                 */
                width: 252,
                /**
                 * @name GridBaseOptions.headerFilter.height
                 * @type number
                 * @default 325
                 */
                height: 325,
                /**
                 * @name GridBaseOptions.headerFilter.allowSearch
                 * @type boolean
                 * @default false
                 */
                allowSearch: false,
                /**
                 * @name GridBaseOptions.headerFilter.searchTimeout
                 * @type number
                 * @default 500
                 */
                searchTimeout: 500,
                /**
                 * @name GridBaseOptions.headerFilter.texts
                 * @type object
                 */
                texts: {
                    /**
                     * @name GridBaseOptions.headerFilter.texts.emptyValue
                     * @type string
                     * @default "(Blanks)"
                     */
                    emptyValue: messageLocalization.format("dxDataGrid-headerFilterEmptyValue"),
                    /**
                     * @name GridBaseOptions.headerFilter.texts.ok
                     * @type string
                     * @default "Ok"
                     */
                    ok: messageLocalization.format("dxDataGrid-headerFilterOK"),
                    /**
                     * @name GridBaseOptions.headerFilter.texts.cancel
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
