import { getKeyHash, equalByValue } from '../../core/utils/common';
import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { StateStoringController } from './ui.grid_core.state_storing_core';
import { Deferred } from '../../core/utils/deferred';

const getDataState = that => {
    const pagerView = that.getView('pagerView');
    const dataController = that.getController('data');
    const state = {
        allowedPageSizes: pagerView ? pagerView.getPageSizes() : undefined,
        filterPanel: { filterEnabled: that.option('filterPanel.filterEnabled') },
        filterValue: that.option('filterValue'),
        focusedRowKey: that.option('focusedRowEnabled') ? that.option('focusedRowKey') : undefined
    };

    return extend(state, dataController.getUserState());
};

// TODO move processLoadState to target modules (data, columns, pagerView)
const processLoadState = that => {
    const columnsController = that.getController('columns');
    const selectionController = that.getController('selection');
    const exportController = that.getController('export');
    const dataController = that.getController('data');

    if(columnsController) {
        columnsController.columnsChanged.add(function() {
            that.updateState({
                columns: columnsController.getUserState()
            });
        });
    }

    if(selectionController) {
        selectionController.selectionChanged.add(function(e) {
            that.updateState({
                selectedRowKeys: e.selectedRowKeys,
                selectionFilter: e.selectionFilter
            });
        });
    }

    if(dataController) {
        that._initialPageSize = that.option('paging.pageSize');
        that._initialFilterValue = that.option('filterValue');

        dataController.changed.add(function() {
            const state = getDataState(that);

            that.updateState(state);
        });
    }

    if(exportController) {
        exportController.selectionOnlyChanged.add(function() {
            that.updateState({
                exportSelectionOnly: exportController.selectionOnly()
            });
        });
    }
};

const DEFAULT_FILTER_VALUE = null;

const getFilterValue = (that, state) => {
    const filterSyncController = that.getController('filterSync');
    const columnsController = that.getController('columns');
    const hasFilterState = state.columns || state.filterValue !== undefined;

    if(filterSyncController) {
        if(hasFilterState) {
            return state.filterValue || filterSyncController.getFilterValueFromColumns(state.columns);
        } else {
            return that._initialFilterValue || filterSyncController.getFilterValueFromColumns(columnsController.getColumns());
        }
    }

    return DEFAULT_FILTER_VALUE;
};

export const stateStoringModule = {
    defaultOptions: function() {
        return {
            stateStoring: {
                enabled: false,
                storageKey: null,
                type: 'localStorage',
                customLoad: null,
                customSave: null,
                savingTimeout: 2000
            }
        };
    },
    controllers: {
        stateStoring: StateStoringController
    },
    extenders: {
        views: {
            rowsView: {
                init: function() {
                    const that = this;
                    const dataController = that.getController('data');

                    that.callBase();

                    dataController.stateLoaded.add(function() {
                        if(dataController.isLoaded() && !dataController.getDataSource()) {
                            that.setLoading(false);
                            that.renderNoDataText();
                            const columnHeadersView = that.component.getView('columnHeadersView');
                            columnHeadersView && columnHeadersView.render();
                            that.component._fireContentReadyAction();
                        }
                    });
                }
            }
        },
        controllers: {
            stateStoring: {
                init: function() {
                    this.callBase.apply(this, arguments);
                    processLoadState(this);
                },
                isLoading: function() {
                    return this.callBase() || this.getController('data').isStateLoading();
                },
                state: function(state) {
                    const result = this.callBase.apply(this, arguments);

                    if(state !== undefined) {
                        this.applyState(extend(true, {}, state));
                    }

                    return result;
                },
                updateState: function(state) {
                    if(this.isEnabled()) {
                        const oldState = this.state();
                        const newState = extend({}, oldState, state);
                        const oldStateHash = getKeyHash(oldState);
                        const newStateHash = getKeyHash(newState);

                        if(!equalByValue(oldStateHash, newStateHash)) {
                            state = extend(true, {}, state);
                            extend(this._state, state);

                            this.save();
                        }
                    } else {
                        extend(this._state, state);
                    }
                },
                applyState: function(state) {
                    const allowedPageSizes = state.allowedPageSizes;
                    const searchText = state.searchText;
                    const selectedRowKeys = state.selectedRowKeys;
                    const selectionFilter = state.selectionFilter;
                    const exportController = this.getController('export');
                    const columnsController = this.getController('columns');
                    const dataController = this.getController('data');
                    const scrollingMode = this.option('scrolling.mode');
                    const isVirtualScrollingMode = scrollingMode === 'virtual' || scrollingMode === 'infinite';
                    const showPageSizeSelector = this.option('pager.visible') === true && this.option('pager.showPageSizeSelector');
                    const hasHeight = this.getView('rowsView')?.hasHeight();

                    this.component.beginUpdate();

                    if(columnsController) {
                        columnsController.setUserState(state.columns);
                    }

                    if(exportController) {
                        exportController.selectionOnly(state.exportSelectionOnly);
                    }

                    if(!this.option('selection.deferred')) {
                        this.option('selectedRowKeys', selectedRowKeys || []);
                    }

                    this.option('selectionFilter', selectionFilter);

                    if(allowedPageSizes && this.option('pager.allowedPageSizes') === 'auto') {
                        this.option('pager').allowedPageSizes = allowedPageSizes;
                    }

                    if(this.option('focusedRowEnabled')) {
                        this.option('focusedRowIndex', -1);
                        this.option('focusedRowKey', state.focusedRowKey || null);
                    }

                    this.component.endUpdate();

                    this.option('searchPanel.text', searchText || '');

                    this.option('filterValue', getFilterValue(this, state));

                    this.option('filterPanel.filterEnabled', state.filterPanel ? state.filterPanel.filterEnabled : true);

                    this.option('paging.pageIndex', (!isVirtualScrollingMode || hasHeight) && state.pageIndex || 0);
                    this.option('paging.pageSize', (!isVirtualScrollingMode || showPageSizeSelector) && isDefined(state.pageSize) ? state.pageSize : this._initialPageSize);

                    dataController && dataController.reset();
                }
            },
            columns: {
                _shouldReturnVisibleColumns: function() {
                    const result = this.callBase.apply(this, arguments);
                    const stateStoringController = this.getController('stateStoring');

                    return result && (!stateStoringController.isEnabled() || stateStoringController.isLoaded());
                }
            },
            data: {
                callbackNames: function() {
                    return this.callBase().concat(['stateLoaded']);
                },
                _refreshDataSource: function() {
                    const callBase = this.callBase;
                    const stateStoringController = this.getController('stateStoring');

                    if(stateStoringController.isEnabled() && !stateStoringController.isLoaded()) {
                        clearTimeout(this._restoreStateTimeoutID);

                        const deferred = new Deferred();
                        this._restoreStateTimeoutID = setTimeout(() => {
                            stateStoringController.load().always(() => {
                                this._restoreStateTimeoutID = null;
                            }).done(() => {
                                callBase.call(this);
                                this.stateLoaded.fire();
                                deferred.resolve();
                            }).fail(error => {
                                this.stateLoaded.fire();
                                this._handleLoadError(error || 'Unknown error');
                                deferred.reject();
                            });
                        });
                        return deferred.promise();
                    } else if(!this.isStateLoading()) {
                        callBase.call(this);
                    }
                },

                isLoading: function() {
                    const that = this;
                    const stateStoringController = that.getController('stateStoring');

                    return this.callBase() || stateStoringController.isLoading();
                },

                isStateLoading: function() {
                    return isDefined(this._restoreStateTimeoutID);
                },

                isLoaded: function() {
                    return this.callBase() && !this.isStateLoading();
                },

                dispose: function() {
                    clearTimeout(this._restoreStateTimeoutID);
                    this.callBase();
                }
            },
            selection: {
                _fireSelectionChanged: function(options) {
                    const stateStoringController = this.getController('stateStoring');
                    const isDeferredSelection = this.option('selection.deferred');
                    if(stateStoringController.isLoading() && isDeferredSelection) {
                        return;
                    }
                    this.callBase.apply(this, arguments);
                }
            }
        }
    }
};
