import $ from '../../core/renderer';
import modules from './ui.grid_core.modules';
import gridCoreUtils from './ui.grid_core.utils';
import ArrayStore from '../../data/array_store';
import CustomStore from '../../data/custom_store';
import errors from '../widget/ui.errors';
import { noop, deferRender, equalByValue } from '../../core/utils/common';
import { each } from '../../core/utils/iterator';
import typeUtils from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import DataHelperMixin from '../../data_helper';
import { when, Deferred } from '../../core/utils/deferred';
import { findChanges } from '../../core/utils/array_compare';

module.exports = {
    defaultOptions: function() {
        return {
            loadingTimeout: 0,
            dataSource: null,
            cacheEnabled: true,
            repaintChangesOnly: false,
            highlightChanges: false,
            onDataErrorOccurred: null,
            remoteOperations: 'auto',
            /**
             * @name dxDataGridOptions.remoteOperations.sorting
             * @type boolean
             * @default false
             */
            /**
             * @name dxDataGridOptions.remoteOperations.filtering
             * @type boolean
             * @default false
             */
            /**
             * @name dxDataGridOptions.remoteOperations.paging
             * @type boolean
             * @default false
             */
            /**
             * @name dxDataGridOptions.remoteOperations.grouping
             * @type boolean
             * @default false
             */
            /**
             * @name dxDataGridOptions.remoteOperations.groupPaging
             * @type boolean
             * @default false
             */
            /**
             * @name dxDataGridOptions.remoteOperations.summary
             * @type boolean
             * @default false
             */
            /**
             * @name dxTreeListOptions.remoteOperations.sorting
             * @type boolean
             * @default false
             */
            /**
             * @name dxTreeListOptions.remoteOperations.filtering
             * @type boolean
             * @default false
             */
            /**
             * @name dxTreeListOptions.remoteOperations.grouping
             * @type boolean
             * @default false
             */
            paging: {
                enabled: true,
                pageSize: undefined,
                pageIndex: undefined
            }
        };
    },
    controllers: {
        data: modules.Controller.inherit({}).include(DataHelperMixin).inherit((function() {
            const changePaging = function(that, optionName, value) {
                const dataSource = that._dataSource;

                if(dataSource) {
                    if(value !== undefined) {
                        if(dataSource[optionName]() !== value) {
                            if(optionName === 'pageSize') {
                                dataSource.pageIndex(0);
                            }
                            dataSource[optionName](value);

                            that._skipProcessingPagingChange = true;
                            that.option('paging.' + optionName, value);
                            that._skipProcessingPagingChange = false;

                            return dataSource[optionName === 'pageIndex' ? 'load' : 'reload']()
                                .done(that.pageChanged.fire.bind(that.pageChanged));
                        }
                        return Deferred().resolve().promise();
                    }
                    return dataSource[optionName]();
                }

                return 0;
            };

            const members = {
                init: function() {
                    const that = this;
                    that._items = [];
                    that._columnsController = that.getController('columns');

                    that._columnsChangedHandler = that._handleColumnsChanged.bind(that);
                    that._dataChangedHandler = that._handleDataChanged.bind(that);
                    that._loadingChangedHandler = that._handleLoadingChanged.bind(that);
                    that._loadErrorHandler = that._handleLoadError.bind(that);
                    that._customizeStoreLoadOptionsHandler = that._handleCustomizeStoreLoadOptions.bind(that);
                    that._changingHandler = that._handleChanging.bind(that);

                    that._columnsController.columnsChanged.add(that._columnsChangedHandler);

                    that._isLoading = false;
                    that._isCustomLoading = false;
                    that._repaintChangesOnly = undefined;
                    that._changes = [];

                    that.createAction('onDataErrorOccurred');

                    that.dataErrorOccurred.add(function(error) {
                        return that.executeAction('onDataErrorOccurred', { error: error });
                    });

                    that._refreshDataSource();
                },
                callbackNames: function() {
                    return ['changed', 'loadingChanged', 'dataErrorOccurred', 'pageChanged', 'dataSourceChanged'];
                },
                callbackFlags: function(name) {
                    if(name === 'dataErrorOccurred') {
                        return { stopOnFalse: true };
                    }
                },
                publicMethods: function() {
                    return [
                        'beginCustomLoading',
                        'endCustomLoading',
                        'refresh',
                        'filter',
                        'clearFilter',
                        'getCombinedFilter',
                        'keyOf',
                        'byKey',
                        'getDataByKeys',
                        'pageIndex',
                        'pageSize',
                        'pageCount',
                        'totalCount',
                        '_disposeDataSource',
                        'getKeyByRowIndex',
                        'getRowIndexByKey',
                        'getDataSource',
                        'getVisibleRows',
                        'repaintRows'
                    ];
                },
                reset: function() {
                    this._columnsController.reset();
                    this._items = [];
                    this._refreshDataSource();
                },
                optionChanged: function(args) {
                    const that = this;
                    let dataSource;

                    function handled() {
                        args.handled = true;
                    }

                    if(args.name === 'dataSource' && args.name === args.fullName && (args.value === args.previousValue || (that.option('columns') && Array.isArray(args.value) && Array.isArray(args.previousValue)))) {
                        if(args.value !== args.previousValue) {
                            const store = that.store();
                            if(store) {
                                store._array = args.value;
                            }
                        }
                        handled();
                        that.refresh(that.option('repaintChangesOnly'));
                        return;
                    }

                    switch(args.name) {
                        case 'cacheEnabled':
                        case 'repaintChangesOnly':
                        case 'highlightChanges':
                        case 'loadingTimeout':
                            handled();
                            break;
                        case 'remoteOperations':
                        case 'keyExpr':
                        case 'dataSource':
                        case 'scrolling':
                            handled();
                            that.reset();
                            break;
                        case 'paging':
                            dataSource = that.dataSource();
                            if(dataSource && that._setPagingOptions(dataSource)) {
                                dataSource.load().done(that.pageChanged.fire.bind(that.pageChanged));
                            }
                            handled();
                            break;
                        case 'rtlEnabled':
                            that.reset();
                            break;
                        case 'columns':
                            dataSource = that.dataSource();
                            if(dataSource && dataSource.isLoading() && args.name === args.fullName) {
                                dataSource.load();
                            }
                            break;
                        default:
                            that.callBase(args);
                    }
                },
                isReady: function() {
                    return !this._isLoading;
                },

                getDataSource: function() {
                    return this._dataSource && this._dataSource._dataSource;
                },
                getCombinedFilter: function(returnDataField) {
                    return this.combinedFilter(undefined, returnDataField);
                },
                combinedFilter: function(filter, returnDataField) {
                    const that = this;
                    const dataSource = that._dataSource;
                    const columnsController = that._columnsController;
                    let additionalFilter;

                    if(dataSource) {
                        if(filter === undefined) {
                            filter = dataSource.filter();
                        }

                        additionalFilter = that._calculateAdditionalFilter();
                        if(additionalFilter) {
                            if(columnsController.isDataSourceApplied() || columnsController.isAllDataTypesDefined()) {
                                filter = gridCoreUtils.combineFilters([additionalFilter, filter]);
                            }
                        }

                        filter = columnsController.updateFilter(filter, returnDataField || dataSource.remoteOperations().filtering);
                    }
                    return filter;
                },
                waitReady: function() {
                    if(this._updateLockCount) {
                        this._readyDeferred = new Deferred();
                        return this._readyDeferred;
                    }
                    return when();
                },
                _endUpdateCore: function() {
                    const changes = this._changes;

                    if(changes.length) {
                        this._changes = [];
                        const repaintChangesOnly = changes.every(change => change.repaintChangesOnly);
                        this.updateItems(changes.length === 1 ? changes[0] : { repaintChangesOnly: repaintChangesOnly });
                    }

                    if(this._readyDeferred) {
                        this._readyDeferred.resolve();
                        this._readyDeferred = null;
                    }
                },
                // Handlers
                _handleCustomizeStoreLoadOptions: function(e) {
                    const columnsController = this._columnsController;
                    const dataSource = this._dataSource;
                    const storeLoadOptions = e.storeLoadOptions;

                    if(e.isCustomLoading && !storeLoadOptions.isLoadingAll) {
                        return;
                    }

                    storeLoadOptions.filter = this.combinedFilter(storeLoadOptions.filter);

                    if(!columnsController.isDataSourceApplied()) {
                        columnsController.updateColumnDataTypes(dataSource);
                    }
                    this._columnsUpdating = true;
                    columnsController.updateSortingGrouping(dataSource, !this._isFirstLoading);
                    this._columnsUpdating = false;

                    storeLoadOptions.sort = columnsController.getSortDataSourceParameters();
                    storeLoadOptions.group = columnsController.getGroupDataSourceParameters();
                    dataSource.sort(storeLoadOptions.sort);
                    dataSource.group(storeLoadOptions.group);

                    storeLoadOptions.sort = columnsController.getSortDataSourceParameters(!dataSource.remoteOperations().sorting);

                    e.group = columnsController.getGroupDataSourceParameters(!dataSource.remoteOperations().grouping);
                },
                _handleColumnsChanged: function(e) {
                    const that = this;
                    const changeTypes = e.changeTypes;
                    const optionNames = e.optionNames;
                    let filterValue;
                    let filterValues;
                    let filterApplied;

                    // B255430
                    const updateItemsHandler = function() {
                        that._columnsController.columnsChanged.remove(updateItemsHandler);
                        that.updateItems();
                    };

                    if(changeTypes.sorting || changeTypes.grouping) {
                        if(that._dataSource && !that._columnsUpdating) {
                            that._dataSource.group(that._columnsController.getGroupDataSourceParameters());
                            that._dataSource.sort(that._columnsController.getSortDataSourceParameters());
                            that.reload();
                        }
                    } else if(changeTypes.columns) {
                        if(optionNames.filterValues || optionNames.filterValue || optionNames.selectedFilterOperation) {
                            filterValue = that._columnsController.columnOption(e.columnIndex, 'filterValue');
                            filterValues = that._columnsController.columnOption(e.columnIndex, 'filterValues');

                            if(Array.isArray(filterValues) || e.columnIndex === undefined || typeUtils.isDefined(filterValue) || !optionNames.selectedFilterOperation || optionNames.filterValue) {
                                that._applyFilter();
                                filterApplied = true;
                            }
                        }

                        if(!that._needApplyFilter && !gridCoreUtils.checkChanges(optionNames, ['width', 'visibleWidth', 'filterValue', 'bufferedFilterValue', 'selectedFilterOperation', 'filterValues', 'filterType'])) {
                            // TODO remove resubscribing
                            that._columnsController.columnsChanged.add(updateItemsHandler);
                        }

                        if(typeUtils.isDefined(optionNames.visible)) {
                            const column = that._columnsController.columnOption(e.columnIndex);
                            if(column && (typeUtils.isDefined(column.filterValue) || typeUtils.isDefined(column.filterValues))) {
                                that._applyFilter();
                                filterApplied = true;
                            }
                        }
                    }
                    if(!filterApplied && changeTypes.filtering) {
                        that.reload();
                    }
                },
                _handleDataChanged: function(e) {
                    const that = this;
                    const dataSource = that._dataSource;
                    const columnsController = that._columnsController;
                    let isAsyncDataSourceApplying = false;

                    this._isFirstLoading = false;

                    if(dataSource && !that._isDataSourceApplying) {
                        that._isDataSourceApplying = true;

                        when(that._columnsController.applyDataSource(dataSource)).done(function() {
                            if(that._isLoading) {
                                that._handleLoadingChanged(false);
                            }

                            if(isAsyncDataSourceApplying && e && e.isDelayed) {
                                e.isDelayed = false;
                            }

                            that._isDataSourceApplying = false;

                            const hasAdditionalFilter = () => {
                                const additionalFilter = that._calculateAdditionalFilter();
                                return additionalFilter && additionalFilter.length;
                            };
                            const needApplyFilter = that._needApplyFilter;

                            that._needApplyFilter = false;

                            if(needApplyFilter && !that._isAllDataTypesDefined && hasAdditionalFilter()) {
                                errors.log('W1005', that.component.NAME);
                                that._applyFilter();
                            } else {
                                that.updateItems(e, true);
                            }
                        }).fail(function() {
                            that._isDataSourceApplying = false;
                        });
                        if(that._isDataSourceApplying) {
                            isAsyncDataSourceApplying = true;
                            that._handleLoadingChanged(true);
                        }

                        that._needApplyFilter = !that._columnsController.isDataSourceApplied();
                        that._isAllDataTypesDefined = columnsController.isAllDataTypesDefined();
                    }
                },
                _handleLoadingChanged: function(isLoading) {
                    this._isLoading = isLoading;
                    this._fireLoadingChanged();
                },
                _handleLoadError: function(e) {
                    this.dataErrorOccurred.fire(e);
                },
                fireError: function() {
                    this.dataErrorOccurred.fire(errors.Error.apply(errors, arguments));
                },
                _setPagingOptions: function(dataSource) {
                    const pageIndex = this.option('paging.pageIndex');
                    const pageSize = this.option('paging.pageSize');
                    const pagingEnabled = this.option('paging.enabled');
                    const scrollingMode = this.option('scrolling.mode');
                    const appendMode = scrollingMode === 'infinite';
                    const virtualMode = scrollingMode === 'virtual';
                    const paginate = pagingEnabled || virtualMode || appendMode;
                    let isChanged = false;

                    dataSource.requireTotalCount(!appendMode);
                    if(pagingEnabled !== undefined && dataSource.paginate() !== paginate) {
                        dataSource.paginate(paginate);
                        isChanged = true;
                    }
                    if(pageSize !== undefined && dataSource.pageSize() !== pageSize) {
                        dataSource.pageSize(pageSize);
                        isChanged = true;
                    }
                    if(pageIndex !== undefined && dataSource.pageIndex() !== pageIndex) {
                        dataSource.pageIndex(pageIndex);
                        isChanged = true;
                    }

                    return isChanged;
                },
                _getSpecificDataSourceOption: function() {
                    const dataSource = this.option('dataSource');

                    if(Array.isArray(dataSource)) {
                        return {
                            store: {
                                type: 'array',
                                data: dataSource,
                                key: this.option('keyExpr')
                            }
                        };
                    }

                    return dataSource;
                },
                _initDataSource: function() {
                    const that = this;
                    let dataSource = this.option('dataSource');
                    const oldDataSource = this._dataSource;

                    that.callBase();
                    dataSource = that._dataSource;
                    that._isFirstLoading = true;
                    if(dataSource) {
                        that._setPagingOptions(dataSource);
                        that.setDataSource(dataSource);
                    } else if(oldDataSource) {
                        that.updateItems();
                    }
                },
                _loadDataSource: function() {
                    const that = this;
                    const dataSource = that._dataSource;
                    const result = new Deferred();

                    when(this._columnsController.refresh(true)).always(function() {
                        if(dataSource) {
                            dataSource.load().done(result.resolve).fail(result.reject);
                        } else {
                            result.resolve();
                        }
                    });

                    return result.promise();
                },
                _beforeProcessItems: function(items) {
                    return items.slice(0);
                },
                getRowIndexDelta: function() {
                    return 0;
                },
                _processItems: function(items, change) {
                    const that = this;
                    const rowIndexDelta = that.getRowIndexDelta();
                    const changeType = change.changeType;
                    const visibleColumns = that._columnsController.getVisibleColumns(null, changeType === 'loadingAll');
                    const visibleItems = that._items;
                    const dataIndex = changeType === 'append' && visibleItems.length > 0 ? visibleItems[visibleItems.length - 1].dataIndex + 1 : 0;
                    const options = {
                        visibleColumns: visibleColumns,
                        dataIndex: dataIndex
                    };
                    const result = [];

                    each(items, function(index, item) {
                        if(typeUtils.isDefined(item)) {
                            options.rowIndex = index - rowIndexDelta;
                            item = that._processItem(item, options);
                            result.push(item);
                        }
                    });
                    return result;
                },
                _processItem: function(item, options) {
                    item = this._generateDataItem(item, options);
                    item = this._processDataItem(item, options);
                    item.dataIndex = options.dataIndex++;
                    return item;
                },
                _generateDataItem: function(data) {
                    return {
                        rowType: 'data',
                        data: data,
                        key: this.keyOf(data)
                    };
                },
                _processDataItem: function(dataItem, options) {
                    dataItem.values = this.generateDataValues(dataItem.data, options.visibleColumns);
                    return dataItem;
                },
                generateDataValues: function(data, columns, isModified) {
                    const values = [];
                    let column;
                    let value;

                    for(let i = 0; i < columns.length; i++) {
                        column = columns[i];
                        value = isModified ? undefined : null;
                        if(!column.command) {
                            if(column.calculateCellValue) {
                                value = column.calculateCellValue(data);
                            } else if(column.dataField) {
                                value = data[column.dataField];
                            }
                        }
                        values.push(value);

                    }
                    return values;
                },
                _applyChange: function(change) {
                    const that = this;

                    if(change.changeType === 'update') {
                        that._applyChangeUpdate(change);
                    } else if(that.items().length && change.repaintChangesOnly && change.changeType === 'refresh') {
                        that._applyChangesOnly(change);
                    } else if(change.changeType === 'refresh') {
                        that._applyChangeFull(change);
                    }
                },
                _applyChangeFull: function(change) {
                    this._items = change.items.slice(0);
                },
                _getRowIndices: function(change) {
                    const rowIndices = change.rowIndices.slice(0);
                    const rowIndexDelta = this.getRowIndexDelta();

                    rowIndices.sort(function(a, b) { return a - b; });

                    for(let i = 0; i < rowIndices.length; i++) {
                        let correctedRowIndex = rowIndices[i];

                        if(change.allowInvisibleRowIndices) {
                            correctedRowIndex += rowIndexDelta;
                        }

                        if(correctedRowIndex < 0) {
                            rowIndices.splice(i, 1);
                            i--;
                        }
                    }

                    return rowIndices;
                },
                _applyChangeUpdate: function(change) {
                    const that = this;
                    const items = change.items;
                    const rowIndices = that._getRowIndices(change);
                    const rowIndexDelta = that.getRowIndexDelta();
                    const repaintChangesOnly = that.option('repaintChangesOnly');
                    let prevIndex = -1;
                    let rowIndexCorrection = 0;
                    let changeType;

                    change.items = [];
                    change.rowIndices = [];
                    change.columnIndices = [];
                    change.changeTypes = [];

                    const equalItems = function(item1, item2, strict) {
                        let result = item1 && item2 && equalByValue(item1.key, item2.key);
                        if(result && strict) {
                            result = item1.rowType === item2.rowType && (item2.rowType !== 'detail' || item1.isEditing === item2.isEditing);
                        }
                        return result;
                    };

                    each(rowIndices, function(index, rowIndex) {
                        let columnIndices;

                        rowIndex += rowIndexCorrection + rowIndexDelta;

                        if(prevIndex === rowIndex) return;

                        prevIndex = rowIndex;
                        const oldItem = that._items[rowIndex];
                        const oldNextItem = that._items[rowIndex + 1];
                        const newItem = items[rowIndex];
                        const newNextItem = items[rowIndex + 1];

                        const strict = equalItems(oldItem, oldNextItem) || equalItems(newItem, newNextItem);

                        if(newItem) {
                            newItem.rowIndex = rowIndex;
                            change.items.push(newItem);
                        }

                        if(oldItem && newItem && equalItems(oldItem, newItem, strict)) {
                            changeType = 'update';
                            that._items[rowIndex] = newItem;
                            if(oldItem.visible !== newItem.visible) {
                                change.items.splice(-1, 1, { visible: newItem.visible });
                            } else if(repaintChangesOnly && !change.isFullUpdate) {
                                columnIndices = that._partialUpdateRow(oldItem, newItem, rowIndex - rowIndexDelta);
                            }
                        } else if(newItem && !oldItem || (newNextItem && equalItems(oldItem, newNextItem, strict))) {
                            changeType = 'insert';
                            that._items.splice(rowIndex, 0, newItem);
                            rowIndexCorrection++;
                        } else if(oldItem && !newItem || (oldNextItem && equalItems(newItem, oldNextItem, strict))) {
                            changeType = 'remove';
                            that._items.splice(rowIndex, 1);
                            rowIndexCorrection--;
                            prevIndex = -1;
                        } else if(newItem) {
                            changeType = 'update';
                            that._items[rowIndex] = newItem;
                        } else {
                            return;
                        }

                        change.rowIndices.push(rowIndex - rowIndexDelta);
                        change.changeTypes.push(changeType);
                        change.columnIndices.push(columnIndices);
                    });
                },
                _isCellChanged: function(oldRow, newRow, visibleRowIndex, columnIndex, isLiveUpdate) {
                    if(JSON.stringify(oldRow.values[columnIndex]) !== JSON.stringify(newRow.values[columnIndex])) {
                        return true;
                    }

                    function isCellModified(row, columnIndex) {
                        return row.modifiedValues ? row.modifiedValues[columnIndex] !== undefined : false;
                    }

                    if(isCellModified(oldRow, columnIndex) !== isCellModified(newRow, columnIndex)) {
                        return true;
                    }

                    return false;
                },
                _getChangedColumnIndices: function(oldItem, newItem, visibleRowIndex, isLiveUpdate) {
                    if(oldItem.rowType === newItem.rowType && newItem.rowType !== 'group' && newItem.rowType !== 'groupFooter') {
                        const columnIndices = [];

                        if(newItem.rowType !== 'detail') {
                            for(let columnIndex = 0; columnIndex < oldItem.values.length; columnIndex++) {
                                if(this._isCellChanged(oldItem, newItem, visibleRowIndex, columnIndex, isLiveUpdate)) {
                                    columnIndices.push(columnIndex);
                                }
                            }
                        }

                        return columnIndices;
                    }
                },
                _partialUpdateRow: function(oldItem, newItem, visibleRowIndex, isLiveUpdate) {
                    const changedColumnIndices = this._getChangedColumnIndices(oldItem, newItem, visibleRowIndex, isLiveUpdate);

                    if(changedColumnIndices) {
                        oldItem.cells && oldItem.cells.forEach(function(cell, columnIndex) {
                            const isCellChanged = changedColumnIndices.indexOf(columnIndex) >= 0;
                            if(!isCellChanged && cell && cell.update) {
                                cell.update(newItem);
                            }
                        });

                        newItem.update = oldItem.update;
                        newItem.watch = oldItem.watch;
                        newItem.cells = oldItem.cells;

                        if(isLiveUpdate) {
                            newItem.oldValues = oldItem.values;
                        }

                        oldItem.update && oldItem.update(newItem);
                    }

                    return changedColumnIndices;
                },
                _isItemEquals: function(item1, item2) {
                    if(JSON.stringify(item1.values) !== JSON.stringify(item2.values)) {
                        return false;
                    }

                    const compareFields = ['modified', 'isNewRow', 'removed', 'isEditing'];
                    if(compareFields.some(field => item1[field] !== item2[field])) {
                        return false;
                    }

                    if(item1.rowType === 'group' || item1.rowType === 'groupFooter') {
                        if(item1.isExpanded !== item2.isExpanded || JSON.stringify(item1.summaryCells) !== JSON.stringify(item2.summaryCells)) {
                            return false;
                        }
                    }

                    return true;
                },
                _applyChangesOnly: function(change) {
                    const rowIndices = [];
                    const columnIndices = [];
                    const changeTypes = [];
                    const items = [];
                    const newIndexByKey = {};

                    function getRowKey(row) {
                        if(row) {
                            return row.rowType + ',' + JSON.stringify(row.key);
                        }
                    }

                    const isItemEquals = (item1, item2) => {
                        if(!this._isItemEquals(item1, item2)) {
                            return false;
                        }

                        if(item1.cells) {
                            item1.update && item1.update(item2);
                            item1.cells.forEach(function(cell) {
                                if(cell && cell.update) {
                                    cell.update(item2);
                                }
                            });
                        }

                        return true;
                    };

                    const oldItems = this._items.slice();
                    change.items.forEach(function(item, index) {
                        const key = getRowKey(item);
                        newIndexByKey[key] = index;
                        item.rowIndex = index;
                    });

                    const result = findChanges(oldItems, change.items, getRowKey, isItemEquals);

                    if(!result) {
                        this._applyChangeFull(change);
                        return;
                    }

                    result.forEach((change) => {
                        switch(change.type) {
                            case 'update': {
                                const index = change.index;
                                const newItem = change.data;
                                const oldItem = change.oldItem;
                                const changedColumnIndices = this._partialUpdateRow(oldItem, newItem, index, true);

                                rowIndices.push(index);
                                changeTypes.push('update');
                                items.push(newItem);
                                this._items[index] = newItem;
                                columnIndices.push(changedColumnIndices);
                                break;
                            }
                            case 'insert':
                                rowIndices.push(change.index);
                                changeTypes.push('insert');
                                items.push(change.data);
                                columnIndices.push(undefined);
                                this._items.splice(change.index, 0, change.data);
                                break;
                            case 'remove':
                                rowIndices.push(change.index);
                                changeTypes.push('remove');
                                this._items.splice(change.index, 1);
                                items.push(change.oldItem);
                                columnIndices.push(undefined);
                                break;
                        }
                    });

                    change.repaintChangesOnly = true;
                    change.changeType = 'update';
                    change.rowIndices = rowIndices;
                    change.columnIndices = columnIndices;
                    change.changeTypes = changeTypes;
                    change.items = items;
                    if(oldItems.length) {
                        change.isLiveUpdate = true;
                    }

                    this._correctRowIndices(function getRowIndexCorrection(rowIndex) {
                        const oldItem = oldItems[rowIndex];
                        const key = getRowKey(oldItem);
                        const newRowIndex = newIndexByKey[key];

                        return newRowIndex >= 0 ? newRowIndex - rowIndex : 0;
                    });
                },
                _correctRowIndices: noop,
                _updateItemsCore: function(change) {
                    const that = this;
                    let items;
                    let oldItems;
                    const dataSource = that._dataSource;
                    const changeType = change.changeType || 'refresh';

                    change.changeType = changeType;

                    if(dataSource) {
                        items = change.items || dataSource.items();
                        items = that._beforeProcessItems(items);
                        items = that._processItems(items, change);

                        change.items = items;
                        oldItems = that._items.length === items.length && that._items;

                        that._applyChange(change);

                        each(that._items, function(index, item) {
                            item.rowIndex = index;
                            if(oldItems) {
                                item.cells = oldItems[index].cells || [];
                            }
                        });
                    } else {
                        that._items = [];
                    }
                },
                _handleChanging: function(e) {
                    const that = this;
                    const rows = that.getVisibleRows();
                    const dataSource = that.dataSource();

                    if(dataSource) {
                        e.changes.forEach(function(change) {
                            if(change.type === 'insert' && change.index >= 0) {
                                let dataIndex = 0;
                                let row;

                                for(let i = 0; i < change.index; i++) {
                                    row = rows[i];
                                    if(row && (row.rowType === 'data' || row.rowType === 'group')) {
                                        dataIndex++;
                                    }
                                }

                                change.index = dataIndex;
                            }
                        });
                    }
                },
                updateItems: function(change, isDataChanged) {
                    change = change || {};
                    const that = this;

                    if(that._repaintChangesOnly !== undefined) {
                        change.repaintChangesOnly = that._repaintChangesOnly;
                    } else if(change.changes) {
                        change.repaintChangesOnly = that.option('repaintChangesOnly');
                    } else if(isDataChanged) {
                        const operationTypes = that.dataSource().operationTypes();

                        change.repaintChangesOnly = operationTypes && !operationTypes.grouping && !operationTypes.filtering && that.option('repaintChangesOnly');
                        change.isDataChanged = true;
                        if(operationTypes && (operationTypes.reload || operationTypes.paging || operationTypes.groupExpanding)) {
                            change.needUpdateDimensions = true;
                        }
                    }

                    if(that._updateLockCount) {
                        that._changes.push(change);
                        return;
                    }

                    that._updateItemsCore(change);

                    if(change.cancel) return;

                    that._fireChanged(change);
                },
                loadingOperationTypes: function() {
                    const dataSource = this.dataSource();

                    return dataSource && dataSource.loadingOperationTypes() || {};
                },
                _fireChanged: function(change) {
                    const that = this;
                    deferRender(function() {
                        that.changed.fire(change);
                    });
                },
                isLoading: function() {
                    return this._isLoading || this._isCustomLoading;
                },
                _fireLoadingChanged: function() {
                    this.loadingChanged.fire(this.isLoading(), this._loadingText);
                },
                _calculateAdditionalFilter: function() {
                    return null;
                },
                _applyFilter: function() {
                    const that = this;
                    const dataSource = that._dataSource;

                    if(dataSource) {
                        dataSource.pageIndex(0);

                        return that.reload().done(that.pageChanged.fire.bind(that.pageChanged));
                    }
                },
                filter: function(filterExpr) {
                    const dataSource = this._dataSource;
                    const filter = dataSource && dataSource.filter();

                    if(arguments.length === 0) {
                        return filter;
                    }

                    filterExpr = arguments.length > 1 ? Array.prototype.slice.call(arguments, 0) : filterExpr;

                    if(gridCoreUtils.equalFilterParameters(filter, filterExpr)) {
                        return;
                    }
                    if(dataSource) {
                        dataSource.filter(filterExpr);
                    }
                    this._applyFilter();
                },
                clearFilter: function(filterName) {
                    const that = this;
                    const columnsController = that._columnsController;
                    const clearColumnOption = function(optionName) {
                        const columnCount = columnsController.columnCount();
                        let index;

                        for(index = 0; index < columnCount; index++) {
                            columnsController.columnOption(index, optionName, undefined);
                        }
                    };

                    that.component.beginUpdate();

                    if(arguments.length > 0) {
                        switch(filterName) {
                            case 'dataSource':
                                that.filter(null);
                                break;
                            case 'search':
                                that.searchByText('');
                                break;
                            case 'header':
                                clearColumnOption('filterValues');
                                break;
                            case 'row':
                                clearColumnOption('filterValue');
                                break;
                        }
                    } else {
                        that.filter(null);
                        that.searchByText('');
                        clearColumnOption('filterValue');
                        clearColumnOption('bufferedFilterValue');
                        clearColumnOption('filterValues');
                    }

                    that.component.endUpdate();
                },
                _fireDataSourceChanged: function() {
                    const that = this;

                    const changedHandler = function() {
                        that.changed.remove(changedHandler);
                        that.dataSourceChanged.fire();
                    };

                    that.changed.add(changedHandler);
                },
                _getDataSourceAdapter: noop,
                _createDataSourceAdapterCore: function(dataSource, remoteOperations) {
                    const dataSourceAdapterProvider = this._getDataSourceAdapter();
                    const dataSourceAdapter = dataSourceAdapterProvider.create(this.component);

                    dataSourceAdapter.init(dataSource, remoteOperations);
                    return dataSourceAdapter;
                },
                isLocalStore: function(store) {
                    store = store || this.store();
                    return store instanceof ArrayStore;
                },
                isCustomStore: function(store) {
                    store = store || this.store();
                    return store instanceof CustomStore;
                },
                _createDataSourceAdapter: function(dataSource) {
                    let remoteOperations = this.option('remoteOperations');
                    const store = dataSource.store();
                    const enabledRemoteOperations = { filtering: true, sorting: true, paging: true, grouping: true, summary: true };

                    if(remoteOperations && remoteOperations.groupPaging) {
                        remoteOperations = extend({}, enabledRemoteOperations, remoteOperations);
                    }

                    if(remoteOperations === 'auto') {
                        remoteOperations = this.isLocalStore(store) || this.isCustomStore(store) ? {} : { filtering: true, sorting: true, paging: true };
                    }
                    if(remoteOperations === true) {
                        remoteOperations = enabledRemoteOperations;
                    }

                    return this._createDataSourceAdapterCore(dataSource, remoteOperations);
                },
                setDataSource: function(dataSource) {
                    const that = this;
                    const oldDataSource = that._dataSource;

                    if(!dataSource && oldDataSource) {
                        oldDataSource.changed.remove(that._dataChangedHandler);
                        oldDataSource.loadingChanged.remove(that._loadingChangedHandler);
                        oldDataSource.loadError.remove(that._loadErrorHandler);
                        oldDataSource.customizeStoreLoadOptions.remove(that._customizeStoreLoadOptionsHandler);
                        oldDataSource.changing.remove(that._changingHandler);
                        oldDataSource.cancelAll();
                        oldDataSource.dispose(that._isSharedDataSource);
                    }

                    if(dataSource) {
                        dataSource = that._createDataSourceAdapter(dataSource);
                    }

                    that._dataSource = dataSource;

                    if(dataSource) {
                        that._fireDataSourceChanged();
                        that._isLoading = !dataSource.isLoaded();
                        that._needApplyFilter = true;
                        that._isAllDataTypesDefined = that._columnsController.isAllDataTypesDefined();
                        dataSource.changed.add(that._dataChangedHandler);
                        dataSource.loadingChanged.add(that._loadingChangedHandler);
                        dataSource.loadError.add(that._loadErrorHandler);
                        dataSource.customizeStoreLoadOptions.add(that._customizeStoreLoadOptionsHandler);
                        dataSource.changing.add(that._changingHandler);
                    }
                },
                items: function() {
                    return this._items;
                },
                isEmpty: function() {
                    return !this.items().length;
                },
                pageCount: function() {
                    return this._dataSource ? this._dataSource.pageCount() : 1;
                },
                dataSource: function() {
                    return this._dataSource;
                },
                store: function() {
                    const dataSource = this._dataSource;
                    return dataSource && dataSource.store();
                },
                loadAll: function(data) {
                    const that = this;
                    const d = new Deferred();
                    const dataSource = that._dataSource;

                    if(dataSource) {
                        if(data) {
                            const options = {
                                data: data,
                                isCustomLoading: true,
                                storeLoadOptions: { isLoadingAll: true },
                                loadOptions: {
                                    filter: that.getCombinedFilter(),
                                    group: dataSource.group(),
                                    sort: dataSource.sort()
                                }
                            };
                            dataSource._handleDataLoaded(options);
                            when(options.data).done(function(data) {
                                data = that._beforeProcessItems(data);
                                d.resolve(that._processItems(data, { changeType: 'loadingAll' }), options.extra && options.extra.summary);
                            }).fail(d.reject);
                        } else {
                            if(!dataSource.isLoading()) {
                                const loadOptions = extend({}, dataSource.loadOptions(), { isLoadingAll: true, requireTotalCount: false });
                                dataSource.load(loadOptions).done(function(items, extra) {
                                    items = that._beforeProcessItems(items);
                                    items = that._processItems(items, { changeType: 'loadingAll' });
                                    d.resolve(items, extra && extra.summary);
                                }).fail(d.reject);
                            } else {
                                d.reject();
                            }
                        }
                    } else {
                        d.resolve([]);
                    }
                    return d;
                },
                getKeyByRowIndex: function(rowIndex) {
                    const item = this.items()[rowIndex];
                    if(item) {
                        return item.key;
                    }
                },
                getRowIndexByKey: function(key) {
                    return gridCoreUtils.getIndexByKey(key, this.items());
                },
                keyOf: function(data) {
                    const store = this.store();
                    if(store) {
                        return store.keyOf(data);
                    }
                },
                byKey: function(key) {
                    const store = this.store();
                    const rowIndex = this.getRowIndexByKey(key);
                    let result;

                    if(!store) return;

                    if(rowIndex >= 0) {
                        result = new Deferred().resolve(this.items()[rowIndex].data);
                    }

                    return result || store.byKey(key);
                },
                key: function() {
                    const store = this.store();

                    if(store) {
                        return store.key();
                    }
                },
                getRowIndexOffset: function() {
                    return 0;
                },
                getDataByKeys: function(rowKeys) {
                    const that = this;
                    const result = new Deferred();
                    const deferreds = [];
                    const data = [];

                    each(rowKeys, function(index, key) {
                        deferreds.push(that.byKey(key).done(function(keyData) {
                            data[index] = keyData;
                        }));
                    });

                    when.apply($, deferreds).always(function() {
                        result.resolve(data);
                    });

                    return result;
                },
                pageIndex: function(value) {
                    return changePaging(this, 'pageIndex', value);
                },
                pageSize: function(value) {
                    return changePaging(this, 'pageSize', value);
                },
                beginCustomLoading: function(messageText) {
                    this._isCustomLoading = true;
                    this._loadingText = messageText || '';
                    this._fireLoadingChanged();
                },
                endCustomLoading: function() {
                    this._isCustomLoading = false;
                    this._loadingText = undefined;
                    this._fireLoadingChanged();
                },
                refresh: function(options) {
                    if(options === true) {
                        options = { reload: true, changesOnly: true };
                    } else if(!options) {
                        options = { lookup: true, selection: true, reload: true };
                    }

                    const that = this;
                    const dataSource = that.getDataSource();
                    const changesOnly = options.changesOnly;
                    const d = new Deferred();


                    const customizeLoadResult = function() {
                        that._repaintChangesOnly = !!changesOnly;
                    };

                    when(!options.lookup || that._columnsController.refresh()).always(function() {
                        if(options.load || options.reload) {
                            dataSource && dataSource.on('customizeLoadResult', customizeLoadResult);

                            when(that.reload(options.reload, changesOnly)).always(function() {
                                dataSource && dataSource.off('customizeLoadResult', customizeLoadResult);
                                that._repaintChangesOnly = undefined;
                            }).done(d.resolve).fail(d.reject);
                        } else {
                            that.updateItems({ repaintChangesOnly: options.changesOnly });
                            d.resolve();
                        }
                    });

                    return d.promise();
                },
                getVisibleRows: function() {
                    return this.items();
                },
                _disposeDataSource: function() {
                    this.setDataSource(null);
                },
                dispose: function() {
                    this._disposeDataSource();
                    this.callBase.apply(this, arguments);
                },

                repaintRows: function(rowIndexes, changesOnly) {
                    rowIndexes = Array.isArray(rowIndexes) ? rowIndexes : [rowIndexes];

                    if(rowIndexes.length > 1 || typeUtils.isDefined(rowIndexes[0])) {
                        this.updateItems({ changeType: 'update', rowIndices: rowIndexes, isFullUpdate: !changesOnly });
                    }
                },

                skipProcessingPagingChange: function(fullName) {
                    return this._skipProcessingPagingChange && (fullName === 'paging.pageIndex' || fullName === 'paging.pageSize');
                },

                getUserState: function() {
                    return {
                        searchText: this.option('searchPanel.text'),
                        pageIndex: this.pageIndex(),
                        pageSize: this.pageSize()
                    };
                },

                getCachedStoreData: function() {
                    return this._dataSource && this._dataSource.getCachedStoreData();
                }
            };

            gridCoreUtils.proxyMethod(members, 'load');
            gridCoreUtils.proxyMethod(members, 'reload');
            gridCoreUtils.proxyMethod(members, 'push');
            gridCoreUtils.proxyMethod(members, 'itemsCount', 0);
            gridCoreUtils.proxyMethod(members, 'totalItemsCount', 0);
            gridCoreUtils.proxyMethod(members, 'hasKnownLastPage', true);
            gridCoreUtils.proxyMethod(members, 'isLoaded', true);
            gridCoreUtils.proxyMethod(members, 'totalCount', 0);

            return members;
        })())
    }
};
