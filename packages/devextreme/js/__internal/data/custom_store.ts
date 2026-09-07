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
import type { DeferredObj } from '@js/core/utils/deferred';
// @ts-expect-error core/utils/deferred.d.ts does not declare `fromPromise`
import { Deferred, fromPromise, when } from '@js/core/utils/deferred';
import { isFunction } from '@js/core/utils/type';
import type { StoreChange } from '@js/data/store';
import type { StoreLoadOptions, StoreOptions } from '@ts/data/abstract_store';
import Store from '@ts/data/abstract_store';

const TOTAL_COUNT = 'totalCount';
const LOAD = 'load';
const BY_KEY = 'byKey';
const INSERT = 'insert';
const UPDATE = 'update';
const REMOVE = 'remove';

export interface CustomStoreOptions extends StoreOptions {
  useDefaultSearch?: boolean;
  loadMode?: string;
  cacheRawData?: boolean;
  load?: Function;
  totalCount?: Function;
  byKey?: Function;
  insert?: Function;
  update?: Function;
  remove?: Function;
}

function isPromise(obj: unknown): boolean {
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    return false;
  }

  return obj !== null && 'then' in obj && isFunction(obj.then);
}

function trivialPromise(value?: unknown): DeferredObj<unknown> {
  // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
  return Deferred<unknown>().resolve(value).promise();
}

function ensureRequiredFuncOption(name: string, obj: unknown): asserts obj is Function {
  if (!isFunction(obj)) {
    throw errors.Error('E4011', name);
  }
}

function throwInvalidUserFuncResult(name: string): never {
  throw errors.Error('E4012', name);
}

function createUserFuncFailureHandler(
  pendingDeferred: DeferredObj<unknown>,
): (...args: unknown[]) => void {
  function errorMessageFromXhr(promiseArguments: unknown[]): string | null {
    const [xhr, textStatus] = promiseArguments;

    if (typeof xhr !== 'object' || xhr === null
      || !('getResponseHeader' in xhr) || !xhr.getResponseHeader) {
      return null;
    }

    const message: string = errorMessageFromXhrUtility(xhr, textStatus);

    return message;
  }

  return function (...args: unknown[]): void {
    const [arg] = args;

    // String() is kept as is: the legacy fallback text relies on its default stringification.
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const argMessage = arg ? String(arg) : '';
    const message = errorMessageFromXhr(args) || argMessage || 'Unknown error';
    const error = arg instanceof Error ? arg : new Error(message);

    if (error.message !== XHR_ERROR_UNLOAD) {
      pendingDeferred.reject(error);
    }
  };
}

function invokeUserLoad(
  store: CustomStore,
  options?: StoreLoadOptions,
): DeferredObj<unknown[]> {
  const userFunc = store._loadFunc;

  ensureRequiredFuncOption(LOAD, userFunc);

  let userResult: unknown = userFunc.apply(store, [options]);

  if (Array.isArray(userResult)) {
    userResult = trivialPromise(userResult);
  } else if (userResult === null || userResult === undefined) {
    userResult = trivialPromise([]);
  } else if (!isPromise(userResult)) {
    throwInvalidUserFuncResult(LOAD);
  }

  const result: DeferredObj<unknown[]> = fromPromise(userResult);

  return result;
}

function invokeUserTotalCountFunc(
  store: CustomStore,
  options?: StoreLoadOptions,
): DeferredObj<unknown> {
  const userFunc = store._totalCountFunc;

  if (!isFunction(userFunc)) {
    throw errors.Error('E4021');
  }

  let userResult: unknown = userFunc.apply(store, [options]);

  if (!isPromise(userResult)) {
    const count = Number(userResult);
    if (!isFinite(count)) {
      throwInvalidUserFuncResult(TOTAL_COUNT);
    }
    userResult = trivialPromise(count);
  }

  const result: DeferredObj<unknown> = fromPromise(userResult);

  return result;
}

function invokeUserByKeyFunc(
  store: CustomStore,
  key: unknown,
  extraOptions?: StoreLoadOptions,
): DeferredObj<unknown> {
  const userFunc = store._byKeyFunc;

  ensureRequiredFuncOption(BY_KEY, userFunc);

  let userResult: unknown = userFunc.apply(store, [key, extraOptions]);

  if (!isPromise(userResult)) {
    userResult = trivialPromise(userResult);
  }

  const result: DeferredObj<unknown> = fromPromise(userResult);

  return result;
}

function runRawLoad(
  pendingDeferred: DeferredObj<unknown>,
  store: CustomStore,
  userFuncOptions: StoreLoadOptions,
  continuation: (rawData: unknown[]) => void,
): void {
  if (store.__rawData) {
    continuation(store.__rawData);
  } else {
    const loadPromise = store.__rawDataPromise ?? invokeUserLoad(store, userFuncOptions);

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

function runRawLoadWithQuery(
  pendingDeferred: DeferredObj<unknown>,
  store: CustomStore,
  options: StoreLoadOptions | undefined,
  countOnly: boolean,
): void {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const loadOptions: StoreLoadOptions = options || {};

  const userFuncOptions: StoreLoadOptions = {};
  if ('userData' in loadOptions) {
    userFuncOptions.userData = loadOptions.userData;
  }

  runRawLoad(pendingDeferred, store, userFuncOptions, (rawData) => {
    const rawDataQuery = arrayQuery(rawData, { errorHandler: store._errorHandler });
    const waitList: DeferredObj<unknown>[] = [];

    const result: { items?: unknown[]; totalCount?: unknown } = {};

    if (!countOnly) {
      const itemsQuery = storeHelper.queryByOptions(rawDataQuery, loadOptions, false);
      if (itemsQuery === rawDataQuery) {
        result.items = rawData.slice(0);
      } else {
        const itemsPromise: DeferredObj<unknown> = itemsQuery.enumerate()
          .done((asyncResult: unknown[]) => {
            result.items = asyncResult;
          });
        waitList.push(itemsPromise);
      }
    }

    if (loadOptions.requireTotalCount || countOnly) {
      const totalCountQuery = storeHelper.queryByOptions(rawDataQuery, loadOptions, true);
      if (totalCountQuery === rawDataQuery) {
        result.totalCount = rawData.length;
      } else {
        const totalCountPromise: DeferredObj<unknown> = totalCountQuery.count()
          .done((asyncResult: unknown) => {
            result.totalCount = asyncResult;
          });
        waitList.push(totalCountPromise);
      }
    }

    when(...waitList)
      .done(() => {
        if (countOnly) {
          pendingDeferred.resolve(result.totalCount);
        } else if (loadOptions.requireTotalCount) {
          pendingDeferred.resolve(result.items, { totalCount: result.totalCount });
        } else {
          pendingDeferred.resolve(result.items);
        }
      })
      .fail((x) => {
        pendingDeferred.reject(x);
      });
  });
}

function runRawLoadWithKey(
  pendingDeferred: DeferredObj<unknown>,
  store: CustomStore,
  key: unknown,
): void {
  runRawLoad(pendingDeferred, store, {}, (rawData) => {
    const keyExpr = store.key();

    for (const item of rawData) {
      if (keysEqual(keyExpr, store.keyOf(item), key)) {
        pendingDeferred.resolve(item);
        return;
      }
    }

    pendingDeferred.reject(errors.Error('E4009'));
  });
}

export function isGroupItem(item: unknown): boolean {
  if (item === undefined || item === null || typeof item !== 'object') {
    return false;
  }
  return 'key' in item && 'items' in item;
}

export function isLoadResultObject(res: unknown): boolean {
  return !Array.isArray(res) && typeof res === 'object' && res !== null && 'data' in res;
}

export function isGroupItemsArray(res: unknown): boolean {
  return Array.isArray(res) && !!res.length && isGroupItem(res[0]);
}

export function isItemsArray(res: unknown): boolean {
  return Array.isArray(res) && !isGroupItem(res[0]);
}

class CustomStore extends Store {
  _loadMode?: string;

  _cacheRawData: boolean;

  _loadFunc?: Function;

  _totalCountFunc?: Function;

  _byKeyFunc?: Function;

  _insertFunc?: Function;

  _updateFunc?: Function;

  _removeFunc?: Function;

  __rawData?: unknown[];

  __rawDataPromise?: DeferredObj<unknown[]>;

  constructor(options?: CustomStoreOptions) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const storeOptions: CustomStoreOptions = options || {};

    super(storeOptions);

    this._useDefaultSearch = !!storeOptions.useDefaultSearch || storeOptions.loadMode === 'raw';

    this._loadMode = storeOptions.loadMode;

    this._cacheRawData = storeOptions.cacheRawData !== false;

    this._loadFunc = storeOptions[LOAD];

    this._totalCountFunc = storeOptions[TOTAL_COUNT];

    this._byKeyFunc = storeOptions[BY_KEY];

    this._insertFunc = storeOptions[INSERT];

    this._updateFunc = storeOptions[UPDATE];

    this._removeFunc = storeOptions[REMOVE];
  }

  _clearCache(): void {
    delete this.__rawData;
  }

  createQuery(): never {
    throw errors.Error('E4010');
  }

  clearRawDataCache(): void {
    this._clearCache();
  }

  _totalCountImpl(options?: StoreLoadOptions): DeferredObj<number> {
    let d = Deferred<unknown>();

    if (this._loadMode === 'raw' && !this._totalCountFunc) {
      runRawLoadWithQuery(d, this, options, true);
    } else {
      invokeUserTotalCountFunc(this, options)
        .done((count) => { d.resolve(Number(count)); })
        .fail(createUserFuncFailureHandler(d));
      d = this._addFailHandlers(d);
    }

    // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
    return d.promise();
  }

  _pushImpl(changes: StoreChange[]): void {
    if (this.__rawData) {
      // @ts-expect-error array_utils is untyped: `applyBatch` destructures every option as required
      applyBatch({
        keyInfo: this,
        data: this.__rawData,
        changes,
      });
    }
  }

  _loadImpl(options?: StoreLoadOptions): DeferredObj<unknown[]> {
    let d = Deferred<unknown>();

    if (this._loadMode === 'raw') {
      runRawLoadWithQuery(d, this, options, false);
    } else {
      invokeUserLoad(this, options)
        .done((data, extra) => { d.resolve(data, extra); })
        .fail(createUserFuncFailureHandler(d));
      d = this._addFailHandlers(d);
    }

    // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
    return d.promise();
  }

  _byKeyImpl(key: unknown, extraOptions?: StoreLoadOptions): DeferredObj<unknown> {
    const d = Deferred<unknown>();

    if (this._byKeyViaLoad()) {
      this._requireKey();
      runRawLoadWithKey(d, this, key);
    } else {
      invokeUserByKeyFunc(this, key, extraOptions)
        .done((obj) => { d.resolve(obj); })
        .fail(createUserFuncFailureHandler(d));
    }

    // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
    return d.promise();
  }

  _byKeyViaLoad(): boolean {
    return this._loadMode === 'raw' && !this._byKeyFunc;
  }

  _insertImpl(values: unknown): DeferredObj<unknown> {
    const userFunc = this._insertFunc;
    const d = Deferred<unknown>();

    ensureRequiredFuncOption(INSERT, userFunc);

    let userResult: unknown = userFunc.apply(this, [values]); // should return key or data

    if (!isPromise(userResult)) {
      userResult = trivialPromise(userResult);
    }

    fromPromise(userResult)
      .done((serverResponse) => {
        if (config().useLegacyStoreResult) {
          d.resolve(values, serverResponse);
        } else {
          d.resolve(serverResponse || values, this.keyOf(serverResponse));
        }
      })
      .fail(createUserFuncFailureHandler(d));

    // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
    return d.promise();
  }

  _updateImpl(key: unknown, values: unknown): DeferredObj<unknown> {
    const userFunc = this._updateFunc;
    const d = Deferred<unknown>();

    ensureRequiredFuncOption(UPDATE, userFunc);

    let userResult: unknown = userFunc.apply(this, [key, values]);

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

    // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
    return d.promise();
  }

  _removeImpl(key: unknown): DeferredObj<unknown> {
    const userFunc = this._removeFunc;
    const d = Deferred<unknown>();

    ensureRequiredFuncOption(REMOVE, userFunc);

    let userResult: unknown = userFunc.apply(this, [key]);

    if (!isPromise(userResult)) {
      userResult = trivialPromise();
    }

    fromPromise(userResult)
      .done(() => { d.resolve(key); })
      .fail(createUserFuncFailureHandler(d));

    // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
    return d.promise();
  }
}

export default CustomStore;
