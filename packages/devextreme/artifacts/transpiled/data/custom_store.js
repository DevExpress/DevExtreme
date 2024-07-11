"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../core/renderer"));
var _utils = require("./utils");
var _array_utils = require("./array_utils");
var _type = require("../core/utils/type");
var _config = _interopRequireDefault(require("../core/config"));
var _errors = require("./errors");
var _abstract_store = _interopRequireDefault(require("./abstract_store"));
var _array_query = _interopRequireDefault(require("./array_query"));
var _store_helper = _interopRequireDefault(require("./store_helper"));
var _deferred = require("../core/utils/deferred");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TOTAL_COUNT = 'totalCount';
const LOAD = 'load';
const BY_KEY = 'byKey';
const INSERT = 'insert';
const UPDATE = 'update';
const REMOVE = 'remove';
function isPromise(obj) {
  return obj && (0, _type.isFunction)(obj.then);
}
function trivialPromise(value) {
  return new _deferred.Deferred().resolve(value).promise();
}
function ensureRequiredFuncOption(name, obj) {
  if (!(0, _type.isFunction)(obj)) {
    throw _errors.errors.Error('E4011', name);
  }
}
function throwInvalidUserFuncResult(name) {
  throw _errors.errors.Error('E4012', name);
}
function createUserFuncFailureHandler(pendingDeferred) {
  function errorMessageFromXhr(promiseArguments) {
    const xhr = promiseArguments[0];
    const textStatus = promiseArguments[1];
    if (!xhr || !xhr.getResponseHeader) {
      return null;
    }
    return (0, _utils.errorMessageFromXhr)(xhr, textStatus);
  }
  return function (arg) {
    let error;
    if (arg instanceof Error) {
      error = arg;
    } else {
      error = new Error(errorMessageFromXhr(arguments) || arg && String(arg) || 'Unknown error');
    }
    if (error.message !== _utils.XHR_ERROR_UNLOAD) {
      pendingDeferred.reject(error);
    }
  };
}
function invokeUserLoad(store, options) {
  const userFunc = store._loadFunc;
  let userResult;
  ensureRequiredFuncOption(LOAD, userFunc);
  userResult = userFunc.apply(store, [options]);
  if (Array.isArray(userResult)) {
    userResult = trivialPromise(userResult);
  } else if (userResult === null || userResult === undefined) {
    userResult = trivialPromise([]);
  } else {
    if (!isPromise(userResult)) {
      throwInvalidUserFuncResult(LOAD);
    }
  }
  return (0, _deferred.fromPromise)(userResult);
}
function invokeUserTotalCountFunc(store, options) {
  const userFunc = store._totalCountFunc;
  let userResult;
  if (!(0, _type.isFunction)(userFunc)) {
    throw _errors.errors.Error('E4021');
  }
  userResult = userFunc.apply(store, [options]);
  if (!isPromise(userResult)) {
    userResult = Number(userResult);
    if (!isFinite(userResult)) {
      throwInvalidUserFuncResult(TOTAL_COUNT);
    }
    userResult = trivialPromise(userResult);
  }
  return (0, _deferred.fromPromise)(userResult);
}
function invokeUserByKeyFunc(store, key, extraOptions) {
  const userFunc = store._byKeyFunc;
  let userResult;
  ensureRequiredFuncOption(BY_KEY, userFunc);
  userResult = userFunc.apply(store, [key, extraOptions]);
  if (!isPromise(userResult)) {
    userResult = trivialPromise(userResult);
  }
  return (0, _deferred.fromPromise)(userResult);
}
function runRawLoad(pendingDeferred, store, userFuncOptions, continuation) {
  if (store.__rawData) {
    continuation(store.__rawData);
  } else {
    const loadPromise = store.__rawDataPromise || invokeUserLoad(store, userFuncOptions);
    if (store._cacheRawData) {
      store.__rawDataPromise = loadPromise;
    }
    loadPromise.always(function () {
      delete store.__rawDataPromise;
    }).done(function (rawData) {
      if (store._cacheRawData) {
        store.__rawData = rawData;
      }
      continuation(rawData);
    }).fail(error => {
      var _store$_errorHandler;
      const userFuncFailureHandler = createUserFuncFailureHandler(pendingDeferred);
      (_store$_errorHandler = store._errorHandler) === null || _store$_errorHandler === void 0 || _store$_errorHandler.call(store, error);
      userFuncFailureHandler(error);
    });
  }
}
function runRawLoadWithQuery(pendingDeferred, store, options, countOnly) {
  options = options || {};
  const userFuncOptions = {};
  if ('userData' in options) {
    userFuncOptions.userData = options.userData;
  }
  runRawLoad(pendingDeferred, store, userFuncOptions, function (rawData) {
    const rawDataQuery = (0, _array_query.default)(rawData, {
      errorHandler: store._errorHandler
    });
    let itemsQuery;
    let totalCountQuery;
    const waitList = [];
    let items;
    let totalCount;
    if (!countOnly) {
      itemsQuery = _store_helper.default.queryByOptions(rawDataQuery, options);
      if (itemsQuery === rawDataQuery) {
        items = rawData.slice(0);
      } else {
        waitList.push(itemsQuery.enumerate().done(function (asyncResult) {
          items = asyncResult;
        }));
      }
    }
    if (options.requireTotalCount || countOnly) {
      totalCountQuery = _store_helper.default.queryByOptions(rawDataQuery, options, true);
      if (totalCountQuery === rawDataQuery) {
        totalCount = rawData.length;
      } else {
        waitList.push(totalCountQuery.count().done(function (asyncResult) {
          totalCount = asyncResult;
        }));
      }
    }
    _deferred.when.apply(_renderer.default, waitList).done(function () {
      if (countOnly) {
        pendingDeferred.resolve(totalCount);
      } else if (options.requireTotalCount) {
        pendingDeferred.resolve(items, {
          totalCount: totalCount
        });
      } else {
        pendingDeferred.resolve(items);
      }
    }).fail(function (x) {
      pendingDeferred.reject(x);
    });
  });
}
function runRawLoadWithKey(pendingDeferred, store, key) {
  runRawLoad(pendingDeferred, store, {}, function (rawData) {
    const keyExpr = store.key();
    let item;
    for (let i = 0, len = rawData.length; i < len; i++) {
      item = rawData[i];
      if ((0, _utils.keysEqual)(keyExpr, store.keyOf(rawData[i]), key)) {
        pendingDeferred.resolve(item);
        return;
      }
    }
    pendingDeferred.reject(_errors.errors.Error('E4009'));
  });
}
const CustomStore = _abstract_store.default.inherit({
  ctor: function (options) {
    options = options || {};
    this.callBase(options);
    this._useDefaultSearch = !!options.useDefaultSearch || options.loadMode === 'raw';
    this._loadMode = options.loadMode;
    this._cacheRawData = options.cacheRawData !== false;
    this._loadFunc = options[LOAD];
    this._totalCountFunc = options[TOTAL_COUNT];
    this._byKeyFunc = options[BY_KEY];
    this._insertFunc = options[INSERT];
    this._updateFunc = options[UPDATE];
    this._removeFunc = options[REMOVE];
  },
  _clearCache() {
    delete this.__rawData;
  },
  createQuery: function () {
    throw _errors.errors.Error('E4010');
  },
  clearRawDataCache: function () {
    this._clearCache();
  },
  _totalCountImpl: function (options) {
    let d = new _deferred.Deferred();
    if (this._loadMode === 'raw' && !this._totalCountFunc) {
      runRawLoadWithQuery(d, this, options, true);
    } else {
      invokeUserTotalCountFunc(this, options).done(function (count) {
        d.resolve(Number(count));
      }).fail(createUserFuncFailureHandler(d));
      d = this._addFailHandlers(d);
    }
    return d.promise();
  },
  _pushImpl: function (changes) {
    if (this.__rawData) {
      (0, _array_utils.applyBatch)({
        keyInfo: this,
        data: this.__rawData,
        changes
      });
    }
  },
  _loadImpl: function (options) {
    let d = new _deferred.Deferred();
    if (this._loadMode === 'raw') {
      runRawLoadWithQuery(d, this, options, false);
    } else {
      invokeUserLoad(this, options).done(function (data, extra) {
        d.resolve(data, extra);
      }).fail(createUserFuncFailureHandler(d));
      d = this._addFailHandlers(d);
    }
    return d.promise();
  },
  _byKeyImpl: function (key, extraOptions) {
    const d = new _deferred.Deferred();
    if (this._byKeyViaLoad()) {
      this._requireKey();
      runRawLoadWithKey(d, this, key);
    } else {
      invokeUserByKeyFunc(this, key, extraOptions).done(function (obj) {
        d.resolve(obj);
      }).fail(createUserFuncFailureHandler(d));
    }
    return d.promise();
  },
  _byKeyViaLoad: function () {
    return this._loadMode === 'raw' && !this._byKeyFunc;
  },
  _insertImpl: function (values) {
    const that = this;
    const userFunc = that._insertFunc;
    let userResult;
    const d = new _deferred.Deferred();
    ensureRequiredFuncOption(INSERT, userFunc);
    userResult = userFunc.apply(that, [values]); // should return key or data

    if (!isPromise(userResult)) {
      userResult = trivialPromise(userResult);
    }
    (0, _deferred.fromPromise)(userResult).done(function (serverResponse) {
      if ((0, _config.default)().useLegacyStoreResult) {
        d.resolve(values, serverResponse);
      } else {
        d.resolve(serverResponse || values, that.keyOf(serverResponse));
      }
    }).fail(createUserFuncFailureHandler(d));
    return d.promise();
  },
  _updateImpl: function (key, values) {
    const userFunc = this._updateFunc;
    let userResult;
    const d = new _deferred.Deferred();
    ensureRequiredFuncOption(UPDATE, userFunc);
    userResult = userFunc.apply(this, [key, values]);
    if (!isPromise(userResult)) {
      userResult = trivialPromise(userResult);
    }
    (0, _deferred.fromPromise)(userResult).done(function (serverResponse) {
      if ((0, _config.default)().useLegacyStoreResult) {
        d.resolve(key, values);
      } else {
        d.resolve(serverResponse || values, key);
      }
    }).fail(createUserFuncFailureHandler(d));
    return d.promise();
  },
  _removeImpl: function (key) {
    const userFunc = this._removeFunc;
    let userResult;
    const d = new _deferred.Deferred();
    ensureRequiredFuncOption(REMOVE, userFunc);
    userResult = userFunc.apply(this, [key]);
    if (!isPromise(userResult)) {
      userResult = trivialPromise();
    }
    (0, _deferred.fromPromise)(userResult).done(function () {
      d.resolve(key);
    }).fail(createUserFuncFailureHandler(d));
    return d.promise();
  }
});
var _default = exports.default = CustomStore;
module.exports = exports.default;
module.exports.default = exports.default;