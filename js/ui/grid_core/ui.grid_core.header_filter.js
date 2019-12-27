import eventsEngine from '../../events/core/events_engine';
import modules from './ui.grid_core.modules';
import filterUtils from '../shared/filtering';
import gridCoreUtils from './ui.grid_core.utils';
import { headerFilterMixin, HeaderFilterView, updateHeaderFilterItemSelectionState, allowHeaderFiltering } from './ui.grid_core.header_filter_core';
import messageLocalization from '../../localization/message';
import clickEvent from '../../events/click';
import { compileGetter } from '../../core/utils/data';
import { each } from '../../core/utils/iterator';
import { isDefined, isObject, isFunction } from '../../core/utils/type';
import { getDefaultAlignment } from '../../core/utils/position';
import { extend } from '../../core/utils/extend';
import { normalizeDataSourceOptions } from '../../data/data_source/data_source';
import dateLocalization from '../../localization/date';
import { isWrapped } from '../../core/utils/variable_wrapper';
import { Deferred } from '../../core/utils/deferred';
import { restoreFocus } from '../shared/accessibility';

const DATE_INTERVAL_FORMATS = {
    'month': function(value) {
        return dateLocalization.getMonthNames()[value - 1];
    },
    'quarter': function(value) {
        return dateLocalization.format(new Date(2000, value * 3 - 1), 'quarter');
    }
};

const HeaderFilterController = modules.ViewController.inherit((function() {
    const getFormatOptions = function(value, column, currentLevel) {
        const groupInterval = filterUtils.getGroupInterval(column);
        const result = gridCoreUtils.getFormatOptionsByColumn(column, 'headerFilter');

        if(groupInterval) {
            result.groupInterval = groupInterval[currentLevel];

            if(gridCoreUtils.isDateType(column.dataType)) {
                result.format = DATE_INTERVAL_FORMATS[groupInterval[currentLevel]];
            } else if(column.dataType === 'number') {
                result.getDisplayFormat = function() {
                    const formatOptions = { format: column.format, target: 'headerFilter' };
                    const firstValueText = gridCoreUtils.formatValue(value, formatOptions);
                    const secondValue = value + groupInterval[currentLevel];
                    const secondValueText = gridCoreUtils.formatValue(secondValue, formatOptions);

                    return firstValueText && secondValueText ? firstValueText + ' - ' + secondValueText : '';
                };
            }
        }

        return result;
    };

    return {
        init: function() {
            this._columnsController = this.getController('columns');
            this._dataController = this.getController('data');
            this._headerFilterView = this.getView('headerFilterView');
        },

        _updateSelectedState: function(items, column) {
            let i = items.length;
            const isExclude = column.filterType === 'exclude';

            while(i--) {
                const item = items[i];

                if('items' in items[i]) {
                    this._updateSelectedState(items[i].items, column);
                }

                updateHeaderFilterItemSelectionState(item, gridCoreUtils.getIndexByKey(items[i].value, column.filterValues, null) > -1, isExclude);
            }
        },

        _normalizeGroupItem: function(item, currentLevel, options) {
            let value;
            let displayValue;
            const path = options.path;
            const valueSelector = options.valueSelector;
            const displaySelector = options.displaySelector;
            const column = options.column;

            if(valueSelector && displaySelector) {
                value = valueSelector(item);
                displayValue = displaySelector(item);
            } else {
                value = item.key;
                displayValue = value;
            }

            if(!isObject(item)) {
                item = {};
            } else {
                item = extend({}, item);
            }

            path.push(value);

            if(path.length === 1) {
                item.value = path[0];
            } else {
                item.value = path.join('/');
            }

            item.text = this.getHeaderItemText(displayValue, column, currentLevel, options.headerFilterOptions);

            return item;
        },

        getHeaderItemText: function(displayValue, column, currentLevel, headerFilterOptions) {
            let text = gridCoreUtils.formatValue(displayValue, getFormatOptions(displayValue, column, currentLevel));

            if(!text) {
                text = headerFilterOptions.texts.emptyValue;
            }

            return text;
        },

        _processGroupItems: function(groupItems, currentLevel, path, options) {
            const that = this;
            let displaySelector;
            let valueSelector;
            const column = options.column;
            const lookup = column.lookup;
            const level = options.level;

            path = path || [];
            currentLevel = currentLevel || 0;

            if(lookup) {
                displaySelector = compileGetter(lookup.displayExpr);
                valueSelector = compileGetter(lookup.valueExpr);
            }

            for(let i = 0; i < groupItems.length; i++) {
                groupItems[i] = that._normalizeGroupItem(groupItems[i], currentLevel, {
                    column: options.column,
                    headerFilterOptions: options.headerFilterOptions,
                    displaySelector: displaySelector,
                    valueSelector: valueSelector,
                    path: path
                });

                if('items' in groupItems[i]) {
                    if(currentLevel === level || !isDefined(groupItems[i].value)) {
                        delete groupItems[i].items;
                    } else {
                        that._processGroupItems(groupItems[i].items, currentLevel + 1, path, options);
                    }
                }

                path.pop();
            }
        },

        getDataSource: function(column) {
            const that = this;
            let filter;
            let cutoffLevel;
            let origPostProcess;
            let dataSource = that._dataController.dataSource();
            const group = gridCoreUtils.getHeaderFilterGroupParameters(column, dataSource && dataSource.remoteOperations().grouping);
            const headerFilterDataSource = column.headerFilter && column.headerFilter.dataSource;
            const headerFilterOptions = that.option('headerFilter');
            let isLookup = false;
            const options = {
                component: that.component
            };

            if(!dataSource) return;

            if(isDefined(headerFilterDataSource) && !isFunction(headerFilterDataSource)) {
                options.dataSource = normalizeDataSourceOptions(headerFilterDataSource);
            } else if(column.lookup) {
                isLookup = true;
                dataSource = column.lookup.dataSource;
                if(isFunction(dataSource) && !isWrapped(dataSource)) {
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
                        const d = new Deferred();
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

            if(isFunction(headerFilterDataSource)) {
                headerFilterDataSource.call(column, options);
            }

            origPostProcess = options.dataSource.postProcess;
            options.dataSource.postProcess = function(data) {
                let items = data;

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
            const columnsController = this._columnsController;
            const column = extend(true, {}, this._columnsController.getColumns()[columnIndex]);
            if(column) {
                const visibleIndex = columnsController.getVisibleIndex(columnIndex);
                const view = isGroupPanel ? this.getView('headerPanel') : this.getView('columnHeadersView');
                var $columnElement = $columnElement || view.getColumnElements().eq(isGroupPanel ? column.groupIndex : visibleIndex);

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
            const that = this;
            const column = options.column;

            if(column) {
                const groupInterval = filterUtils.getGroupInterval(column);
                const dataSource = that._dataController.dataSource();
                const remoteFiltering = dataSource && dataSource.remoteOperations().filtering;

                extend(options, column, {
                    type: groupInterval && groupInterval.length > 1 ? 'tree' : 'list',
                    remoteFiltering: remoteFiltering,
                    onShowing: function(e) {
                        const dxResizableInstance = e.component.overlayContent().dxResizable('instance');

                        dxResizableInstance && dxResizableInstance.option('onResizeEnd', function(e) {
                            const columnsController = that.getController('columns');
                            let headerFilterByColumn = columnsController.columnOption(options.dataField, 'headerFilter');

                            headerFilterByColumn = headerFilterByColumn || {};
                            headerFilterByColumn.width = e.width;
                            headerFilterByColumn.height = e.height;

                            columnsController.columnOption(options.dataField, 'headerFilter', headerFilterByColumn, true);
                        });
                    },
                    onHidden: () => restoreFocus(this)
                });

                options.dataSource = that.getDataSource(options);

                if(options.isFilterBuilder) {
                    options.dataSource.filter = null;
                    options.alignment = 'right';
                }

                that._headerFilterView.showHeaderFilterMenu(options.columnElement, options);
            }
        },

        hideHeaderFilterMenu: function() {
            this._headerFilterView.hideHeaderFilterMenu();
        }
    };
})());

const ColumnHeadersViewHeaderFilterExtender = extend({}, headerFilterMixin, {
    _renderCellContent: function($cell, options) {
        const that = this;
        let $headerFilterIndicator;
        const column = options.column;

        if(!column.command && allowHeaderFiltering(column) && that.option('headerFilter.visible') && options.rowType === 'header') {
            $headerFilterIndicator = that._applyColumnState({
                name: 'headerFilter',
                rootElement: $cell,
                column: column,
                showColumnLines: that.option('showColumnLines')
            });

            $headerFilterIndicator && that._subscribeToIndicatorEvent($headerFilterIndicator, column, 'headerFilter');
        }

        that.callBase($cell, options);
    },

    _subscribeToIndicatorEvent: function($indicator, column, indicatorName) {
        const that = this;

        if(indicatorName === 'headerFilter') {
            eventsEngine.on($indicator, clickEvent.name, that.createAction(function(e) {
                e.event.stopPropagation();
                that.getController('headerFilter').showHeaderFilterMenu(column.index, false);
            }));
        }
    },

    _updateIndicator: function($cell, column, indicatorName) {
        const $indicator = this.callBase($cell, column, indicatorName);

        $indicator && this._subscribeToIndicatorEvent($indicator, column, indicatorName);
    },

    _updateHeaderFilterIndicators: function() {
        if(this.option('headerFilter.visible')) {
            this._updateIndicators('headerFilter');
        }
    },

    _needUpdateFilterIndicators: function() {
        return true;
    },

    _columnOptionChanged: function(e) {
        const optionNames = e.optionNames;

        if(gridCoreUtils.checkChanges(optionNames, ['filterValues', 'filterType'])) {
            if(this._needUpdateFilterIndicators()) {
                this._updateHeaderFilterIndicators();
            }
            return;
        }

        this.callBase(e);
    }
});

const HeaderPanelHeaderFilterExtender = extend({}, headerFilterMixin, {
    _createGroupPanelItem: function($rootElement, groupColumn) {
        const that = this;
        const $item = that.callBase.apply(that, arguments);
        let $headerFilterIndicator;

        if(!groupColumn.command && allowHeaderFiltering(groupColumn) && that.option('headerFilter.visible')) {
            $headerFilterIndicator = that._applyColumnState({
                name: 'headerFilter',
                rootElement: $item,
                column: {
                    alignment: getDefaultAlignment(that.option('rtlEnabled')),
                    filterValues: groupColumn.filterValues,
                    allowHeaderFiltering: true
                },
                showColumnLines: true
            });

            $headerFilterIndicator && eventsEngine.on($headerFilterIndicator, clickEvent.name, that.createAction(function(e) {
                const event = e.event;

                event.stopPropagation();
                that.getController('headerFilter').showHeaderFilterMenu(groupColumn.index, true);
            }));
        }

        return $item;
    }
});

function invertFilterExpression(filter) {
    return ['!', filter];
}

const DataControllerFilterRowExtender = {
    skipCalculateColumnFilters: function() {
        return false;
    },

    _calculateAdditionalFilter: function() {
        if(this.skipCalculateColumnFilters()) {
            return this.callBase();
        }

        const that = this;
        const filters = [that.callBase()];
        const columns = that._columnsController.getVisibleColumns(null, true);
        const headerFilterController = that.getController('headerFilter');
        const currentColumn = headerFilterController.getCurrentColumn();

        each(columns, function(_, column) {
            let filter;

            if(currentColumn && currentColumn.index === column.index) {
                return;
            }

            if(allowHeaderFiltering(column) && column.calculateFilterExpression && Array.isArray(column.filterValues) && column.filterValues.length) {
                let filterValues = [];

                each(column.filterValues, function(_, filterValue) {

                    if(Array.isArray(filterValue)) {
                        filter = filterValue;
                    } else {
                        if(column.deserializeValue && !gridCoreUtils.isDateType(column.dataType) && column.dataType !== 'number') {
                            filterValue = column.deserializeValue(filterValue);
                        }

                        filter = column.createFilterExpression(filterValue, '=', 'headerFilter');
                    }
                    if(filter) {
                        filter.columnIndex = column.index;
                    }
                    filterValues.push(filter);
                });

                filterValues = gridCoreUtils.combineFilters(filterValues, 'or');

                filters.push(column.filterType === 'exclude' ? ['!', filterValues] : filterValues);
            }
        });

        return gridCoreUtils.combineFilters(filters);
    }
};

module.exports = {
    invertFilterExpression: invertFilterExpression,
    defaultOptions: function() {
        return {
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
                    emptyValue: messageLocalization.format('dxDataGrid-headerFilterEmptyValue'),
                    /**
                     * @name GridBaseOptions.headerFilter.texts.ok
                     * @type string
                     * @default "Ok"
                     */
                    ok: messageLocalization.format('dxDataGrid-headerFilterOK'),
                    /**
                     * @name GridBaseOptions.headerFilter.texts.cancel
                     * @type string
                     * @default "Cancel"
                     */
                    cancel: messageLocalization.format('dxDataGrid-headerFilterCancel')
                }
            }
        };
    },
    controllers: {
        headerFilter: HeaderFilterController
    },

    views: {
        headerFilterView: HeaderFilterView
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
