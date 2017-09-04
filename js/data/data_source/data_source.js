"use strict";

var Class = require("../../core/class"),
    extend = require("../../core/utils/extend").extend,
    commonUtils = require("../../core/utils/common"),
    iteratorUtils = require("../../core/utils/iterator"),
    ajax = require("../../core/utils/ajax"),
    typeUtils = require("../../core/utils/type"),
    dataUtils = require("../utils"),
    Store = require("../abstract_store"),
    ArrayStore = require("../array_store"),
    CustomStore = require("../custom_store"),
    EventsMixin = require("../../core/events_mixin"),
    errors = require("../errors").errors,
    array = require("../../core/utils/array"),
    queue = require("../../core/utils/queue"),
    deferredUtils = require("../../core/utils/deferred"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred,

    __isString = typeUtils.isString,
    __isNumber = typeUtils.isNumeric,
    __isBoolean = typeUtils.isBoolean,
    __isDefined = typeUtils.isDefined;

var CANCELED_TOKEN = "canceled";

function OperationManager() {
    this._counter = -1;
    this._deferreds = {};
}

OperationManager.prototype.constructor = OperationManager;
OperationManager.prototype.add = function addOperation(deferred) {
    this._counter += 1;
    this._deferreds[this._counter] = deferred;
    return this._counter;
};
OperationManager.prototype.remove = function removeOperation(operationId) {
    return delete this._deferreds[operationId];
};
OperationManager.prototype.cancel = function cancelOperation(operationId) {
    if(operationId in this._deferreds) {
        this._deferreds[operationId].reject(CANCELED_TOKEN);
        return true;
    }

    return false;
};
OperationManager.prototype.cancelAll = function rejectAllOperation() {
    while(this._counter > -1) {
        this.cancel(this._counter);
        this._counter--;
    }
};

function isPending(deferred) {
    return deferred.state() === "pending";
}

function normalizeDataSourceOptions(options, normalizationOptions) {
    var store;

    function createCustomStoreFromLoadFunc() {
        var storeConfig = {};

        iteratorUtils.each(["useDefaultSearch", "key", "load", "loadMode", "cacheRawData", "byKey", "lookup", "totalCount", "insert", "update", "remove"], function() {
            storeConfig[this] = options[this];
            delete options[this];
        });

        return new CustomStore(storeConfig);
    }

    function createStoreFromConfig(storeConfig) {
        var alias = storeConfig.type;

        delete storeConfig.type;

        return Store.create(alias, storeConfig);
    }

    function createCustomStoreFromUrl(url) {
        return new CustomStore({
            load: function() {
                return ajax.sendRequest({
                    url: url,
                    dataType: "json"
                });
            },
            loadMode: normalizationOptions && normalizationOptions.fromUrlLoadMode
        });
    }

    if(typeof options === "string") {
        options = {
            paginate: false,
            store: createCustomStoreFromUrl(options)
        };
    }

    if(options === undefined) {
        options = [];
    }

    if(Array.isArray(options) || options instanceof Store) {
        options = { store: options };
    } else {
        options = extend({}, options);
    }

    if(options.store === undefined) {
        options.store = [];
    }

    store = options.store;

    if("load" in options) {
        store = createCustomStoreFromLoadFunc();
    } else if(Array.isArray(store)) {
        store = new ArrayStore(store);
    } else if(typeUtils.isPlainObject(store)) {
        store = createStoreFromConfig(extend({}, store));
    }

    options.store = store;

    return options;
}



function normalizeStoreLoadOptionAccessorArguments(originalArguments) {
    switch(originalArguments.length) {
        case 0:
            return undefined;
        case 1:
            return originalArguments[0];
    }
    return [].slice.call(originalArguments);
}

function generateStoreLoadOptionAccessor(optionName) {
    return function() {
        var args = normalizeStoreLoadOptionAccessorArguments(arguments);
        if(args === undefined) {
            return this._storeLoadOptions[optionName];
        }

        this._storeLoadOptions[optionName] = args;
    };
}

function mapDataRespectingGrouping(items, mapper, groupInfo) {

    function mapRecursive(items, level) {
        if(!Array.isArray(items)) return items;
        return level ? mapGroup(items, level) : iteratorUtils.map(items, mapper);
    }

    function mapGroup(group, level) {
        return iteratorUtils.map(group, function(item) {
            var result = {
                key: item.key,
                items: mapRecursive(item.items, level - 1)
            };
            if("aggregates" in item) {
                result.aggregates = item.aggregates;
            }
            return result;
        });
    }

    return mapRecursive(items, groupInfo ? dataUtils.normalizeSortingInfo(groupInfo).length : 0);
}

var DataSource = Class.inherit({

    ctor: function(options) {
        var that = this;
        options = normalizeDataSourceOptions(options);

        /**
        * @name DataSourceOptions_store_type
        * @publicName type
        * @type string
        * @acceptValues 'array'|'local'|'odata'
        */

        /**
        * @name DataSourceOptions_store
        * @publicName store
        * @type Store|Array|Object
        */
        this._store = options.store;

        /**
        * @name DataSourceOptions_sort
        * @publicName sort
        * @type Sort expression
        */

        /**
        * @name DataSourceOptions_filter
        * @publicName filter
        * @type Filter expression
        */

        /**
        * @name DataSourceOptions_group
        * @publicName group
        * @type Group expression
        */

        /**
        * @name DataSourceOptions_select
        * @publicName select
        * @type Select expression
        */

        /**
        * @name DataSourceOptions_expand
        * @publicName expand
        * @type Array|String
        */

        /**
        * @name DataSourceOptions_customQueryParams
        * @publicName customQueryParams
        * @type Object
        */

        /**
        * @name DataSourceOptions_requireTotalCount
        * @publicName requireTotalCount
        * @type Boolean
        */
        this._storeLoadOptions = this._extractLoadOptions(options);

        /**
        * @name DataSourceOptions_map
        * @publicName map
        * @type function
        * @type_function_param1 dataItem:object
        * @type_function_return object
        */
        this._mapFunc = options.map;

        /**
        * @name DataSourceOptions_postProcess
        * @publicName postProcess
        * @type function
        * @type_function_param1 data:array
        * @type_function_return array
        */
        this._postProcessFunc = options.postProcess;

        this._pageIndex = (options.pageIndex !== undefined) ? options.pageIndex : 0;

        /**
        * @name DataSourceOptions_pageSize
        * @publicName pageSize
        * @type number
        * @default 20
        */
        this._pageSize = (options.pageSize !== undefined) ? options.pageSize : 20;

        this._loadingCount = 0;
        this._loadQueue = this._createLoadQueue();

        /**
        * @name DataSourceOptions_searchValue
        * @publicName searchValue
        * @type any
        * @default null
        */
        this._searchValue = ("searchValue" in options) ? options.searchValue : null;

        /**
        * @name DataSourceOptions_searchOperation
        * @publicName searchOperation
        * @type string
        * @default "contains"
        */
        this._searchOperation = options.searchOperation || "contains";

        /**
        * @name DataSourceOptions_searchExpr
        * @publicName searchExpr
        * @type getter|array
        */
        this._searchExpr = options.searchExpr;

        /**
        * @name DataSourceOptions_paginate
        * @publicName paginate
        * @type Boolean
        * @default undefined
        */
        this._paginate = options.paginate;

        iteratorUtils.each(
            [
                /**
                 * @name DataSourceOptions_onChanged
                 * @publicName onChanged
                 * @type function
                 * @action
                 */
                "onChanged",

                /**
                 * @name DataSourceOptions_onLoadError
                 * @publicName onLoadError
                 * @type function
                 * @type_function_param1 error:Object
                 * @type_function_param1_field1 message:string
                 * @action
                 */
                "onLoadError",

                /**
                 * @name DataSourceOptions_onLoadingChanged
                 * @publicName onLoadingChanged
                 * @type function
                 * @type_function_param1 isLoading:boolean
                 * @action
                 */
                "onLoadingChanged",

                "onCustomizeLoadResult",
                "onCustomizeStoreLoadOptions"
            ],
            function(_, optionName) {
                if(optionName in options) {
                    that.on(optionName.substr(2, 1).toLowerCase() + optionName.substr(3), options[optionName]);
                }
            });

        this._operationManager = new OperationManager();
        this._init();
    },

    _init: function() {
        this._items = [];
        this._userData = {};
        this._totalCount = -1;
        this._isLoaded = false;

        if(!__isDefined(this._paginate)) {
            this._paginate = !this.group();
        }

        this._isLastPage = !this._paginate;
    },

    /**
    * @name DataSourceMethods_dispose
    * @publicName dispose()
    */
    dispose: function() {
        this._disposeEvents();

        delete this._store;

        if(this._delayedLoadTask) {
            this._delayedLoadTask.abort();
        }

        this._operationManager.cancelAll();

        this._disposed = true;
    },

    _extractLoadOptions: function(options) {
        var result = {},
            names = ["sort", "filter", "select", "group", "requireTotalCount"],
            customNames = this._store._customLoadOptions();

        if(customNames) {
            names = names.concat(customNames);
        }

        iteratorUtils.each(names, function() {
            result[this] = options[this];
        });
        return result;
    },

    /**
    * @name DataSourceMethods_loadOptions
    * @publicName loadOptions()
    * @return object
    */
    loadOptions: function() {
        return this._storeLoadOptions;
    },

    /**
    * @name DataSourceMethods_items
    * @publicName items()
    * @return array
    */
    items: function() {
        return this._items;
    },

    /**
    * @name DataSourceMethods_pageIndex
    * @publicName pageIndex()
    * @return numeric
    */
    /**
    * @name DataSourceMethods_pageIndex
    * @publicName pageIndex(newIndex)
    * @param1 newIndex:numeric
    */
    pageIndex: function(newIndex) {
        if(!__isNumber(newIndex)) {
            return this._pageIndex;
        }

        this._pageIndex = newIndex;
        this._isLastPage = !this._paginate;
    },

    /**
    * @name DataSourceMethods_paginate
    * @publicName paginate()
    * @return Boolean
    */
    /**
    * @name DataSourceMethods_paginate
    * @publicName paginate(value)
    * @param1 value:Boolean
    */
    paginate: function(value) {
        if(!__isBoolean(value)) {
            return this._paginate;
        }

        if(this._paginate !== value) {
            this._paginate = value;
            this.pageIndex(0);
        }
    },

    /**
    * @name DataSourceMethods_pageSize
    * @publicName pageSize()
    * @return numeric
    */
    /**
    * @name DataSourceMethods_pageSize
    * @publicName pageSize(value)
    * @param1 value:numeric
    */
    pageSize: function(value) {
        if(!__isNumber(value)) {
            return this._pageSize;
        }

        this._pageSize = value;
    },

    /**
    * @name DataSourceMethods_isLastPage
    * @publicName isLastPage()
    * @return boolean
    */
    isLastPage: function() {
        return this._isLastPage;
    },

    /**
    * @name DataSourceMethods_sort
    * @publicName sort()
    * @return any
    */
    /**
    * @name DataSourceMethods_sort
    * @publicName sort(sortExpr)
    * @param1 sortExpr:any
    */
    sort: generateStoreLoadOptionAccessor("sort"),

    /**
    * @name DataSourceMethods_filter
    * @publicName filter()
    * @return object
    */
    /**
    * @name DataSourceMethods_filter
    * @publicName filter(filterExpr)
    * @param1 filterExpr:object
    */
    filter: function() {
        var newFilter = normalizeStoreLoadOptionAccessorArguments(arguments);
        if(newFilter === undefined) {
            return this._storeLoadOptions.filter;
        }

        this._storeLoadOptions.filter = newFilter;
        this.pageIndex(0);
    },

    /**
    * @name DataSourceMethods_group
    * @publicName group()
    * @return object
    */
    /**
    * @name DataSourceMethods_group
    * @publicName group(groupExpr)
    * @param1 groupExpr:object
    */
    group: generateStoreLoadOptionAccessor("group"),

    /**
    * @name DataSourceMethods_select
    * @publicName select()
    * @return any
    */
    /**
    * @name DataSourceMethods_select
    * @publicName select(expr)
    * @param1 expr:any
    */
    select: generateStoreLoadOptionAccessor("select"),

    /**
    * @name DataSourceMethods_requireTotalCount
    * @publicName requireTotalCount()
    * @return boolean
    */
    /**
    * @name DataSourceMethods_requireTotalCount
    * @publicName requireTotalCount(value)
    * @param1 value:boolean
    */
    requireTotalCount: function(value) {
        if(!__isBoolean(value)) {
            return this._storeLoadOptions.requireTotalCount;
        }

        this._storeLoadOptions.requireTotalCount = value;
    },

    /**
    * @name DataSourceMethods_searchValue
    * @publicName searchValue()
    * @return any
    */
    /**
    * @name DataSourceMethods_searchValue
    * @publicName searchValue(value)
    * @param1 value:any
    */
    searchValue: function(value) {
        if(arguments.length < 1) {
            return this._searchValue;
        }

        this._searchValue = value;
        this.pageIndex(0);
    },

    /**
    * @name DataSourceMethods_searchOperation
    * @publicName searchOperation()
    * @return string
    */
    /**
    * @name DataSourceMethods_searchOperation
    * @publicName searchOperation(op)
    * @param1 op:string
    */
    searchOperation: function(op) {
        if(!__isString(op)) {
            return this._searchOperation;
        }

        this._searchOperation = op;
        this.pageIndex(0);
    },

    /**
    * @name DataSourceMethods_searchExpr
    * @publicName searchExpr()
    * @return getter|array
    */
    /**
    * @name DataSourceMethods_searchExpr
    * @publicName searchExpr(expr)
    * @param1 expr:getter|array
    */
    searchExpr: function(expr) {
        var argc = arguments.length;

        if(argc === 0) {
            return this._searchExpr;
        }

        if(argc > 1) {
            expr = [].slice.call(arguments);
        }

        this._searchExpr = expr;
        this.pageIndex(0);
    },

    /**
    * @name DataSourceMethods_store
    * @publicName store()
    * @return object
    */
    store: function() {
        return this._store;
    },

    /**
    * @name DataSourceMethods_key
    * @publicName key()
    * @return object|string|number
    */
    key: function() {
        return this._store && this._store.key();
    },

    /**
    * @name DataSourceMethods_totalCount
    * @publicName totalCount()
    * @return numeric
    */
    totalCount: function() {
        return this._totalCount;
    },

    /**
    * @name DataSourceMethods_isLoaded
    * @publicName isLoaded()
    * @return boolean
    */
    isLoaded: function() {
        return this._isLoaded;
    },

    /**
    * @name DataSourceMethods_isLoading
    * @publicName isLoading()
    * @return boolean
    */
    isLoading: function() {
        return this._loadingCount > 0;
    },

    beginLoading: function() {
        this._changeLoadingCount(1);
    },

    endLoading: function() {
        this._changeLoadingCount(-1);
    },

    _createLoadQueue: function() {
        return queue.create();
    },

    _changeLoadingCount: function(increment) {
        var oldLoading = this.isLoading(),
            newLoading;

        this._loadingCount += increment;
        newLoading = this.isLoading();

        if(oldLoading ^ newLoading) {
            this.fireEvent("loadingChanged", [newLoading]);
        }
    },

    _scheduleLoadCallbacks: function(deferred) {
        var that = this;

        that.beginLoading();

        deferred.always(function() {
            that.endLoading();
        });
    },

    _scheduleFailCallbacks: function(deferred) {
        var that = this;

        deferred.fail(function() {
            if(arguments[0] === CANCELED_TOKEN) {
                return;
            }

            that.fireEvent("loadError", arguments);
        });
    },

    _scheduleChangedCallbacks: function(deferred) {
        var that = this;

        deferred.done(function() {
            that.fireEvent("changed");
        });
    },

    loadSingle: function(propName, propValue) {
        var that = this;

        var d = new Deferred(),
            key = this.key(),
            store = this._store,
            options = this._createStoreLoadOptions(),
            handleDone = function(data) {
                if(!__isDefined(data) || array.isEmpty(data)) {
                    d.reject(new errors.Error("E4009"));
                } else {
                    if(!Array.isArray(data)) {
                        data = [data];
                    }
                    d.resolve(that._applyMapFunction(data)[0]);
                }
            };

        this._scheduleFailCallbacks(d);

        if(arguments.length < 2) {
            propValue = propName;
            propName = key;
        }

        delete options.skip;
        delete options.group;
        delete options.refresh;
        delete options.pageIndex;
        delete options.searchString;

        function shouldForceByKey() {
            return (store instanceof CustomStore) && !store._byKeyViaLoad();
        }

        (function() {

            // NOTE for CustomStore always using byKey for backward compatibility with "old user datasource"
            if(propName === key || shouldForceByKey()) {
                return store.byKey(propValue, options);
            }

            options.take = 1;
            options.filter = options.filter
                ? [options.filter, [propName, propValue]]
                : [propName, propValue];

            return store.load(options);

        })().fail(d.reject).done(handleDone);

        return d.promise();
    },

    /**
    * @name DataSourceMethods_load
    * @publicName load()
    * @return Promise
    */
    load: function() {
        var that = this,
            d = new Deferred(),
            loadOperation;

        function loadTask() {
            if(that._disposed) {
                return undefined;
            }

            if(!isPending(d)) {
                return;
            }

            return that._loadFromStore(loadOperation, d);
        }

        this._scheduleLoadCallbacks(d);
        this._scheduleFailCallbacks(d);
        this._scheduleChangedCallbacks(d);

        loadOperation = this._createLoadOperation(d);

        this.fireEvent("customizeStoreLoadOptions", [loadOperation]);

        this._loadQueue.add(function() {
            if(typeof loadOperation.delay === "number") {
                that._delayedLoadTask = commonUtils.executeAsync(loadTask, loadOperation.delay);
            } else {
                loadTask();
            }
            return d.promise();
        });

        return d.promise({
            operationId: loadOperation.operationId
        });
    },

    _createLoadOperation: function(deferred) {
        var id = this._operationManager.add(deferred),
            options = this._createStoreLoadOptions();

        deferred.always(function() {
            this._operationManager.remove(id);
        }.bind(this));

        return {
            operationId: id,
            storeLoadOptions: options
        };
    },

    /**
     * @name DataSourceMethods_reload
     * @publicName reload()
     * @return Promise
     */
    reload: function() {
        var store = this.store();
        if(store instanceof CustomStore) {
            store.clearRawDataCache();
        }

        this._init();
        return this.load();
    },

    /**
     * @name DataSourceMethods_cancel
     * @publicName cancel(operationId)
     * @return boolean
     */
    cancel: function(operationId) {
        return this._operationManager.cancel(operationId);
    },

    _addSearchOptions: function(storeLoadOptions) {
        if(this._disposed) {
            return;
        }

        if(this.store()._useDefaultSearch) {
            this._addSearchFilter(storeLoadOptions);
        } else {
            storeLoadOptions.searchOperation = this._searchOperation;
            storeLoadOptions.searchValue = this._searchValue;
            storeLoadOptions.searchExpr = this._searchExpr;
        }
    },

    _createStoreLoadOptions: function() {
        var result = extend({}, this._storeLoadOptions);
        this._addSearchOptions(result);

        if(this._paginate) {
            if(this._pageSize) {
                result.skip = this._pageIndex * this._pageSize;
                result.take = this._pageSize;
            }
        }

        result.userData = this._userData;

        return result;
    },

    _addSearchFilter: function(storeLoadOptions) {
        var value = this._searchValue,
            op = this._searchOperation,
            selector = this._searchExpr,
            searchFilter = [];

        if(!value) {
            return;
        }

        if(!selector) {
            selector = "this";
        }

        if(!Array.isArray(selector)) {
            selector = [selector];
        }

        // TODO optimize for byKey case

        iteratorUtils.each(selector, function(i, item) {
            if(searchFilter.length) {
                searchFilter.push("or");
            }

            searchFilter.push([item, op, value]);
        });

        if(storeLoadOptions.filter) {
            storeLoadOptions.filter = [searchFilter, storeLoadOptions.filter];
        } else {
            storeLoadOptions.filter = searchFilter;
        }
    },

    _loadFromStore: function(loadOptions, pendingDeferred) {
        var that = this;

        function handleSuccess(data, extra) {
            function processResult() {
                var loadResult;

                if(data && !Array.isArray(data) && data.data) {
                    extra = data;
                    data = data.data;
                }

                if(!Array.isArray(data)) {
                    data = [data];
                }

                loadResult = extend({
                    data: data,
                    extra: extra
                }, loadOptions);

                that.fireEvent("customizeLoadResult", [loadResult]);
                when(loadResult.data).done(function(data) {
                    loadResult.data = data;
                    that._processStoreLoadResult(loadResult, pendingDeferred);
                }).fail(pendingDeferred.reject);
            }

            if(that._disposed) {
                return;
            }

            if(!isPending(pendingDeferred)) {
                return;
            }

            processResult();
        }

        if(loadOptions.data) {
            return new Deferred().resolve(loadOptions.data).done(handleSuccess);
        }

        return this.store().load(loadOptions.storeLoadOptions)
            .done(handleSuccess)
            .fail(pendingDeferred.reject);
    },

    _processStoreLoadResult: function(loadResult, pendingDeferred) {
        var that = this,
            data = loadResult.data,
            extra = loadResult.extra,
            storeLoadOptions = loadResult.storeLoadOptions;

        function resolvePendingDeferred() {
            that._isLoaded = true;
            that._totalCount = isFinite(extra.totalCount) ? extra.totalCount : -1;
            return pendingDeferred.resolve(data, extra);
        }

        function proceedLoadingTotalCount() {

            that.store().totalCount(storeLoadOptions)
                .done(function(count) {
                    extra.totalCount = count;
                    resolvePendingDeferred();
                })
                .fail(pendingDeferred.reject);
        }

        if(that._disposed) {
            return;
        }

        //todo: if operation is canceled there is no need to do data transformation

        data = that._applyPostProcessFunction(that._applyMapFunction(data));

        if(!typeUtils.isPlainObject(extra)) {
            extra = {};
        }

        that._items = data;

        if(!data.length || !that._paginate || (that._pageSize && (data.length < that._pageSize))) {
            that._isLastPage = true;
        }

        if(storeLoadOptions.requireTotalCount && !isFinite(extra.totalCount)) {
            proceedLoadingTotalCount();
        } else {
            resolvePendingDeferred();
        }
    },

    _applyMapFunction: function(data) {
        if(this._mapFunc) {
            return mapDataRespectingGrouping(data, this._mapFunc, this.group());
        }

        return data;
    },

    _applyPostProcessFunction: function(data) {
        if(this._postProcessFunc) {
            return this._postProcessFunc(data);
        }

        return data;
    }
}).include(EventsMixin);

exports.DataSource = DataSource;
exports.normalizeDataSourceOptions = normalizeDataSourceOptions;
