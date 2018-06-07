"use strict";

var commonUtils = require("../../core/utils/common"),
    isDefined = require("../../core/utils/type").isDefined,
    extend = require("../../core/utils/extend").extend,
    stateStoringCore = require("./ui.grid_core.state_storing_core"),
    equalByValue = commonUtils.equalByValue;


// TODO move processLoadState to target modules (data, columns, pagerView)
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
                extend(that._state, {
                    columns: columnsState
                });
                that.isEnabled() && that.save();
            }
        });
    }

    if(selectionController) {
        selectionController.selectionChanged.add(function(e) {
            extend(that._state, {
                selectedRowKeys: e.selectedRowKeys,
                selectionFilter: e.selectionFilter
            });
            that.isEnabled() && that.save();
        });
    }

    if(dataController) {
        that._initialPageSize = that.option("paging.pageSize");
        dataController.changed.add(function() {
            var userState = dataController.getUserState();

            extend(that._state, userState, {
                allowedPageSizes: pagerView ? pagerView.getPageSizes() : undefined,
                filterPanel: { filterEnabled: that.option("filterPanel.filterEnabled") },
                filterValue: that.option("filterValue")
            });
            that.isEnabled() && that.save();
        });
    }

    if(exportController) {
        exportController.selectionOnlyChanged.add(function() {
            extend(that._state, {
                exportSelectionOnly: exportController.selectionOnly()
            });
            that.isEnabled() && that.save();
        });
    }
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
                applyState: function(state) {
                    var that = this,
                        allowedPageSizes = state.allowedPageSizes,
                        searchText = state.searchText,
                        selectedRowKeys = state.selectedRowKeys,
                        selectionFilter = state.selectionFilter,
                        exportController = that.getController("export"),
                        columnsController = that.getController("columns"),
                        filterSyncController = that.getController("filterSync"),
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

                    that.option("filterValue", state.filterValue || (filterSyncController ? filterSyncController.getFilterValueFromColumns(state.columns) : null));

                    that.option("filterPanel.filterEnabled", state.filterPanel ? state.filterPanel.filterEnabled : true);

                    that.option("paging.pageSize", scrollingMode !== "virtual" && scrollingMode !== "infinite" && isDefined(state.pageSize) ? state.pageSize : that._initialPageSize);
                    that.option("paging.pageIndex", state.pageIndex || 0);
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

                        that._restoreStateTimeoutID = setTimeout(function() {
                            stateStoringController.load().always(function() {
                                that._restoreStateTimeoutID = null;
                                callBase.call(that);
                                that.stateLoaded.fire();
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
