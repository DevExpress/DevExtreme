"use strict";

var $ = require("jquery"),
    gridCore = require("./ui.data_grid.core"),
    commonUtils = require("../../core/utils/common"),
    stateStoringCore = require("../grid_core/ui.grid_core.state_storing"),
    equalByValue = commonUtils.equalByValue;


//TODO move processLoadState to target modules (data, columns, pagerView)
var processLoadState = function(that) {
    var columnsController = that.getController("columns"),
        selectionController = that.getController("selection"),
        exportController = that.getController("export"),
        dataController = that.getController("data"),
        pagerView = that.getView("pagerView");

    if(columnsController) {
        columnsController.columnsChanged.add(function() {
            var columnsState = columnsController.getUserState(),
                columnsStateHash = commonUtils.getKeyHash(columnsState),
                currentColumnsStateHash = commonUtils.getKeyHash(that._state.columns);

            if(!equalByValue(currentColumnsStateHash, columnsStateHash)) {
                $.extend(that._state, {
                    columns: columnsState
                });

                that.isEnabled() && that.save();
            }
        });
    }

    if(selectionController) {
        selectionController.selectionChanged.add(function(e) {
            $.extend(that._state, {
                selectedRowKeys: e.selectedRowKeys,
                selectionFilter: e.selectionFilter
            });
            that.isEnabled() && that.save();
        });
    }

    if(dataController) {
        that._initialPageSize = that.option("paging.pageSize");
        dataController.changed.add(function() {
            $.extend(that._state, {
                searchText: that.option("searchPanel.text"),
                pageIndex: dataController.pageIndex(),
                pageSize: dataController.pageSize(),
                allowedPageSizes: pagerView ? pagerView.getPageSizes() : undefined
            });

            that.isEnabled() && that.save();
        });
    }

    if(exportController) {
        exportController.selectionOnlyChanged.add(function() {
            $.extend(that._state, {
                exportSelectionOnly: exportController.selectionOnly()
            });
            that.isEnabled() && that.save();
        });
    }
};

var applyState = function(that, state) {
    var allowedPageSizes = state.allowedPageSizes,
        searchText = state.searchText,
        selectedRowKeys = state.selectedRowKeys,
        selectionFilter = state.selectionFilter,
        exportController = that.getController("export"),
        columnsController = that.getController("columns"),
        scrollingMode = that.option("scrolling.mode");

    that.component.beginUpdate();

    if(columnsController) {
        columnsController.setUserState(state.columns);
    }

    if(exportController) {
        exportController.selectionOnly(state.exportSelectionOnly);
    }

    that.option("selectedRowKeys", selectedRowKeys || []);

    that.option("selectionFilter", selectionFilter);

    if(allowedPageSizes && that.option("pager.allowedPageSizes") === "auto") {
        that.option("pager").allowedPageSizes = allowedPageSizes;
    }

    that.component.endUpdate();

    that.option("searchPanel.text", searchText || "");

    that.option("paging.pageSize", scrollingMode !== "virtual" && scrollingMode !== "infinite" && state.pageSize ? state.pageSize : that._initialPageSize);
    that.option("paging.pageIndex", state.pageIndex || 0);
};

gridCore.registerModule("stateStoring", {
    defaultOptions: function() {
        return {
            /**
         * @name dxDataGridOptions_stateStoring
         * @publicName stateStoring
         * @type object
         */
            stateStoring: {
                /**
                 * @name dxDataGridOptions_stateStoring_enabled
                 * @publicName enabled
                 * @type boolean
                 * @default false
                 */
                enabled: false,
                /**
                 * @name dxDataGridOptions_stateStoring_storageKey
                 * @publicName storageKey
                 * @type string
                 * @default null
                 */
                storageKey: null,
                /**
                 * @name dxDataGridOptions_stateStoring_type
                 * @publicName type
                 * @type string
                 * @acceptValues "localStorage" | "sessionStorage" | "custom"
                 * @default "localStorage"
                 */
                type: "localStorage",

                /**
                 * @name dxDataGridOptions_stateStoring_customLoad
                 * @publicName customLoad
                 * @type function()
                 * @type_function_return deferred object
                 */
                customLoad: null,

                /**
                 * @name dxDataGridOptions_stateStoring_customSave
                 * @publicName customSave
                 * @type function(gridState)
                 * @type_function_param1 gridState:object
                 */
                customSave: null,

                /**
                 * @name dxDataGridOptions_stateStoring_savingTimeout
                 * @publicName savingTimeout
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
        controllers: {
            stateStoring: {
                init: function() {
                    this.callBase.apply(this, arguments);
                    processLoadState(this);
                },
                /**
                 * @name dxDataGridMethods_state
                 * @publicName state()
                 * @return object
                 */
                /**
                 * @name dxDataGridMethods_state
                 * @publicName state(state)
                 * @param1 state:object
                 */
                isLoading: function() {
                    return this.callBase() || this.getController("data").isStateLoading();
                },
                state: function(state) {
                    var result = this.callBase.apply(this, arguments);
                    if(state !== undefined) {
                        applyState(this, $.extend({}, state));
                    }
                    return result;
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
                _refreshDataSource: function() {
                    var that = this,
                        callBase = that.callBase,
                        stateStoringController = that.getController("stateStoring");

                    if(stateStoringController.isEnabled() && !stateStoringController.isLoaded()) {
                        clearTimeout(that._restoreStateTimeoutID);

                        that._restoreStateTimeoutID = setTimeout(function() {
                            stateStoringController.load().always(function() {
                                that._restoreStateTimeoutID = null;
                                callBase.call(that);
                            });
                        });
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
                    return commonUtils.isDefined(this._restoreStateTimeoutID);
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
});
