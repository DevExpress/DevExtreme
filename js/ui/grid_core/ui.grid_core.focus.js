import $ from '../../core/renderer';
import core from './ui.grid_core.modules';
import { each } from '../../core/utils/iterator';
import gridCoreUtils from './ui.grid_core.utils';
import { equalByValue } from '../../core/utils/common';
import { isDefined, isBoolean } from '../../core/utils/type';
import { Deferred, when } from '../../core/utils/deferred';

const ROW_FOCUSED_CLASS = 'dx-row-focused';
const FOCUSED_ROW_SELECTOR = '.dx-row' + '.' + ROW_FOCUSED_CLASS;
const TABLE_POSTFIX_CLASS = 'table';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';

const FocusController = core.ViewController.inherit((function() {
    return {
        init: function() {
            this._dataController = this.getController('data');
            this._keyboardController = this.getController('keyboardNavigation');
            this.component._optionsByReference.focusedRowKey = true;
        },

        optionChanged: function(args) {
            if(args.name === 'focusedRowIndex') {
                const focusedRowKey = this.option('focusedRowKey');
                this._focusRowByIndex(args.value);
                this._triggerFocusedRowChangedIfNeed(focusedRowKey, args.value);
                args.handled = true;
            } else if(args.name === 'focusedRowKey') {
                const focusedRowIndex = this.option('focusedRowIndex');
                this._focusRowByKey(args.value);
                this._triggerFocusedRowChangedIfNeed(args.value, focusedRowIndex);
                args.handled = true;
            } else if(args.name === 'focusedColumnIndex') {
                args.handled = true;
            } else if(args.name === 'focusedRowEnabled') {
                args.handled = true;
            } else if(args.name === 'autoNavigateToFocusedRow') {
                args.handled = true;
            } else {
                this.callBase(args);
            }
        },

        _triggerFocusedRowChangedIfNeed: function(focusedRowKey, focusedRowIndex) {
            const focusedRowIndexByKey = this.getFocusedRowIndexByKey(focusedRowKey);

            if(focusedRowIndex === focusedRowIndexByKey) {
                const rowIndex = this._dataController.getRowIndexByKey(focusedRowKey);
                if(rowIndex >= 0) {
                    const $rowElement = $(this.getView('rowsView').getRowElement(rowIndex));
                    this.getController('keyboardNavigation')._fireFocusedRowChanged($rowElement, focusedRowIndex);
                }
            }
        },

        isAutoNavigateToFocusedRow: function() {
            return this.option('scrolling.mode') !== 'infinite' && this.option('autoNavigateToFocusedRow');
        },

        _focusRowByIndex: function(index) {
            if(!this.option('focusedRowEnabled')) {
                return;
            }

            index = index !== undefined ? index : this.option('focusedRowIndex');

            if(index < 0) {
                if(this.isAutoNavigateToFocusedRow()) {
                    this._resetFocusedRow();
                }
            } else {
                this._focusRowByIndexCore(index);
            }
        },
        _focusRowByIndexCore: function(index) {
            const dataController = this.getController('data');
            const pageSize = dataController.pageSize();
            const setKeyByIndex = () => {
                if(this._isValidFocusedRowIndex(index)) {
                    const visibleIndex = index - dataController.getRowIndexOffset();
                    const lastItemIndex = dataController._getLastItemIndex();
                    const rowIndex = Math.min(visibleIndex, lastItemIndex);
                    const focusedRowKey = dataController.getKeyByRowIndex(rowIndex);

                    if(isDefined(focusedRowKey) && !this.isRowFocused(focusedRowKey)) {
                        this.option('focusedRowKey', focusedRowKey);
                    }
                }
            };

            if(pageSize >= 0) {
                if(!this._isLocalRowIndex(index)) {
                    const pageIndex = Math.floor(index / dataController.pageSize());
                    when(dataController.pageIndex(pageIndex), dataController.waitReady()).done(() => {
                        setKeyByIndex();
                    });
                } else {
                    setKeyByIndex();
                }
            }
        },
        _isLocalRowIndex(index) {
            const dataController = this.getController('data');
            const isVirtualScrolling = this.getController('keyboardNavigation')._isVirtualScrolling();

            if(isVirtualScrolling) {
                const pageIndex = Math.floor(index / dataController.pageSize());
                const virtualItems = dataController.virtualItemsCount();
                const virtualItemsBegin = virtualItems ? virtualItems.begin : -1;
                const visibleRowsCount = dataController.getVisibleRows().length + dataController.getRowIndexOffset();
                const visiblePagesCount = Math.ceil(visibleRowsCount / dataController.pageSize());

                return virtualItemsBegin <= index && visiblePagesCount > pageIndex;
            }

            return true;
        },
        _setFocusedRowKeyByIndex: function(index) {
            const dataController = this.getController('data');
            if(this._isValidFocusedRowIndex(index)) {
                const rowIndex = Math.min(index - dataController.getRowIndexOffset(), dataController.items().length - 1);
                const focusedRowKey = dataController.getKeyByRowIndex(rowIndex);

                if(isDefined(focusedRowKey) && !this.isRowFocused(focusedRowKey)) {
                    this.option('focusedRowKey', focusedRowKey);
                }
            }
        },

        _focusRowByKey: function(key) {
            if(!isDefined(key)) {
                this._resetFocusedRow();
            } else {
                this._navigateToRow(key, true);
            }
        },

        _resetFocusedRow: function() {
            const focusedRowKey = this.option('focusedRowKey');
            const isFocusedRowKeyDefined = isDefined(focusedRowKey);

            if(!isFocusedRowKeyDefined && this.option('focusedRowIndex') < 0) {
                return;
            }

            const keyboardController = this.getController('keyboardNavigation');

            if(isFocusedRowKeyDefined) {
                this.option('focusedRowKey', undefined);
            }
            keyboardController.setFocusedRowIndex(-1);
            this.option('focusedRowIndex', -1);
            this.getController('data').updateItems({
                changeType: 'updateFocusedRow',
                focusedRowKey: undefined
            });

            keyboardController._fireFocusedRowChanged(undefined, -1);
        },

        _isValidFocusedRowIndex: function(rowIndex) {
            const dataController = this.getController('data');
            const row = dataController.getVisibleRows()[rowIndex];

            return !row || row.rowType === 'data' || row.rowType === 'group';
        },

        publicMethods: function() {
            return ['navigateToRow', 'isRowFocused'];
        },

        navigateToRow: function(key) {
            if(!this.isAutoNavigateToFocusedRow()) {
                this.option('focusedRowIndex', -1);
            }
            this._navigateToRow(key);
        },
        _navigateToRow: function(key, needFocusRow) {
            const that = this;
            const dataController = that.getController('data');
            const isAutoNavigate = that.isAutoNavigateToFocusedRow();
            const d = new Deferred();

            if(key === undefined || !dataController.dataSource()) {
                return d.reject().promise();
            }

            const rowIndexByKey = that.getFocusedRowIndexByKey(key);
            const isPaginate = dataController.getDataSource().paginate();

            if(!isAutoNavigate && needFocusRow || !isPaginate || rowIndexByKey >= 0) {
                that._navigateTo(key, d, needFocusRow);
            } else {
                dataController.getPageIndexByKey(key).done(function(pageIndex) {
                    if(pageIndex < 0) {
                        d.resolve(-1);
                        return;
                    }
                    if(pageIndex === dataController.pageIndex()) {
                        dataController.reload().done(function() {
                            if(that.isRowFocused(key)) {
                                d.resolve(that.getFocusedRowIndexByKey(key));
                            } else {
                                that._navigateTo(key, d, needFocusRow);
                            }
                        }).fail(d.reject);
                    } else {
                        dataController.pageIndex(pageIndex).done(function() {
                            that._navigateTo(key, d, needFocusRow);
                        }).fail(d.reject);
                    }
                }).fail(d.reject);
            }

            return d.promise();
        },
        _navigateTo: function(key, deferred, needFocusRow) {
            const visibleRowIndex = this.getController('data').getRowIndexByKey(key);
            const isVirtualRowRenderingMode = this.option('scrolling.rowRenderingMode') === 'virtual';
            const isAutoNavigate = this.isAutoNavigateToFocusedRow();

            if(isAutoNavigate && isVirtualRowRenderingMode && visibleRowIndex < 0) {
                this._navigateToVirtualRow(key, deferred, needFocusRow);
            } else {
                this._navigateToVisibleRow(key, deferred, needFocusRow);
            }
        },
        _navigateToVisibleRow: function(key, deferred, needFocusRow) {
            if(needFocusRow) {
                this._triggerUpdateFocusedRow(key, deferred);
            } else {
                this.getView('rowsView').scrollToRowElement(key);
            }
        },
        _navigateToVirtualRow: function(key, deferred, needFocusRow) {
            const that = this;
            const dataController = this.getController('data');
            const rowsScrollController = dataController._rowsScrollController;
            const rowIndex = gridCoreUtils.getIndexByKey(key, dataController.items(true));
            const scrollable = that.getView('rowsView').getScrollable();

            if(rowsScrollController && scrollable && rowIndex >= 0) {
                const focusedRowIndex = rowIndex + dataController.getRowIndexOffset() - dataController.getRowIndexDelta();
                const offset = rowsScrollController.getItemOffset(focusedRowIndex);

                if(needFocusRow) {
                    const triggerUpdateFocusedRow = function() {
                        that.component.off('contentReady', triggerUpdateFocusedRow);
                        that._triggerUpdateFocusedRow(key, deferred);
                    };
                    that.component.on('contentReady', triggerUpdateFocusedRow);
                }

                scrollable.scrollTo({ y: offset });
            }
        },

        _triggerUpdateFocusedRow: function(key, deferred) {
            const dataController = this.getController('data');
            const focusedRowIndex = this.getFocusedRowIndexByKey(key);

            if(this._isValidFocusedRowIndex(focusedRowIndex)) {
                if(this.option('focusedRowEnabled')) {
                    dataController.updateItems({
                        changeType: 'updateFocusedRow',
                        focusedRowKey: key
                    });
                } else {
                    this.getView('rowsView').scrollToRowElement(key);
                }

                this.getController('keyboardNavigation').setFocusedRowIndex(focusedRowIndex);

                deferred && deferred.resolve(focusedRowIndex);
            } else {
                deferred && deferred.resolve(-1);
            }
        },

        getFocusedRowIndexByKey: function(key) {
            const dataController = this.getController('data');
            const rowIndex = dataController.getRowIndexByKey(key);
            return rowIndex >= 0 ? rowIndex + dataController.getRowIndexOffset() : -1;
        },

        _focusRowByKeyOrIndex: function() {
            const focusedRowKey = this.option('focusedRowKey');
            let currentFocusedRowIndex = this.option('focusedRowIndex');
            const keyboardController = this.getController('keyboardNavigation');
            const dataController = this.getController('data');

            if(isDefined(focusedRowKey)) {
                const visibleRowIndex = dataController.getRowIndexByKey(focusedRowKey);
                if(visibleRowIndex >= 0) {
                    if(keyboardController._isVirtualScrolling()) {
                        currentFocusedRowIndex = visibleRowIndex + dataController.getRowIndexOffset();
                    }
                    keyboardController.setFocusedRowIndex(currentFocusedRowIndex);
                    this._triggerUpdateFocusedRow(focusedRowKey);
                } else {
                    this._navigateToRow(focusedRowKey, true).done(focusedRowIndex => {
                        if(currentFocusedRowIndex >= 0 && focusedRowIndex < 0) {
                            this._focusRowByIndex();
                        }
                    });
                }
            } else if(currentFocusedRowIndex >= 0) {
                this.getController('focus')._focusRowByIndex(currentFocusedRowIndex);
            }
        },

        isRowFocused: function(key) {
            const focusedRowKey = this.option('focusedRowKey');

            if(isDefined(focusedRowKey)) {
                return equalByValue(key, this.option('focusedRowKey'));
            }
        },

        updateFocusedRow: function(change) {
            const that = this;
            const focusedRowIndex = that._dataController.getRowIndexByKey(change.focusedRowKey);
            const rowsView = that.getView('rowsView');
            let $tableElement;

            each(rowsView.getTableElements(), function(index, element) {
                const isMainTable = index === 0;
                $tableElement = $(element);

                that._clearPreviousFocusedRow($tableElement, focusedRowIndex);

                that._prepareFocusedRow({
                    changedItem: change.items[focusedRowIndex],
                    $tableElement: $tableElement,
                    focusedRowIndex: focusedRowIndex,
                    isMainTable: isMainTable
                });
            });
        },
        _clearPreviousFocusedRow: function($tableElement, focusedRowIndex) {
            const isNotMasterDetailFocusedRow = (_, focusedRow) => {
                const $focusedRowTable = $(focusedRow).closest(`.${this.addWidgetPrefix(TABLE_POSTFIX_CLASS)}`);
                return $tableElement.is($focusedRowTable);
            };

            const $prevRowFocusedElement = $tableElement
                .find(FOCUSED_ROW_SELECTOR)
                .filter(isNotMasterDetailFocusedRow);

            $prevRowFocusedElement
                .removeClass(ROW_FOCUSED_CLASS)
                .removeClass(CELL_FOCUS_DISABLED_CLASS)
                .removeAttr('tabindex');
            $prevRowFocusedElement.children('td').removeAttr('tabindex');
            if(focusedRowIndex !== 0) {
                const $firstRow = $(this.getView('rowsView').getRowElement(0));
                $firstRow.removeClass(CELL_FOCUS_DISABLED_CLASS).removeAttr('tabIndex');
            }
        },

        _prepareFocusedRow: function(options) {
            let $row;
            const changedItem = options.changedItem;

            if(changedItem && (changedItem.rowType === 'data' || changedItem.rowType === 'group')) {
                const focusedRowIndex = options.focusedRowIndex;
                const $tableElement = options.$tableElement;
                const isMainTable = options.isMainTable;
                const tabIndex = this.option('tabindex') || 0;
                const rowsView = this.getView('rowsView');

                $row = $(rowsView._getRowElements($tableElement).eq(focusedRowIndex));
                $row.addClass(ROW_FOCUSED_CLASS).attr('tabindex', tabIndex);
                if(isMainTable) {
                    rowsView.scrollToElementVertically($row);
                }
            }

            return $row;
        }
    };
})());

export default {
    defaultOptions: function() {
        return {
            focusedRowEnabled: false,

            autoNavigateToFocusedRow: true,

            focusedRowKey: undefined,

            focusedRowIndex: -1,

            focusedColumnIndex: -1
        };
    },

    controllers: {
        focus: FocusController
    },

    extenders: {
        controllers: {
            keyboardNavigation: {
                init: function() {
                    const rowIndex = this.option('focusedRowIndex');
                    const columnIndex = this.option('focusedColumnIndex');

                    this.createAction('onFocusedRowChanging', { excludeValidators: ['disabled', 'readOnly'] });
                    this.createAction('onFocusedRowChanged', { excludeValidators: ['disabled', 'readOnly'] });

                    this.createAction('onFocusedCellChanging', { excludeValidators: ['disabled', 'readOnly'] });
                    this.createAction('onFocusedCellChanged', { excludeValidators: ['disabled', 'readOnly'] });

                    this.callBase();

                    this.setRowFocusType();

                    this._focusedCellPosition = {};
                    if(isDefined(rowIndex)) {
                        this._focusedCellPosition.rowIndex = this.option('focusedRowIndex');
                    }
                    if(isDefined(columnIndex)) {
                        this._focusedCellPosition.columnIndex = this.option('focusedColumnIndex');
                    }
                },

                setFocusedRowIndex: function(rowIndex) {
                    const dataController = this.getController('data');

                    this.callBase(rowIndex);

                    const visibleRowIndex = rowIndex - dataController.getRowIndexOffset();
                    const visibleRow = dataController.getVisibleRows()[visibleRowIndex];

                    if(!visibleRow || !visibleRow.isNewRow) {
                        this.option('focusedRowIndex', rowIndex);
                    }
                },

                setFocusedColumnIndex: function(columnIndex) {
                    this.callBase(columnIndex);
                    this.option('focusedColumnIndex', columnIndex);
                },

                _escapeKeyHandler: function(eventArgs, isEditing) {
                    if(isEditing || !this.option('focusedRowEnabled')) {
                        this.callBase(eventArgs, isEditing);
                        return;
                    }
                    if(this.isCellFocusType()) {
                        this.setRowFocusType();
                        this._focus(this._getCellElementFromTarget(eventArgs.originalEvent.target), true);
                    }
                },

                _updateFocusedCellPosition: function($cell, direction) {
                    const prevRowIndex = this.option('focusedRowIndex');
                    const prevColumnIndex = this.option('focusedColumnIndex');
                    const position = this.callBase($cell, direction);

                    if(position && position.columnIndex >= 0) {
                        this._fireFocusedCellChanged($cell, prevColumnIndex, prevRowIndex);
                    }
                }
            },

            editorFactory: {
                renderFocusOverlay: function($element, hideBorder) {
                    const keyboardController = this.getController('keyboardNavigation');
                    const focusedRowEnabled = this.option('focusedRowEnabled');
                    const editingController = this.getController('editing');
                    const isRowElement = keyboardController._getElementType($element) === 'row';
                    let $cell;

                    if(!focusedRowEnabled || !keyboardController.isRowFocusType() || editingController.isEditing()) {
                        this.callBase($element, hideBorder);
                    } else if(focusedRowEnabled) {
                        if(isRowElement && !$element.hasClass(ROW_FOCUSED_CLASS)) {
                            $cell = keyboardController.getFirstValidCellInRow($element);
                            keyboardController.focus($cell);
                        }
                    }
                }
            },

            columns: {
                getSortDataSourceParameters: function(_, sortByKey) {
                    let result = this.callBase.apply(this, arguments);
                    const dataController = this.getController('data');
                    const dataSource = dataController._dataSource;
                    const store = dataController.store();
                    let key = store && store.key();
                    const remoteOperations = dataSource && dataSource.remoteOperations() || {};
                    const isLocalOperations = Object.keys(remoteOperations).every(operationName => !remoteOperations[operationName]);

                    if(key && (this.option('focusedRowEnabled') && this.getController('focus').isAutoNavigateToFocusedRow() !== false || sortByKey)) {
                        key = Array.isArray(key) ? key : [key];
                        const notSortedKeys = key.filter(key => !this.columnOption(key, 'sortOrder'));

                        if(notSortedKeys.length) {
                            result = result || [];
                            if(isLocalOperations) {
                                result.push({ selector: dataSource.getDataIndexGetter(), desc: false });
                            } else {
                                notSortedKeys.forEach(notSortedKey => result.push({ selector: notSortedKey, desc: false }));
                            }
                        }
                    }

                    return result;
                }
            },

            data: {
                _applyChange: function(change) {
                    if(change && change.changeType === 'updateFocusedRow') return;

                    return this.callBase.apply(this, arguments);
                },

                _fireChanged: function(e) {
                    this.callBase(e);

                    if(this.option('focusedRowEnabled') && this._dataSource) {
                        const isPartialUpdate = e.changeType === 'update' && e.repaintChangesOnly;
                        const isPartialUpdateWithDeleting = isPartialUpdate && e.changeTypes && e.changeTypes.indexOf('remove') >= 0;

                        if(e.changeType === 'refresh' && e.items.length || isPartialUpdateWithDeleting) {
                            this._updatePageIndexes();
                            this.processUpdateFocusedRow(e);
                        } else if(e.changeType === 'append' || e.changeType === 'prepend') {
                            this._updatePageIndexes();
                        }
                    }
                },

                _updatePageIndexes: function() {
                    const prevRenderingPageIndex = this._lastRenderingPageIndex || 0;
                    const renderingPageIndex = this._rowsScrollController ? this._rowsScrollController.pageIndex() : 0;

                    this._lastRenderingPageIndex = renderingPageIndex;
                    this._isPagingByRendering = renderingPageIndex !== prevRenderingPageIndex;
                },

                isPagingByRendering: function() {
                    return this._isPagingByRendering;
                },

                processUpdateFocusedRow: function(e) {
                    const operationTypes = e.operationTypes || {};
                    const focusController = this.getController('focus');
                    const { reload, fullReload } = operationTypes;
                    const keyboardController = this.getController('keyboardNavigation');
                    const isVirtualScrolling = keyboardController._isVirtualScrolling();
                    const focusedRowKey = this.option('focusedRowKey');
                    const isAutoNavigate = focusController.isAutoNavigateToFocusedRow();

                    if(reload && !fullReload && isDefined(focusedRowKey)) {
                        focusController._navigateToRow(focusedRowKey, true).done(function(focusedRowIndex) {
                            if(focusedRowIndex < 0) {
                                focusController._focusRowByIndex();
                            }
                        });
                    } else if(operationTypes.paging && !isVirtualScrolling) {
                        if(isAutoNavigate) {
                            const rowIndexByKey = this.getRowIndexByKey(focusedRowKey);
                            const isValidRowIndexByKey = rowIndexByKey >= 0;
                            const focusedRowIndex = this.option('focusedRowIndex');
                            const needFocusRowByIndex = focusedRowIndex >= 0 && (focusedRowIndex === rowIndexByKey || !isValidRowIndexByKey);
                            if(needFocusRowByIndex) {
                                focusController._focusRowByIndex();
                            }
                        } else {
                            if(this.getRowIndexByKey(focusedRowKey) < 0) {
                                this.option('focusedRowIndex', -1);
                            }
                        }
                    } else if(operationTypes.fullReload) {
                        focusController._focusRowByKeyOrIndex();
                    }
                },

                getPageIndexByKey: function(key) {
                    const that = this;
                    const d = new Deferred();

                    that.getGlobalRowIndexByKey(key).done(function(globalIndex) {
                        d.resolve(globalIndex >= 0 ? Math.floor(globalIndex / that.pageSize()) : -1);
                    }).fail(d.reject);

                    return d.promise();
                },
                getGlobalRowIndexByKey: function(key) {
                    if(this._dataSource.group()) {
                        return this._calculateGlobalRowIndexByGroupedData(key);
                    }
                    return this._calculateGlobalRowIndexByFlatData(key);
                },
                _calculateGlobalRowIndexByFlatData: function(key, groupFilter, useGroup) {
                    const that = this;
                    const deferred = new Deferred();
                    const dataSource = that._dataSource;
                    let filter = that._generateFilterByKey(key);

                    dataSource.load({
                        filter: that._concatWithCombinedFilter(filter),
                        skip: 0,
                        take: 1
                    }).done(function(data) {
                        if(data.length > 0) {
                            filter = that._generateOperationFilterByKey(key, data[0], useGroup);
                            dataSource.load({
                                filter: that._concatWithCombinedFilter(filter, groupFilter),
                                skip: 0,
                                take: 1,
                                requireTotalCount: true
                            }).done(function(_, extra) {
                                deferred.resolve(extra.totalCount);
                            });
                        } else {
                            deferred.resolve(-1);
                        }
                    });

                    return deferred.promise();
                },
                _concatWithCombinedFilter: function(filter, groupFilter) {
                    const combinedFilter = this.getCombinedFilter();
                    return gridCoreUtils.combineFilters([filter, combinedFilter, groupFilter]);
                },
                _generateBooleanFilter: function(selector, value, sortInfo) {
                    let result;

                    if(value === false) {
                        result = [selector, '=', sortInfo.desc ? true : null];
                    } else if(value === true ? !sortInfo.desc : sortInfo.desc) {
                        result = [selector, '<>', value];
                    }

                    return result;
                },
                _generateOperationFilterByKey: function(key, rowData, useGroup) {
                    const that = this;
                    const dataSource = that._dataSource;
                    let filter = that._generateFilterByKey(key, '<');
                    let sort = that._columnsController.getSortDataSourceParameters(!dataSource.remoteOperations().filtering, true);

                    if(useGroup) {
                        const group = that._columnsController.getGroupDataSourceParameters(!dataSource.remoteOperations().filtering);
                        if(group) {
                            sort = sort ? group.concat(sort) : group;
                        }
                    }

                    if(sort) {
                        sort.slice().reverse().forEach(function(sortInfo) {
                            const selector = sortInfo.selector;
                            let getter;

                            if(typeof selector === 'function') {
                                getter = selector;
                            } else {
                                getter = that._columnsController.columnOption(selector, 'selector');
                            }

                            const value = getter ? getter(rowData) : rowData[selector];
                            filter = [[selector, '=', value], 'and', filter];

                            if(value === null || isBoolean(value)) {
                                const booleanFilter = that._generateBooleanFilter(selector, value, sortInfo);

                                if(booleanFilter) {
                                    filter = [booleanFilter, 'or', filter];
                                }
                            } else {
                                filter = [[selector, sortInfo.desc ? '>' : '<', value], 'or', filter];
                            }
                        });
                    }

                    return filter;
                },
                _generateFilterByKey: function(key, operation) {
                    const dataSourceKey = this._dataSource.key();
                    let filter = [];

                    if(!operation) {
                        operation = '=';
                    }

                    if(Array.isArray(dataSourceKey)) {
                        for(let i = 0; i < dataSourceKey.length; ++i) {
                            const keyPart = key[dataSourceKey[i]];
                            if(keyPart) {
                                if(filter.length > 0) {
                                    filter.push('and');
                                }
                                filter.push([dataSourceKey[i], operation, keyPart]);
                            }
                        }
                    } else {
                        filter = [dataSourceKey, operation, key];
                    }

                    return filter;
                },

                _getLastItemIndex: function() {
                    return this.items(true).length - 1;
                }
            }
        },

        views: {
            rowsView: {
                _createRow: function(row) {
                    const $row = this.callBase(row);

                    if(this.option('focusedRowEnabled') && row) {
                        if(this.getController('focus').isRowFocused(row.key)) {
                            $row.addClass(ROW_FOCUSED_CLASS);
                        }
                    }

                    return $row;
                },

                _checkRowKeys: function(options) {
                    this.callBase.apply(this, arguments);

                    if(this.option('focusedRowEnabled') && this.option('dataSource')) {
                        const store = this._dataController.store();
                        if(store && !store.key()) {
                            this._dataController.fireError('E1042', 'Row focusing');
                        }
                    }
                },

                _update: function(change) {
                    if(change.changeType === 'updateFocusedRow') {
                        if(this.option('focusedRowEnabled')) {
                            this.getController('focus').updateFocusedRow(change);
                        }
                    } else {
                        this.callBase(change);
                    }
                },

                updateFocusElementTabIndex: function($cellElements) {
                    if(this.option('focusedRowEnabled')) {
                        this._setFocusedRowElementTabIndex();
                    } else {
                        this.callBase($cellElements);
                    }
                },
                _setFocusedRowElementTabIndex: function() {
                    const focusedRowKey = this.option('focusedRowKey');
                    const tabIndex = this.option('tabIndex') || 0;
                    const dataController = this._dataController;
                    const columnsController = this._columnsController;
                    let rowIndex = dataController.getRowIndexByKey(focusedRowKey);
                    let columnIndex = this.option('focusedColumnIndex');
                    const $row = this._findRowElementForTabIndex();

                    if(!isDefined(this._scrollToFocusOnResize)) {
                        this._scrollToFocusOnResize = () => {
                            this.scrollToElementVertically(this._findRowElementForTabIndex());
                            this.resizeCompleted.remove(this._scrollToFocusOnResize);
                        };
                    }

                    $row.attr('tabIndex', tabIndex);

                    if(rowIndex >= 0) {
                        if(columnIndex < 0) {
                            columnIndex = 0;
                        }

                        rowIndex += dataController.getRowIndexOffset();
                        columnIndex += columnsController.getColumnIndexOffset();
                        this.getController('keyboardNavigation').setFocusedCellPosition(rowIndex, columnIndex);

                        if(this.getController('focus').isAutoNavigateToFocusedRow()) {
                            const dataSource = dataController.dataSource();
                            const operationTypes = dataSource && dataSource.operationTypes();
                            if(operationTypes && !operationTypes.paging && !dataController.isPagingByRendering()) {
                                this.resizeCompleted.remove(this._scrollToFocusOnResize);
                                this.resizeCompleted.add(this._scrollToFocusOnResize);
                            }
                        }
                    }
                },
                _findRowElementForTabIndex: function() {
                    const focusedRowKey = this.option('focusedRowKey');
                    const rowIndex = this._dataController.getRowIndexByKey(focusedRowKey);
                    return $(this.getRowElement(rowIndex >= 0 ? rowIndex : 0));
                },

                scrollToRowElement: function(key) {
                    const rowIndex = this.getController('data').getRowIndexByKey(key);
                    const $row = $(this.getRow(rowIndex));
                    this.scrollToElementVertically($row);
                },

                scrollToElementVertically: function($row) {
                    const scrollable = this.getScrollable();
                    if(scrollable) {
                        const position = scrollable.getScrollElementPosition($row, 'vertical');
                        scrollable.scrollTo({ top: position });
                    }
                }
            }
        }
    }
};
