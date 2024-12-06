import arrayQuery from '@js/common/data/array_query';
import { applyBatch } from '@js/common/data/array_utils';
import { errors } from '@js/common/data/errors';
import storeHelper from '@js/common/data/store_helper';
import {
  errorMessageFromXhr as errorMessageFromXhrUtility,
  keysEqual,
  XHR_ERROR_UNLOAD,
} from '@js/common/data/utils';
import config from '@js/core/config';
import $ from '@js/core/renderer';
// @ts-expect-error
import { Deferred, fromPromise, when } from '@js/core/utils/deferred';
import { isFunction } from '@js/core/utils/type';
import Store from '@js/data/abstract_store';

const TOTAL_COUNT = 'totalCount';
const LOAD = 'load';
const BY_KEY = 'byKey';
const INSERT = 'insert';
const UPDATE = 'update';
const REMOVE = 'remove';

function isPromise(obj) {
  return obj && isFunction(obj.then);
}

function trivialPromise(value) {
  // @ts-expect-error
  return new Deferred().resolve(value).promise();
}

function ensureRequiredFuncOption(name, obj) {
  if (!isFunction(obj)) {
    throw errors.Error('E4011', name);
  }
}

function throwInvalidUserFuncResult(name) {
  throw errors.Error('E4012', name);
}

function createUserFuncFailureHandler(pendingDeferred) {
  function errorMessageFromXhr(promiseArguments) {
    const xhr = promiseArguments[0];
    const textStatus = promiseArguments[1];

    if (!xhr || !xhr.getResponseHeader) {
      return null;
    }

    return errorMessageFromXhrUtility(xhr, textStatus);
  }

  return function (arg) {
    let error;

    if (arg instanceof Error) {
      error = arg;
    } else {
      error = new Error(errorMessageFromXhr(arguments) || arg && String(arg) || 'Unknown error');
    }

    if (error.message !== XHR_ERROR_UNLOAD) {
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
  } else if (!isPromise(userResult)) {
    throwInvalidUserFuncResult(LOAD);
  }

  return fromPromise(userResult);
}

function invokeUserTotalCountFunc(store, options) {
  const userFunc = store._totalCountFunc;
  let userResult;

  if (!isFunction(userFunc)) {
    throw errors.Error('E4021');
  }

  userResult = userFunc.apply(store, [options]);

  if (!isPromise(userResult)) {
    userResult = Number(userResult);
    if (!isFinite(userResult)) {
      throwInvalidUserFuncResult(TOTAL_COUNT);
    }
    userResult = trivialPromise(userResult);
  }

  return fromPromise(userResult);
}

function invokeUserByKeyFunc(store, key, extraOptions) {
  const userFunc = store._byKeyFunc;
  let userResult;

  ensureRequiredFuncOption(BY_KEY, userFunc);
  userResult = userFunc.apply(store, [key, extraOptions]);

  if (!isPromise(userResult)) {
    userResult = trivialPromise(userResult);
  }

  return fromPromise(userResult);
}

function runRawLoad(pendingDeferred, store, userFuncOptions, continuation) {
  if (store.__rawData) {
    continuation(store.__rawData);
  } else {
    const loadPromise = store.__rawDataPromise || invokeUserLoad(store, userFuncOptions);

    if (store._cacheRawData) {
      store.__rawDataPromise = loadPromise;
    }

    loadPromise
      .always(() => {
        delete store.__rawDataPromise;
      })
      .done((rawData) => {
        if (store._cacheRawData) {
          store.__rawData = rawData;
        }
        continuation(rawData);
      })
      .fail((error) => {
        const userFuncFailureHandler = createUserFuncFailureHandler(pendingDeferred);

        store._errorHandler?.(error);
        userFuncFailureHandler(error);
      });
  }
}

function runRawLoadWithQuery(pendingDeferred, store, options, countOnly) {
  options = options || {};

  const userFuncOptions = {};
  if ('userData' in options) {
    // @ts-expect-error
    userFuncOptions.userData = options.userData;
  }

  runRawLoad(pendingDeferred, store, userFuncOptions, (rawData) => {
    const rawDataQuery = arrayQuery(rawData, { errorHandler: store._errorHandler });
    let itemsQuery;
    let totalCountQuery;
    const waitList = [];

    let items;
    let totalCount;

    if (!countOnly) {
      // @ts-expect-error
      itemsQuery = storeHelper.queryByOptions(rawDataQuery, options);
      if (itemsQuery === rawDataQuery) {
        items = rawData.slice(0);
      } else {
        // @ts-expect-error
        waitList.push(itemsQuery.enumerate().done((asyncResult) => {
          items = asyncResult;
        }));
      }
    }

    if (options.requireTotalCount || countOnly) {
      totalCountQuery = storeHelper.queryByOptions(rawDataQuery, options, true);
      if (totalCountQuery === rawDataQuery) {
        totalCount = rawData.length;
      } else {
        // @ts-expect-error
        waitList.push(totalCountQuery.count().done((asyncResult) => {
          totalCount = asyncResult;
        }));
      }
    }

    when.apply($, waitList)
      .done(() => {
        if (countOnly) {
          pendingDeferred.resolve(totalCount);
        } else if (options.requireTotalCount) {
          pendingDeferred.resolve(items, { totalCount });
        } else {
          pendingDeferred.resolve(items);
        }
      })
      .fail((x) => {
        pendingDeferred.reject(x);
      });
  });
}

function runRawLoadWithKey(pendingDeferred, store, key) {
  runRawLoad(pendingDeferred, store, {}, (rawData) => {
    const keyExpr = store.key();
    let item;

    for (let i = 0, len = rawData.length; i < len; i++) {
      item = rawData[i];
      if (keysEqual(keyExpr, store.keyOf(rawData[i]), key)) {
        pendingDeferred.resolve(item);
        return;
      }
    }

    pendingDeferred.reject(errors.Error('E4009'));
  });
}

// @ts-expect-error
const CustomStore = Store.inherit({
  ctor(options) {
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

  createQuery() {
    throw errors.Error('E4010');
  },

  clearRawDataCache() {
    this._clearCache();
  },

  _totalCountImpl(options) {
    // @ts-expect-error
    let d = new Deferred();

    if (this._loadMode === 'raw' && !this._totalCountFunc) {
      runRawLoadWithQuery(d, this, options, true);
    } else {
      invokeUserTotalCountFunc(this, options)
        .done((count) => { d.resolve(Number(count)); })
        .fail(createUserFuncFailureHandler(d));
      d = this._addFailHandlers(d);
    }

    return d.promise();
  },

  _pushImpl(changes) {
    if (this.__rawData) {
      // @ts-expect-error
      applyBatch({
        keyInfo: this,
        data: this.__rawData,
        changes,
      });
    }
  },

  _loadImpl(options) {
    // @ts-expect-error
    let d = new Deferred();

    if (this._loadMode === 'raw') {
      runRawLoadWithQuery(d, this, options, false);
    } else {
      invokeUserLoad(this, options)
        .done((data, extra) => { d.resolve(data, extra); })
        .fail(createUserFuncFailureHandler(d));
      d = this._addFailHandlers(d);
    }

    return d.promise();
  },

  _byKeyImpl(key, extraOptions) {
    // @ts-expect-error
    const d = new Deferred();

    if (this._byKeyViaLoad()) {
      this._requireKey();
      runRawLoadWithKey(d, this, key);
    } else {
      invokeUserByKeyFunc(this, key, extraOptions)
        .done((obj) => { d.resolve(obj); })
        .fail(createUserFuncFailureHandler(d));
    }

    return d.promise();
  },

  _byKeyViaLoad() {
    return this._loadMode === 'raw' && !this._byKeyFunc;
  },

  _insertImpl(values) {
    const that = this;
    const userFunc = that._insertFunc;
    let userResult;
    // @ts-expect-error
    const d = new Deferred();

    ensureRequiredFuncOption(INSERT, userFunc);
    userResult = userFunc.apply(that, [values]); // should return key or data

    if (!isPromise(userResult)) {
      userResult = trivialPromise(userResult);
    }

    fromPromise(userResult)
      .done((serverResponse) => {
        if (config().useLegacyStoreResult) {
          d.resolve(values, serverResponse);
        } else {
          d.resolve(serverResponse || values, that.keyOf(serverResponse));
        }
      })
      .fail(createUserFuncFailureHandler(d));

    return d.promise();
  },

  _updateImpl(key, values) {
    const userFunc = this._updateFunc;
    let userResult;
    // @ts-expect-error
    const d = new Deferred();

    ensureRequiredFuncOption(UPDATE, userFunc);
    userResult = userFunc.apply(this, [key, values]);

    if (!isPromise(userResult)) {
      userResult = trivialPromise(userResult);
    }

    fromPromise(userResult)
      .done((serverResponse) => {
        if (config().useLegacyStoreResult) {
          d.resolve(key, values);
        } else {
          d.resolve(serverResponse || values, key);
        }
      })
      .fail(createUserFuncFailureHandler(d));

    return d.promise();
  },

  _removeImpl(key) {
    const userFunc = this._removeFunc;
    let userResult;
    // @ts-expect-error
    const d = new Deferred();

    ensureRequiredFuncOption(REMOVE, userFunc);
    userResult = userFunc.apply(this, [key]);

    if (!isPromise(userResult)) {
      // @ts-expect-error
      userResult = trivialPromise();
    }

    fromPromise(userResult)
      .done(() => { d.resolve(key); })
      .fail(createUserFuncFailureHandler(d));

    return d.promise();
  },
});

export default CustomStore;
