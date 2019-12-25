var $ = require('../core/renderer'),
    dataUtils = require('./utils'),
    arrayUtils = require('./array_utils'),
    isFunction = require('../core/utils/type').isFunction,
    config = require('../core/config'),
    errors = require('./errors').errors,
    Store = require('./abstract_store'),
    arrayQuery = require('./array_query'),
    queryByOptions = require('./store_helper').queryByOptions,
    deferredUtils = require('../core/utils/deferred'),
    Deferred = deferredUtils.Deferred,
    when = deferredUtils.when,
    fromPromise = deferredUtils.fromPromise;

var TOTAL_COUNT = 'totalCount',
    LOAD = 'load',
    BY_KEY = 'byKey',
    INSERT = 'insert',
    UPDATE = 'update',
    REMOVE = 'remove';

function isPromise(obj) {
    return obj && isFunction(obj.then);
}

function trivialPromise(value) {
    return new Deferred().resolve(value).promise();
}

function ensureRequiredFuncOption(name, obj) {
    if(!isFunction(obj)) {
        throw errors.Error('E4011', name);
    }
}

function throwInvalidUserFuncResult(name) {
    throw errors.Error('E4012', name);
}

function createUserFuncFailureHandler(pendingDeferred) {
    function errorMessageFromXhr(promiseArguments) {
        var xhr = promiseArguments[0],
            textStatus = promiseArguments[1];

        if(!xhr || !xhr.getResponseHeader) {
            return null;
        }

        return dataUtils.errorMessageFromXhr(xhr, textStatus);
    }

    return function(arg) {
        var error;

        if(arg instanceof Error) {
            error = arg;
        } else {
            error = new Error(errorMessageFromXhr(arguments) || arg && String(arg) || 'Unknown error');
        }

        if(error.message !== dataUtils.XHR_ERROR_UNLOAD) {
            pendingDeferred.reject(error);
        }
    };
}

function invokeUserLoad(store, options) {
    var userFunc = store._loadFunc,
        userResult;

    ensureRequiredFuncOption(LOAD, userFunc);
    userResult = userFunc.apply(store, [options]);

    if(Array.isArray(userResult)) {
        userResult = trivialPromise(userResult);
    } else if(userResult === null || userResult === undefined) {
        userResult = trivialPromise([]);
    } else {
        if(!isPromise(userResult)) {
            throwInvalidUserFuncResult(LOAD);
        }
    }

    return fromPromise(userResult);
}

function invokeUserTotalCountFunc(store, options) {
    var userFunc = store._totalCountFunc,
        userResult;

    if(!isFunction(userFunc)) {
        throw errors.Error('E4021');
    }

    userResult = userFunc.apply(store, [options]);

    if(!isPromise(userResult)) {
        userResult = Number(userResult);
        if(!isFinite(userResult)) {
            throwInvalidUserFuncResult(TOTAL_COUNT);
        }
        userResult = trivialPromise(userResult);
    }

    return fromPromise(userResult);
}

function invokeUserByKeyFunc(store, key, extraOptions) {
    var userFunc = store._byKeyFunc,
        userResult;

    ensureRequiredFuncOption(BY_KEY, userFunc);
    userResult = userFunc.apply(store, [key, extraOptions]);

    if(!isPromise(userResult)) {
        userResult = trivialPromise(userResult);
    }

    return fromPromise(userResult);
}

function runRawLoad(pendingDeferred, store, userFuncOptions, continuation) {
    if(store.__rawData) {
        continuation(store.__rawData);
    } else {
        var loadPromise = store.__rawDataPromise || invokeUserLoad(store, userFuncOptions);

        if(store._cacheRawData) {
            store.__rawDataPromise = loadPromise;
        }

        loadPromise
            .always(function() {
                delete store.__rawDataPromise;
            })
            .done(function(rawData) {
                if(store._cacheRawData) {
                    store.__rawData = rawData;
                }
                continuation(rawData);
            })
            .fail(createUserFuncFailureHandler(pendingDeferred));
    }
}

function runRawLoadWithQuery(pendingDeferred, store, options, countOnly) {
    options = options || { };

    var userFuncOptions = { };
    if('userData' in options) {
        userFuncOptions.userData = options.userData;
    }

    runRawLoad(pendingDeferred, store, userFuncOptions, function(rawData) {
        var rawDataQuery = arrayQuery(rawData, { errorHandler: store._errorHandler }),
            itemsQuery,
            totalCountQuery,
            waitList = [];

        var items,
            totalCount;

        if(!countOnly) {
            itemsQuery = queryByOptions(rawDataQuery, options);
            if(itemsQuery === rawDataQuery) {
                items = rawData.slice(0);
            } else {
                waitList.push(itemsQuery.enumerate().done(function(asyncResult) {
                    items = asyncResult;
                }));
            }
        }

        if(options.requireTotalCount || countOnly) {
            totalCountQuery = queryByOptions(rawDataQuery, options, true);
            if(totalCountQuery === rawDataQuery) {
                totalCount = rawData.length;
            } else {
                waitList.push(totalCountQuery.count().done(function(asyncResult) {
                    totalCount = asyncResult;
                }));
            }
        }

        when.apply($, waitList)
            .done(function() {
                if(countOnly) {
                    pendingDeferred.resolve(totalCount);
                } else if(options.requireTotalCount) {
                    pendingDeferred.resolve(items, { totalCount: totalCount });
                } else {
                    pendingDeferred.resolve(items);
                }
            })
            .fail(function(x) {
                pendingDeferred.reject(x);
            });
    });
}

function runRawLoadWithKey(pendingDeferred, store, key) {
    runRawLoad(pendingDeferred, store, {}, function(rawData) {
        var keyExpr = store.key(),
            item;

        for(var i = 0, len = rawData.length; i < len; i++) {
            item = rawData[i];
            if(dataUtils.keysEqual(keyExpr, store.keyOf(rawData[i]), key)) {
                pendingDeferred.resolve(item);
                return;
            }
        }

        pendingDeferred.reject(errors.Error('E4009'));
    });
}

/**
 * @name LoadOptions
 * @namespace DevExpress.data
 * @type object
 */
/**
 * @name LoadOptions.filter
 * @type object
 */
/**
 * @name LoadOptions.sort
 * @type object
 */
/**
 * @name LoadOptions.select
 * @type object
 */
/**
 * @name LoadOptions.group
 * @type object
 */
/**
 * @name LoadOptions.skip
 * @type number
 */
/**
 * @name LoadOptions.skip
 * @type number
 */
/**
 * @name LoadOptions.take
 * @type number
 */
/**
 * @name LoadOptions.userData
 * @type object
 */
/**
 * @name LoadOptions.expand
 * @type object
 */
/**
 * @name LoadOptions.requireTotalCount
 * @type boolean
 */
/**
 * @name LoadOptions.searchValue
 * @type any
 */
/**
 * @name LoadOptions.searchOperation
 * @type string
 */
/**
 * @name LoadOptions.searchExpr
 * @type getter|Array<getter>
 */
/**
 * @name LoadOptions.customQueryParams
 * @type Object
 */
/**
 * @name LoadOptions.totalSummary
 * @type Object
 */
/**
 * @name LoadOptions.groupSummary
 * @type Object
 */
/**
 * @name LoadOptions.requireGroupCount
 * @type boolean
 */
/**
 * @name LoadOptions.parentIds
 * @type Array<any>
 */

/**
* @name CustomStore
* @inherits Store
* @type object
* @module data/custom_store
* @export default
*/
var CustomStore = Store.inherit({
    ctor: function(options) {
        options = options || {};

        this.callBase(options);

        /**
         * @name CustomStoreOptions.useDefaultSearch
         * @type boolean
         * @default undefined
         */
        this._useDefaultSearch = !!options.useDefaultSearch || options.loadMode === 'raw';

        /**
         * @name CustomStoreOptions.loadMode
         * @type string
         * @default 'processed'
         * @acceptValues 'processed'|'raw'
         */
        this._loadMode = options.loadMode;

        /**
         * @name CustomStoreOptions.cacheRawData
         * @type boolean
         * @default true
         */
        this._cacheRawData = options.cacheRawData !== false;

        /**
         * @name CustomStoreOptions.load
         * @type function
         * @type_function_param1 options:LoadOptions
         * @type_function_return Promise<any>|Array<any>
         */
        this._loadFunc = options[LOAD];

        /**
         * @name CustomStoreOptions.totalCount
         * @type function
         * @type_function_param1 loadOptions:object
         * @type_function_param1_field1 filter:object
         * @type_function_param1_field2 group:object
         * @type_function_return Promise<number>
         */
        this._totalCountFunc = options[TOTAL_COUNT];

        /**
         * @name CustomStoreOptions.byKey
         * @type function
         * @type_function_param1 key:object|string|number
         * @type_function_return Promise<any>
         */
        this._byKeyFunc = options[BY_KEY];

        /**
         * @name CustomStoreOptions.insert
         * @type function
         * @type_function_param1 values:object
         * @type_function_return Promise<any>
         */
        this._insertFunc = options[INSERT];

        /**
         * @name CustomStoreOptions.update
         * @type function
         * @type_function_param1 key:object|string|number
         * @type_function_param2 values:object
         * @type_function_return Promise<any>
         */
        this._updateFunc = options[UPDATE];

        /**
         * @name CustomStoreOptions.remove
         * @type function
         * @type_function_param1 key:object|string|number
         * @type_function_return Promise<void>
         */
        this._removeFunc = options[REMOVE];
    },

    createQuery: function() {
        throw errors.Error('E4010');
    },

    /**
    * @name CustomStoreMethods.clearRawDataCache
    * @publicName clearRawDataCache()
    */
    clearRawDataCache: function() {
        delete this.__rawData;
    },

    _totalCountImpl: function(options) {
        var d = new Deferred();

        if(this._loadMode === 'raw' && !this._totalCountFunc) {
            runRawLoadWithQuery(d, this, options, true);
        } else {
            invokeUserTotalCountFunc(this, options)
                .done(function(count) { d.resolve(Number(count)); })
                .fail(createUserFuncFailureHandler(d));
            d = this._addFailHandlers(d);
        }

        return d.promise();
    },

    _pushImpl: function(changes) {
        if(this.__rawData) {
            arrayUtils.applyBatch(this, this.__rawData, changes);
        }
    },

    _loadImpl: function(options) {
        var d = new Deferred();

        if(this._loadMode === 'raw') {
            runRawLoadWithQuery(d, this, options, false);
        } else {
            invokeUserLoad(this, options)
                .done(function(data, extra) { d.resolve(data, extra); })
                .fail(createUserFuncFailureHandler(d));
            d = this._addFailHandlers(d);
        }

        return d.promise();
    },

    _byKeyImpl: function(key, extraOptions) {
        var d = new Deferred();

        if(this._byKeyViaLoad()) {
            this._requireKey();
            runRawLoadWithKey(d, this, key);
        } else {
            invokeUserByKeyFunc(this, key, extraOptions)
                .done(function(obj) { d.resolve(obj); })
                .fail(createUserFuncFailureHandler(d));
        }

        return d.promise();
    },

    _byKeyViaLoad: function() {
        return this._loadMode === 'raw' && !this._byKeyFunc;
    },

    _insertImpl: function(values) {
        var that = this,
            userFunc = that._insertFunc,
            userResult,
            d = new Deferred();

        ensureRequiredFuncOption(INSERT, userFunc);
        userResult = userFunc.apply(that, [values]); // should return key or data

        if(!isPromise(userResult)) {
            userResult = trivialPromise(userResult);
        }

        fromPromise(userResult)
            .done(function(serverResponse) {
                if(config().useLegacyStoreResult) {
                    d.resolve(values, serverResponse);
                } else {
                    d.resolve(serverResponse || values, that.keyOf(serverResponse));
                }
            })
            .fail(createUserFuncFailureHandler(d));

        return d.promise();
    },

    _updateImpl: function(key, values) {
        var userFunc = this._updateFunc,
            userResult,
            d = new Deferred();

        ensureRequiredFuncOption(UPDATE, userFunc);
        userResult = userFunc.apply(this, [key, values]);

        if(!isPromise(userResult)) {
            userResult = trivialPromise(userResult);
        }

        fromPromise(userResult)
            .done(function(serverResponse) {
                if(config().useLegacyStoreResult) {
                    d.resolve(key, values);
                } else {
                    d.resolve(serverResponse || values, key);
                }
            })
            .fail(createUserFuncFailureHandler(d));

        return d.promise();
    },

    _removeImpl: function(key) {
        var userFunc = this._removeFunc,
            userResult,
            d = new Deferred();

        ensureRequiredFuncOption(REMOVE, userFunc);
        userResult = userFunc.apply(this, [key]);

        if(!isPromise(userResult)) {
            userResult = trivialPromise();
        }

        fromPromise(userResult)
            .done(function() { d.resolve(key); })
            .fail(createUserFuncFailureHandler(d));

        return d.promise();
    }
});

module.exports = CustomStore;
