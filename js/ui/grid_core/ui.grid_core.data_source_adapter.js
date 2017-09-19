"use strict";

var Callbacks = require("../../core/utils/callbacks"),
    gridCore = require("../data_grid/ui.data_grid.core"),
    commonUtils = require("../../core/utils/common"),
    typeUtils = require("../../core/utils/type"),
    each = require("../../core/utils/iterator").each,
    extend = require("../../core/utils/extend").extend,
    ArrayStore = require("../../data/array_store"),
    deferredUtils = require("../../core/utils/deferred"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred;

module.exports = gridCore.Controller.inherit((function() {
    function cloneItems(items, groupCount) {
        if(items) {
            items = items.slice(0);
            if(groupCount) {
                for(var i = 0; i < items.length; i++) {
                    items[i] = extend({ key: items[i].key }, items[i]);
                    items[i].items = cloneItems(items[i].items, groupCount - 1);
                }
            }
        }
        return items;
    }

    function calculateOperationTypes(loadOptions, lastLoadOptions) {
        var operationTypes = {};

        if(lastLoadOptions) {
            operationTypes = {
                sorting: !gridCore.equalSortParameters(loadOptions.sort, lastLoadOptions.sort),
                grouping: !gridCore.equalSortParameters(loadOptions.group, lastLoadOptions.group, true),
                filtering: !gridCore.equalFilterParameters(loadOptions.filter, lastLoadOptions.filter),
                skip: loadOptions.skip !== lastLoadOptions.skip,
                take: loadOptions.take !== lastLoadOptions.take
            };
            operationTypes.reload = operationTypes.sorting || operationTypes.grouping || operationTypes.filtering;
            operationTypes.paging = operationTypes.skip || operationTypes.take;
        }

        return operationTypes;
    }

    function executeTask(action, timeout) {
        if(typeUtils.isDefined(timeout)) {
            commonUtils.executeAsync(action, timeout);
        } else {
            action();
        }
    }

    return {
        init: function(dataSource, remoteOperations) {
            var that = this;

            that._dataSource = dataSource;
            that._remoteOperations = remoteOperations || {};

            that._isLastPage = !dataSource.isLastPage();
            that._hasLastPage = false;
            that._currentTotalCount = 0;


            that.changed = Callbacks();
            that.loadingChanged = Callbacks();
            that.loadError = Callbacks();
            that.customizeStoreLoadOptions = Callbacks();

            that._dataChangedHandler = that._handleDataChanged.bind(that);
            that._dataLoadingHandler = that._handleDataLoading.bind(that);
            that._dataLoadedHandler = that._handleDataLoaded.bind(that);
            that._loadingChangedHandler = that._handleLoadingChanged.bind(that);
            that._loadErrorHandler = that._handleLoadError.bind(that);

            dataSource.on("changed", that._dataChangedHandler);
            dataSource.on("customizeStoreLoadOptions", that._dataLoadingHandler);
            dataSource.on("customizeLoadResult", that._dataLoadedHandler);
            dataSource.on("loadingChanged", that._loadingChangedHandler);
            dataSource.on("loadError", that._loadErrorHandler);

            each(dataSource, function(memberName, member) {
                if(!that[memberName] && typeUtils.isFunction(member)) {
                    that[memberName] = function() {
                        return this._dataSource[memberName].apply(this._dataSource, arguments);
                    };
                }
            });
        },
        remoteOperations: function() {
            return this._remoteOperations;
        },
        dispose: function(isSharedDataSource) {
            var that = this,
                dataSource = that._dataSource;

            dataSource.off("changed", that._dataChangedHandler);
            dataSource.off("customizeStoreLoadOptions", that._dataLoadingHandler);
            dataSource.off("customizeLoadResult", that._dataLoadedHandler);
            dataSource.off("loadingChanged", that._loadingChangedHandler);
            dataSource.off("loadError", that._loadErrorHandler);
            if(!isSharedDataSource) {
                dataSource.dispose();
            }
        },
        refresh: function(options, isReload, operationTypes) {
            var that = this,
                dataSource = that._dataSource;

            if(isReload || operationTypes.reload) {
                that._currentTotalCount = 0;
                that._isLastPage = !dataSource.paginate();
                that._hasLastPage = that._isLastPage;
            }
        },
        _customizeRemoteOperations: function(options, isReload, operationTypes) {
            var that = this,
                cachedStoreData = that._cachedStoreData,
                cachedPagingData = that._cachedPagingData;

            if(isReload) {
                cachedStoreData = undefined;
                cachedPagingData = undefined;
            } else {
                if(operationTypes.reload) {
                    cachedPagingData = undefined;
                }

                each(operationTypes, function(operationType, value) {
                    if(value && options.remoteOperations[operationType]) {
                        cachedStoreData = undefined;
                        cachedPagingData = undefined;
                    }
                });
            }

            if(cachedPagingData) {
                options.remoteOperations.paging = false;
            }

            options.cachedStoreData = cachedStoreData;
            options.cachedPagingData = cachedPagingData;

            if(!options.isCustomLoading) {
                that._cachedStoreData = cachedStoreData;
                that._cachedPagingData = cachedPagingData;
            }
        },
        _handleDataLoading: function(options) {
            var that = this,
                dataSource = that._dataSource,
                lastLoadOptions = that._lastLoadOptions,
                loadOptions,
                operationTypes;

            that.customizeStoreLoadOptions.fire(options);

            options.delay = this.option("loadingTimeout");
            options.originalStoreLoadOptions = options.storeLoadOptions;
            options.remoteOperations = extend({}, this.remoteOperations());

            var isReload = !that.isLoaded() && !that._isRefreshing;

            loadOptions = extend({}, options.storeLoadOptions);

            operationTypes = calculateOperationTypes(loadOptions, lastLoadOptions);

            that._customizeRemoteOperations(options, isReload, operationTypes);

            if(!options.isCustomLoading) {
                that._lastLoadOptions = loadOptions;
                that._isRefreshing = true;

                when(that.refresh(options, isReload, operationTypes)).always(function() {
                    if(that._lastOperationId === options.operationId) {
                        that.load();
                    }
                    that._isRefreshing = false;
                });

                dataSource.cancel(that._lastOperationId);
                that._lastOperationId = options.operationId;

                if(that._isRefreshing) {
                    dataSource.cancel(that._lastOperationId);
                }
            }

            this._handleDataLoadingCore(options);
        },
        _handleDataLoadingCore: function(options) {
            var remoteOperations = options.remoteOperations;

            options.loadOptions = {};

            var localLoadOptionNames = {
                filter: !remoteOperations.filtering,
                sort: !remoteOperations.sorting,
                group: !remoteOperations.grouping,
                summary: !remoteOperations.summary,
                skip: !remoteOperations.paging,
                take: !remoteOperations.paging,
                requireTotalCount: !remoteOperations.paging
            };

            each(options.storeLoadOptions, function(optionName, optionValue) {
                if(localLoadOptionNames[optionName]) {
                    options.loadOptions[optionName] = optionValue;
                    delete options.storeLoadOptions[optionName];
                }
            });

            options.data = options.cachedStoreData;
        },
        _handleDataLoaded: function(options) {
            var loadOptions = options.loadOptions,
                localPaging = options.remoteOperations && !options.remoteOperations.paging,
                isCaching = this.option("cacheEnabled") !== false && localPaging && options.storeLoadOptions,
                needStoreCache = isCaching && !options.isCustomLoading;

            if(!loadOptions) {
                this._dataSource.cancel(options.operationId);
                return;
            }

            if(localPaging) {
                options.skip = loadOptions.skip;
                options.take = loadOptions.take;

                delete loadOptions.skip;
                delete loadOptions.take;
            }

            if(loadOptions.group) {
                loadOptions.group = options.group || loadOptions.group;
            }

            var groupCount = gridCore.normalizeSortingInfo(options.storeLoadOptions.group || loadOptions.group).length;

            if(isCaching && options.cachedPagingData) {
                options.data = cloneItems(options.cachedPagingData, groupCount);
            } else {
                if(needStoreCache) {
                    if(!this._cachedStoreData) {
                        this._cachedStoreData = cloneItems(options.data, gridCore.normalizeSortingInfo(options.storeLoadOptions.group).length);
                    } else if(options.mergeStoreLoadData) {
                        options.data = this._cachedStoreData = this._cachedStoreData.concat(options.data);
                    }
                }

                new ArrayStore(options.data).load(loadOptions).done(function(data) {
                    options.data = data;
                });
                if(needStoreCache) {
                    this._cachedPagingData = cloneItems(options.data, groupCount);
                }
            }

            if(loadOptions.requireTotalCount && localPaging) {
                options.extra = typeUtils.isPlainObject(options.extra) ? options.extra : {};
                options.extra.totalCount = options.data.length;
            }
            this._handleDataLoadedCore(options);
            options.storeLoadOptions = options.originalStoreLoadOptions;
        },
        _handleDataLoadedCore: function(options) {
            if(options.remoteOperations && !options.remoteOperations.paging && Array.isArray(options.data)) {
                if(options.skip !== undefined) {
                    options.data = options.data.slice(options.skip);
                }
                if(options.take !== undefined) {
                    options.data = options.data.slice(0, options.take);
                }
            }
        },
        _handleLoadingChanged: function(isLoading) {
            this.loadingChanged.fire(isLoading);
        },
        _handleLoadError: function(error) {
            this.changed.fire({
                changeType: "loadError",
                error: error
            });
            this.loadError.fire(error);
        },
        _handleDataChanged: function(args) {
            var that = this,
                currentTotalCount,
                dataSource = that._dataSource,
                isLoading = false,
                itemsCount = that.itemsCount();

            that._isLastPage = !itemsCount || !that.pageSize() || itemsCount < that.pageSize();

            if(that._isLastPage) {
                that._hasLastPage = true;
            }

            if(dataSource.totalCount() >= 0) {
                if(dataSource.pageIndex() >= that.pageCount()) {
                    dataSource.pageIndex(that.pageCount() - 1);
                    dataSource.load();
                    isLoading = true;
                }
            } else {
                currentTotalCount = dataSource.pageIndex() * that.pageSize() + itemsCount;
                that._currentTotalCount = Math.max(that._currentTotalCount, currentTotalCount);
                if(itemsCount === 0 && dataSource.pageIndex() >= that.pageCount()) {
                    dataSource.pageIndex(that.pageCount() - 1);
                    if(that.option("scrolling.mode") !== "infinite") {
                        dataSource.load();
                        isLoading = true;
                    }
                }
            }

            if(!isLoading) {
                this.component._optionCache = {};
                this.changed.fire(args);
                this.component._optionCache = undefined;
            }
        },
        isLastPage: function() {
            return this._isLastPage;
        },
        totalCount: function() {
            return parseInt(this._currentTotalCount || this._dataSource.totalCount());
        },
        itemsCount: function() {
            return this._dataSource.items().length;
        },
        totalItemsCount: function() {
            return this.totalCount();
        },
        pageSize: function() {
            var dataSource = this._dataSource;

            if(!arguments.length && !dataSource.paginate()) {
                return 0;
            }
            return dataSource.pageSize.apply(dataSource, arguments);
        },
        pageCount: function() {
            var that = this,
                count = that.totalItemsCount(),
                pageSize = that.pageSize();

            if(pageSize && count > 0) {
                return Math.max(1, Math.ceil(count / pageSize));
            }
            return 1;
        },
        hasKnownLastPage: function() {
            return this._hasLastPage || this._dataSource.totalCount() >= 0;
        },
        loadFromStore: function(loadOptions) {
            var dataSource = this._dataSource,
                d = new Deferred();

            if(!dataSource) return;

            dataSource.store().load(loadOptions).done(function(data, extra) {
                if(data && !Array.isArray(data) && Array.isArray(data.data)) {
                    extra = data;
                    data = data.data;
                }
                d.resolve(data, extra);
            }).fail(d.reject);

            return d;
        },
        load: function(options) {
            var that = this,
                store,
                loadResult,
                dataSourceLoadOptions,
                dataSource = that._dataSource,
                d = new Deferred();

            if(options) {
                store = dataSource.store();
                dataSourceLoadOptions = dataSource.loadOptions();
                loadResult = {
                    storeLoadOptions: options,
                    isCustomLoading: true
                };

                each(store._customLoadOptions() || [], function(_, optionName) {
                    if(!(optionName in loadResult.storeLoadOptions)) {
                        loadResult.storeLoadOptions[optionName] = dataSourceLoadOptions[optionName];
                    }
                });

                dataSource._scheduleLoadCallbacks(d);

                that._handleDataLoading(loadResult);
                executeTask(function() {
                    if(dataSource._disposed) return;

                    when(loadResult.data || that.loadFromStore(loadResult.storeLoadOptions)).done(function(data, extra) {
                        loadResult.data = data;
                        loadResult.extra = extra || {};
                        that._handleDataLoaded(loadResult);

                        if(options.requireTotalCount && loadResult.extra.totalCount === undefined) {
                            loadResult.extra.totalCount = store.totalCount(loadResult.storeLoadOptions);
                        }
                        //TODO map function??
                        when(loadResult.data, loadResult.extra.totalCount).done(function(data, totalCount) {
                            loadResult.extra.totalCount = totalCount;
                            d.resolve(data, loadResult.extra);
                        }).fail(d.reject);
                    }).fail(d.reject);
                }, that.option("loadingTimeout"));

                return d.fail(function() {
                    that.fireEvent("loadError", arguments);
                }).promise();
            } else {
                return dataSource.load();
            }
        },
        reload: function(full) {
            return full ? this._dataSource.reload() : this._dataSource.load();
        }
    };
})());
