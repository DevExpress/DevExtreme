import { getKeyHash, equalByValue } from "../../core/utils/common";
import { isDefined } from "../../core/utils/type";
import { extend } from "../../core/utils/extend";
import stateStoringCore from "./ui.grid_core.state_storing_core";
import { Deferred } from "../../core/utils/deferred";

const getDataState = that => {
    let pagerView = that.getView("pagerView"),
        dataController = that.getController("data"),
        state = {
            allowedPageSizes: pagerView ? pagerView.getPageSizes() : undefined,
            filterPanel: { filterEnabled: that.option("filterPanel.filterEnabled") },
            filterValue: that.option("filterValue"),
            focusedRowKey: that.option("focusedRowEnabled") ? that.option("focusedRowKey") : undefined
        };

    return extend(state, dataController.getUserState());
};

// TODO move processLoadState to target modules (data, columns, pagerView)
const processLoadState = that => {
    let columnsController = that.getController("columns"),
        selectionController = that.getController("selection"),
        exportController = that.getController("export"),
        dataController = that.getController("data");

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
        that._initialPageSize = that.option("paging.pageSize");
        that._initialFilterValue = that.option("filterValue");

        dataController.changed.add(function() {
            var state = getDataState(that);

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
    let filterSyncController = that.getController("filterSync"),
        columnsController = that.getController("columns"),
        hasFilterState = state.columns || state.filterValue !== undefined;

    if(filterSyncController) {
        if(hasFilterState) {
            return state.filterValue || filterSyncController.getFilterValueFromColumns(state.columns);
        } else {
            return that._initialFilterValue || filterSyncController.getFilterValueFromColumns(columnsController.getColumns());
        }
    }

    return DEFAULT_FILTER_VALUE;
};

module.exports = {
    defaultOptions: function() {
        return {
            /**
         * @name GridBaseOptions.stateStoring
         * @type object
         */
            stateStoring: {
                /**
                 * @name GridBaseOptions.stateStoring.enabled
                 * @type boolean
                 * @default false
                 */
                enabled: false,
                /**
                 * @name GridBaseOptions.stateStoring.storageKey
                 * @type string
                 * @default null
                 */
                storageKey: null,
                /**
                 * @name GridBaseOptions.stateStoring.type
                 * @type Enums.StateStoringType
                 * @default "localStorage"
                 */
                type: "localStorage",

                /**
                 * @name GridBaseOptions.stateStoring.customLoad
                 * @type function()
                 * @type_function_return Promise<Object>
                 */
                customLoad: null,

                /**
                 * @name GridBaseOptions.stateStoring.customSave
                 * @type function(gridState)
                 * @type_function_param1 gridState:object
                 */
                customSave: null,

                /**
                 * @name GridBaseOptions.stateStoring.savingTimeout
                 * @type number
                 * @default 2000
                 */
                savingTimeout: 2000
            }
        };
    },
    controllers: {
        stateStoring: stateStoringCore.StateStoringController
    },
    extenders: {
        views: {
            rowsView: {
                init: function() {
                    var that = this;
                    var dataController = that.getController("data");

                    that.callBase();

                    dataController.stateLoaded.add(function() {
                        if(dataController.isLoaded() && !dataController.getDataSource()) {
                            that.setLoading(false);
                            that.renderNoDataText();
                            var columnHeadersView = that.component.getView("columnHeadersView");
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
                /**
                 * @name GridBaseMethods.state
                 * @publicName state()
                 * @return object
                 */
                /**
                 * @name GridBaseMethods.state
                 * @publicName state(state)
                 * @param1 state:object
                 */
                isLoading: function() {
                    return this.callBase() || this.getController("data").isStateLoading();
                },
                state: function(state) {
                    var result = this.callBase.apply(this, arguments);

                    if(state !== undefined) {
                        this.applyState(extend({}, state));
                    }

                    return result;
                },
                updateState: function(state) {
                    if(this.isEnabled()) {
                        let oldState = this.state(),
                            newState = extend({}, oldState, state),
                            oldStateHash = getKeyHash(oldState),
                            newStateHash = getKeyHash(newState);

                        if(!equalByValue(oldStateHash, newStateHash)) {
                            extend(this._state, state);
                            this.save();
                        }
                    } else {
                        extend(this._state, state);
                    }
                },
                applyState: function(state) {
                    var that = this,
                        allowedPageSizes = state.allowedPageSizes,
                        searchText = state.searchText,
                        selectedRowKeys = state.selectedRowKeys,
                        selectionFilter = state.selectionFilter,
                        exportController = that.getController("export"),
                        columnsController = that.getController("columns"),
                        dataController = that.getController("data"),
                        scrollingMode = that.option("scrolling.mode"),
                        isVirtualScrollingMode = scrollingMode === "virtual" || scrollingMode === "infinite",
                        showPageSizeSelector = that.option("pager.visible") === true && that.option("pager.showPageSizeSelector");

                    that.component.beginUpdate();

                    if(columnsController) {
                        columnsController.setUserState(state.columns);
                    }

                    if(exportController) {
                        exportController.selectionOnly(state.exportSelectionOnly);
                    }

                    if(selectedRowKeys) {
                        that.option("selectedRowKeys", selectedRowKeys);
                    }

                    that.option("selectionFilter", selectionFilter);

                    if(allowedPageSizes && that.option("pager.allowedPageSizes") === "auto") {
                        that.option("pager").allowedPageSizes = allowedPageSizes;
                    }

                    if(that.option("focusedRowEnabled")) {
                        that.option("focusedRowKey", state.focusedRowKey);
                    }

                    that.component.endUpdate();

                    that.option("searchPanel.text", searchText || "");

                    that.option("filterValue", getFilterValue(that, state));

                    that.option("filterPanel.filterEnabled", state.filterPanel ? state.filterPanel.filterEnabled : true);

                    that.option("paging.pageSize", (!isVirtualScrollingMode || showPageSizeSelector) && isDefined(state.pageSize) ? state.pageSize : that._initialPageSize);
                    that.option("paging.pageIndex", state.pageIndex || 0);

                    dataController && dataController.reset();
                }
            },
            columns: {
                getVisibleColumns: function() {
                    var visibleColumns = this.callBase.apply(this, arguments),
                        stateStoringController = this.getController("stateStoring");

                    return stateStoringController.isEnabled() && !stateStoringController.isLoaded() ? [] : visibleColumns;
                }
            },
            data: {
                callbackNames: function() {
                    return this.callBase().concat(["stateLoaded"]);
                },
                _refreshDataSource: function() {
                    var that = this,
                        callBase = that.callBase,
                        stateStoringController = that.getController("stateStoring");

                    if(stateStoringController.isEnabled() && !stateStoringController.isLoaded()) {
                        clearTimeout(that._restoreStateTimeoutID);

                        var deferred = new Deferred();
                        that._restoreStateTimeoutID = setTimeout(function() {
                            stateStoringController.load().always(function() {
                                that._restoreStateTimeoutID = null;
                                callBase.call(that);
                                that.stateLoaded.fire();
                                deferred.resolve();
                            });
                        });
                        return deferred.promise();
                    } else if(!that.isStateLoading()) {
                        callBase.call(that);
                    }
                },

                isLoading: function() {
                    var that = this,
                        stateStoringController = that.getController("stateStoring");

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
            }
        }
    }
};
