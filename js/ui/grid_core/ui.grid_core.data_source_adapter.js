import Callbacks from "../../core/utils/callbacks";
import gridCore from "../data_grid/ui.data_grid.core";
import { executeAsync, getKeyHash } from "../../core/utils/common";
import typeUtils from "../../core/utils/type";
import { each } from "../../core/utils/iterator";
import { extend } from "../../core/utils/extend";
import ArrayStore from "../../data/array_store";
import arrayUtils from "../../data/array_utils";
import { when, Deferred } from "../../core/utils/deferred";

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
                groupExpanding: !gridCore.equalSortParameters(loadOptions.group, lastLoadOptions.group) || lastLoadOptions.groupExpand,
                filtering: !gridCore.equalFilterParameters(loadOptions.filter, lastLoadOptions.filter),
                pageIndex: loadOptions.pageIndex !== lastLoadOptions.pageIndex,
                skip: loadOptions.skip !== lastLoadOptions.skip,
                take: loadOptions.take !== lastLoadOptions.take
            };
            operationTypes.reload = operationTypes.sorting || operationTypes.grouping || operationTypes.filtering;
            operationTypes.paging = operationTypes.pageIndex || operationTypes.take;
        }

        return operationTypes;
    }

    function executeTask(action, timeout) {
        if(typeUtils.isDefined(timeout)) {
            executeAsync(action, timeout);
        } else {
            action();
        }
    }

    function createEmptyPagesData() {
        return { pages: {} };
    }

    function getPageDataFromCache(options) {
        return options.cachedPagesData.pages[options.pageIndex];
    }

    function setPageDataToCache(options, data) {
        var pageIndex = options.pageIndex;
        if(pageIndex !== undefined) {
            options.cachedPagesData.pages[pageIndex] = data;
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
            that._cachedPagesData = createEmptyPagesData();
            that._lastOperationTypes = {};


            that.changed = Callbacks();
            that.loadingChanged = Callbacks();
            that.loadError = Callbacks();
            that.customizeStoreLoadOptions = Callbacks();
            that.changing = Callbacks();

            that._dataChangedHandler = that._handleDataChanged.bind(that);
            that._dataLoadingHandler = that._handleDataLoading.bind(that);
            that._dataLoadedHandler = that._handleDataLoaded.bind(that);
            that._loadingChangedHandler = that._handleLoadingChanged.bind(that);
            that._loadErrorHandler = that._handleLoadError.bind(that);
            that._pushHandler = that._handlePush.bind(that);
            that._changingHandler = that._handleChanging.bind(that);

            dataSource.on("changed", that._dataChangedHandler);
            dataSource.on("customizeStoreLoadOptions", that._dataLoadingHandler);
            dataSource.on("customizeLoadResult", that._dataLoadedHandler);
            dataSource.on("loadingChanged", that._loadingChangedHandler);
            dataSource.on("loadError", that._loadErrorHandler);
            dataSource.on("changing", that._changingHandler);
            dataSource.store().on("push", that._pushHandler);

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
            dataSource.off("changing", that._changingHandler);
            dataSource.store().off("push", that._pushHandler);
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
        resetCache: function() {
            this._cachedStoreData = undefined;
            this._cachedPagingData = undefined;
        },
        resetPagesCache: function() {
            this._cachedPagesData = createEmptyPagesData();
        },
        _needClearStoreDataCache: function() {
            var remoteOperations = this.remoteOperations(),
                operationTypes = calculateOperationTypes(this._lastLoadOptions || {}, {}),
                isLocalOperations = Object.keys(remoteOperations).every(operationName => !operationTypes[operationName] || !remoteOperations[operationName]);

            return !isLocalOperations;
        },
        push: function(changes, fromStore) {
            var store = this.store();

            if(this._needClearStoreDataCache()) {
                this._cachedStoreData = undefined;
            }

            this._cachedPagingData = undefined;

            this.resetPagesCache();

            if(this._cachedStoreData) {
                arrayUtils.applyBatch(store, this._cachedStoreData, changes);
            }

            if(!fromStore) {
                this._applyBatch(changes);
            }
        },
        getDataIndexGetter: function() {
            if(!this._dataIndexGetter) {
                var indexByKey;
                var store = this.store();
                this._dataIndexGetter = data => {
                    var storeData = this._cachedStoreData || [];
                    if(!indexByKey) {
                        indexByKey = {};
                        for(var i = 0; i < storeData.length; i++) {
                            indexByKey[getKeyHash(store.keyOf(storeData[i]))] = i;
                        }
                    }
                    return indexByKey[getKeyHash(store.keyOf(data))];
                };
            }

            return this._dataIndexGetter;
        },
        _getKeyInfo: function() {
            return this.store();
        },
        _applyBatch: function(changes) {
            var keyInfo = this._getKeyInfo(),
                dataSource = this._dataSource,
                groupCount = gridCore.normalizeSortingInfo(this.group()).length;

            changes = changes.filter(function(change) {
                return !dataSource.paginate() || change.type !== "insert" || change.index !== undefined;
            });

            arrayUtils.applyBatch(keyInfo, this._items, changes, groupCount, true);
            arrayUtils.applyBatch(keyInfo, dataSource.items(), changes, groupCount, true);
            changes.splice(0, changes.length);
        },
        _handlePush: function(changes) {
            this.push(changes, true);
        },
        _handleChanging: function(e) {
            this.changing.fire(e);
            this._applyBatch(e.changes);
        },
        _needCleanCacheByOperation: function(operationType, remoteOperations) {
            var operationTypesByOrder = ["filtering", "sorting", "paging"],
                operationTypeIndex = operationTypesByOrder.indexOf(operationType),
                currentOperationTypes = operationTypeIndex >= 0 ? operationTypesByOrder.slice(operationTypeIndex) : [operationType];

            return currentOperationTypes.some(operationType => remoteOperations[operationType]);
        },
        _customizeRemoteOperations: function(options, isReload, operationTypes) {
            var that = this,
                cachedStoreData = that._cachedStoreData,
                cachedPagingData = that._cachedPagingData,
                cachedPagesData = that._cachedPagesData;

            if((options.storeLoadOptions.filter && !options.remoteOperations.filtering) || (options.storeLoadOptions.sort && !options.remoteOperations.sorting)) {
                options.remoteOperations = {};
            }

            if(isReload) {
                cachedStoreData = undefined;
                cachedPagingData = undefined;
                cachedPagesData = createEmptyPagesData();
            } else {
                if(operationTypes.reload) {
                    cachedPagingData = undefined;
                    cachedPagesData = createEmptyPagesData();
                } else if(operationTypes.take || operationTypes.groupExpanding) {
                    cachedPagesData = createEmptyPagesData();
                }

                each(operationTypes, function(operationType, value) {
                    if(value && that._needCleanCacheByOperation(operationType, options.remoteOperations)) {
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
            options.cachedPagesData = cachedPagesData;

            if(!options.isCustomLoading) {
                that._cachedStoreData = cachedStoreData;
                that._cachedPagingData = cachedPagingData;
                that._cachedPagesData = cachedPagesData;
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

            if(that.option("integrationOptions.renderedOnServer") && !that.isLoaded()) {
                options.delay = undefined;
            }

            loadOptions = extend({ pageIndex: that.pageIndex() }, options.storeLoadOptions);

            operationTypes = calculateOperationTypes(loadOptions, lastLoadOptions);

            that._customizeRemoteOperations(options, isReload, operationTypes);

            if(!options.isCustomLoading) {
                var isRefreshing = that._isRefreshing;

                options.pageIndex = dataSource.pageIndex();
                options.lastLoadOptions = loadOptions;
                options.operationTypes = operationTypes;
                that._loadingOperationTypes = operationTypes;
                that._isRefreshing = true;

                when(isRefreshing || that._isRefreshed || that.refresh(options, isReload, operationTypes)).done(function() {
                    if(that._lastOperationId === options.operationId) {
                        that._isRefreshed = true;
                        that.load().always(function() {
                            that._isRefreshed = false;
                        });
                    }
                }).fail(function() {
                    dataSource.cancel(options.operationId);
                }).always(function() {
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

            var cachedExtra = options.cachedPagesData.extra;
            var localLoadOptionNames = {
                filter: !remoteOperations.filtering,
                sort: !remoteOperations.sorting,
                group: !remoteOperations.grouping,
                summary: !remoteOperations.summary,
                skip: !remoteOperations.paging,
                take: !remoteOperations.paging,
                requireTotalCount: cachedExtra && "totalCount" in cachedExtra || !remoteOperations.paging
            };

            each(options.storeLoadOptions, function(optionName, optionValue) {
                if(localLoadOptionNames[optionName]) {
                    options.loadOptions[optionName] = optionValue;
                    delete options.storeLoadOptions[optionName];
                }
            });

            if(cachedExtra) {
                options.extra = cachedExtra;
            }
            options.data = getPageDataFromCache(options) || options.cachedStoreData;
        },
        _handleDataLoaded: function(options) {
            var loadOptions = options.loadOptions,
                localPaging = options.remoteOperations && !options.remoteOperations.paging,
                cachedPagesData = options.cachedPagesData,
                storeLoadOptions = options.storeLoadOptions,
                needCache = this.option("cacheEnabled") !== false && storeLoadOptions,
                needPageCache = needCache && !options.isCustomLoading && cachedPagesData && (!localPaging || storeLoadOptions.group) && !this.option("legacyRendering"),
                needPagingCache = needCache && localPaging,
                needStoreCache = needPagingCache && !options.isCustomLoading;

            if(!loadOptions) {
                this._dataSource.cancel(options.operationId);
                return;
            }

            if(options.lastLoadOptions) {
                this._lastLoadOptions = options.lastLoadOptions;
                Object.keys(options.operationTypes).forEach(operationType => {
                    this._lastOperationTypes[operationType] = this._lastOperationTypes[operationType] || options.operationTypes[operationType];
                });
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

            var groupCount = gridCore.normalizeSortingInfo(storeLoadOptions.group || loadOptions.group).length;

            if(!needPageCache || !getPageDataFromCache(options)) {
                if(needPagingCache && options.cachedPagingData) {
                    options.data = cloneItems(options.cachedPagingData, groupCount);
                } else {
                    if(needStoreCache) {
                        if(!this._cachedStoreData) {
                            this._cachedStoreData = cloneItems(options.data, gridCore.normalizeSortingInfo(storeLoadOptions.group).length);
                        } else if(options.mergeStoreLoadData) {
                            options.data = this._cachedStoreData = this._cachedStoreData.concat(options.data);
                        }
                    }

                    new ArrayStore(options.data).load(loadOptions).done(data => {
                        options.data = data;
                        if(needStoreCache) {
                            this._cachedPagingData = cloneItems(options.data, groupCount);
                        }
                    }).fail(error => {
                        options.data = new Deferred().reject(error);
                    });
                }

                if(loadOptions.requireTotalCount && localPaging) {
                    options.extra = typeUtils.isPlainObject(options.extra) ? options.extra : {};
                    options.extra.totalCount = options.data.length;
                }

                if(options.extra && options.extra.totalCount >= 0 && storeLoadOptions.requireTotalCount === false) {
                    options.extra.totalCount = -1;
                }

                this._handleDataLoadedCore(options);

                if(needPageCache) {
                    cachedPagesData.extra = cachedPagesData.extra || extend({}, options.extra);
                    when(options.data).done(function(data) {
                        setPageDataToCache(options, cloneItems(data, groupCount));
                    });
                }
            }
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
                    that.pageIndex(dataSource.pageIndex());
                    that.resetPagesCache();
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
                that._operationTypes = that._lastOperationTypes;
                that._lastOperationTypes = {};

                that.component._optionCache = {};
                that.changed.fire(args);
                that.component._optionCache = undefined;
            }
        },
        _scheduleCustomLoadCallbacks: function(deferred) {
            var that = this;

            that._isCustomLoading = true;
            deferred.always(function() {
                that._isCustomLoading = false;
            });
        },
        loadingOperationTypes: function() {
            return this._loadingOperationTypes;
        },
        operationTypes: function() {
            return this._operationTypes;
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
        isCustomLoading: function() {
            return !!this._isCustomLoading;
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

                that._scheduleCustomLoadCallbacks(d);
                dataSource._scheduleLoadCallbacks(d);

                that._handleDataLoading(loadResult);
                executeTask(function() {
                    if(!dataSource.store()) {
                        return d.reject("canceled");
                    }

                    when(loadResult.data || that.loadFromStore(loadResult.storeLoadOptions)).done(function(data, extra) {
                        loadResult.data = data;
                        loadResult.extra = extra || {};
                        that._handleDataLoaded(loadResult);

                        if(options.requireTotalCount && loadResult.extra.totalCount === undefined) {
                            loadResult.extra.totalCount = store.totalCount(loadResult.storeLoadOptions);
                        }
                        // TODO map function??
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
        },
        getCachedStoreData: function() {
            return this._cachedStoreData;
        }
    };
})());
