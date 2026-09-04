import { errors } from '@js/common/data/errors';
import { keysEqual, rejectedPromise, trivialPromise } from '@js/common/data/utils';
import config from '@js/core/config';
import Guid from '@js/core/guid';
import { compileGetter } from '@js/core/utils/data';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { deepExtendArraySafe } from '@js/core/utils/object';
import {
  isDefined, isEmptyObject, isObject, isPlainObject, isString,
} from '@js/core/utils/type';
import type { StoreChange } from '@js/data/store';
import { isCollectionLike } from '@ts/core/utils/m_object';
import type { StoreKey } from '@ts/data/abstract_store';

export type KeyExpr = StoreKey | Function;

export interface KeyInfo {
  /* eslint-disable @typescript-eslint/method-signature-style */
  key(): KeyExpr | undefined;
  keyOf(obj: unknown): unknown;
  /* eslint-enable @typescript-eslint/method-signature-style */
}

interface CachedArray extends Array<unknown> {
  _dataByKeyMap?: Record<string, unknown>;
  _dataByKeyMapLength?: number;
}

interface GroupItem {
  items?: unknown[];
  collapsedItems?: unknown[];
}

export interface ApplyBatchOptions {
  keyInfo: KeyInfo;
  data: unknown[];
  changes: StoreChange[];
  groupCount?: number;
  useInsertIndex?: boolean;
  immutable?: boolean;
  disableCache?: boolean;
  logError?: boolean;
  skipCopying?: boolean;
}

export interface ApplyChangesOptions {
  keyExpr?: StoreKey;
  immutable?: boolean;
}

function hasKey(target: unknown, keyOrKeys: KeyExpr): boolean {
  let keys: string[] = [];
  if (isString(keyOrKeys)) {
    keys = [keyOrKeys];
  } else if (Array.isArray(keyOrKeys)) {
    keys = keyOrKeys.slice();
  }

  while (keys.length) {
    const key = keys.shift();
    if (isDefined(key) && isObject(target) && key in target) {
      return true;
    }
  }

  return false;
}

function generateDataByKeyMap(keyInfo: KeyInfo, array: CachedArray): void {
  if (keyInfo.key() && (!array._dataByKeyMap || array._dataByKeyMapLength !== array.length)) {
    const dataByKeyMap: Record<string, unknown> = {};
    const arrayLength = array.length;
    for (let i = 0; i < arrayLength; i += 1) {
      dataByKeyMap[JSON.stringify(keyInfo.keyOf(array[i]))] = array[i];
    }

    array._dataByKeyMap = dataByKeyMap;
    array._dataByKeyMapLength = arrayLength;
  }
}

function getCacheValue(array: CachedArray, key: unknown): unknown {
  return array._dataByKeyMap?.[JSON.stringify(key)];
}

function getHasKeyCacheValue(array: CachedArray, key: unknown): unknown {
  if (array._dataByKeyMap) {
    return array._dataByKeyMap[JSON.stringify(key)];
  }

  return true;
}

function setDataByKeyMapValue(array: CachedArray, key: unknown, data: unknown): void {
  if (array._dataByKeyMap) {
    array._dataByKeyMap[JSON.stringify(key)] = data;
    array._dataByKeyMapLength = (array._dataByKeyMapLength ?? 0) + (data ? 1 : -1);
  }
}

function indexByKey(keyInfo: KeyInfo, array: unknown[], key: unknown): number {
  const keyExpr = keyInfo.key();

  if (!getHasKeyCacheValue(array, key)) {
    return -1;
  }

  for (let i = 0, arrayLength = array.length; i < arrayLength; i += 1) {
    if (keysEqual(keyExpr, keyInfo.keyOf(array[i]), key)) {
      return i;
    }
  }
  return -1;
}

function findItems(
  keyInfo: KeyInfo,
  items: unknown[],
  key: unknown,
  groupCount: number,
): unknown[] | undefined {
  if (groupCount) {
    for (const item of items) {
      const group: GroupItem = isObject(item) ? item : {};
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const childItems = group.items || group.collapsedItems || [];
      const result = findItems(keyInfo, childItems, key, groupCount - 1);
      if (result) {
        return result;
      }
    }
  } else if (indexByKey(keyInfo, items, key) >= 0) {
    return items;
  }

  return undefined;
}

function getItems(
  keyInfo: KeyInfo,
  items: unknown[],
  key: unknown,
  groupCount: number | undefined,
): unknown[] {
  if (groupCount) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return findItems(keyInfo, items, key, groupCount) || [];
  }

  return items;
}

function cloneInstanceWithChangedPaths(
  instance: unknown,
  changes: unknown,
  clonedInstances: WeakMap<object, unknown> = new WeakMap<object, unknown>(),
): unknown {
  if (isCollectionLike(instance)) {
    return instance;
  }

  const source: object = isObject(instance) ? instance : {};
  const result: object = isObject(instance)
    ? Object.create(Object.getPrototypeOf(instance))
    : {};

  if (isObject(instance)) {
    clonedInstances.set(instance, result);
  }

  const instanceWithoutPrototype = { ...source };
  deepExtendArraySafe(result, instanceWithoutPrototype, true, true, true);
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const name in instanceWithoutPrototype) {
    const value: unknown = instanceWithoutPrototype[name];
    const change: unknown = isObject(changes) ? changes[name] : undefined;

    if (isObject(value) && !isPlainObject(value)
      && isObject(change) && !clonedInstances.has(value)) {
      result[name] = cloneInstanceWithChangedPaths(value, change, clonedInstances);
    }
  }
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const name in result) {
    const prop: unknown = result[name];

    if (isObject(prop) && clonedInstances.has(prop)) {
      result[name] = clonedInstances.get(prop);
    }
  }

  return result;
}

function createObjectWithChanges(
  target: unknown,
  changes?: unknown,
): Record<string, unknown> {
  const result = cloneInstanceWithChangedPaths(target, changes);
  const extended: Record<string, unknown> = deepExtendArraySafe(result, changes, true, true, true);

  return extended;
}

function getErrorResult(
  isBatch: boolean | undefined,
  logError: boolean | undefined,
  errorCode: string,
): DeferredObj<unknown> | undefined {
  if (!isBatch) {
    const error: unknown = errors.Error(errorCode);
    return rejectedPromise(error);
  }

  if (logError) {
    errors.log(errorCode);
  }

  return undefined;
}

function update(
  keyInfo: KeyInfo, array: unknown[], key: unknown, data: unknown,
): DeferredObj<unknown>;
function update(
  keyInfo: KeyInfo, array: unknown[], key: unknown, data: unknown,
  isBatch: true, immutable?: boolean, logError?: boolean,
): undefined;
function update(
  keyInfo: KeyInfo,
  array: unknown[],
  key: unknown,
  data: unknown,
  isBatch?: boolean,
  immutable?: boolean,
  logError?: boolean,
): DeferredObj<unknown> | undefined {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let target: unknown;
  const extendComplexObject = true;
  const keyExpr = keyInfo.key();

  if (keyExpr) {
    if (hasKey(data, keyExpr) && !keysEqual(keyExpr, key, keyInfo.keyOf(data))) {
      return getErrorResult(isBatch, logError, 'E4017');
    }

    target = getCacheValue(array, key);
    if (!target) {
      const index = indexByKey(keyInfo, array, key);
      if (index < 0) {
        return getErrorResult(isBatch, logError, 'E4009');
      }

      target = array[index];

      if (immutable === true && isDefined(target)) {
        const newTarget = createObjectWithChanges(target, data);
        array[index] = newTarget;
        return isBatch ? undefined : trivialPromise(newTarget, key);
      }
    }
  } else {
    target = key;
  }

  deepExtendArraySafe(target, data, extendComplexObject, false, true, true);
  if (!isBatch) {
    if (config().useLegacyStoreResult) {
      return trivialPromise(key, data);
    }
    return trivialPromise(target, key);
  }

  return undefined;
}

function insert(
  keyInfo: KeyInfo, array: unknown[], data: unknown, index?: number,
): DeferredObj<unknown>;
function insert(
  keyInfo: KeyInfo, array: unknown[], data: unknown, index: number | undefined,
  isBatch: true, logError?: boolean, skipCopying?: boolean,
): undefined;
function insert(
  keyInfo: KeyInfo,
  array: unknown[],
  data: unknown,
  index?: number,
  isBatch?: boolean,
  logError?: boolean,
  skipCopying?: boolean,
): DeferredObj<unknown> | undefined {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let keyValue: unknown;
  const keyExpr = keyInfo.key();

  const obj: unknown = isPlainObject(data) && !skipCopying ? extend({}, data) : data;

  if (keyExpr) {
    keyValue = keyInfo.keyOf(obj);
    if (keyValue === undefined || (typeof keyValue === 'object' && isEmptyObject(keyValue))) {
      if (!isString(keyExpr)) {
        throw errors.Error('E4007');
      }

      const generatedKey = String(new Guid());

      if (isObject(obj)) {
        obj[keyExpr] = generatedKey;
      }
      keyValue = generatedKey;
    } else if (array[indexByKey(keyInfo, array, keyValue)] !== undefined) {
      return getErrorResult(isBatch, logError, 'E4008');
    }
  } else {
    keyValue = obj;
  }
  if (isDefined(index) && index >= 0) {
    array.splice(index, 0, obj);
  } else {
    array.push(obj);
  }

  setDataByKeyMapValue(array, keyValue, obj);

  if (!isBatch) {
    return trivialPromise(config().useLegacyStoreResult ? data : obj, keyValue);
  }

  return undefined;
}

function remove(
  keyInfo: KeyInfo, array: unknown[], key: unknown,
): DeferredObj<unknown>;
function remove(
  keyInfo: KeyInfo, array: unknown[], key: unknown, isBatch: true, logError?: boolean,
): undefined;
function remove(
  keyInfo: KeyInfo,
  array: unknown[],
  key: unknown,
  isBatch?: boolean,
  logError?: boolean,
): DeferredObj<unknown> | undefined {
  const index = indexByKey(keyInfo, array, key);
  if (index > -1) {
    array.splice(index, 1);
    setDataByKeyMapValue(array, key, null);
  }
  if (!isBatch) {
    return trivialPromise(key);
  }
  if (index < 0) {
    return getErrorResult(isBatch, logError, 'E4009');
  }

  return undefined;
}

function applyBatch({
  keyInfo, data, changes, groupCount, useInsertIndex, immutable,
  disableCache, logError, skipCopying,
}: ApplyBatchOptions): unknown[] {
  const resultItems = immutable === true ? [...data] : data;

  changes.forEach((item) => {
    const items = item.type === 'insert'
      ? resultItems
      : getItems(keyInfo, resultItems, item.key, groupCount);

    if (!disableCache) {
      generateDataByKeyMap(keyInfo, items);
    }

    const insertIndex = useInsertIndex && isDefined(item.index) ? item.index : -1;

    // eslint-disable-next-line default-case
    switch (item.type) {
      case 'update':
        update(keyInfo, items, item.key, item.data, true, immutable, logError);
        break;
      case 'insert':
        insert(keyInfo, items, item.data, insertIndex, true, logError, skipCopying);
        break;
      case 'remove':
        remove(keyInfo, items, item.key, true, logError);
        break;
    }
  });
  return resultItems;
}

function applyChanges(
  data: unknown[],
  changes: StoreChange[],
  options: ApplyChangesOptions = {},
): unknown[] {
  const { keyExpr = 'id', immutable = true } = options;
  // @ts-expect-error core/utils/data.d.ts types compileGetter as `(expr: string) => unknown`,
  // although it also accepts a compound key expression and returns a getter function
  const keyGetter: Function = compileGetter(keyExpr);
  const keyInfo: KeyInfo = {
    key: () => keyExpr,
    keyOf: (obj: unknown): unknown => keyGetter(obj),
  };

  return applyBatch({
    keyInfo,
    data,
    changes,
    immutable,
    disableCache: true,
    logError: true,
  });
}

export {
  applyBatch,
  applyChanges,
  createObjectWithChanges,
  indexByKey,
  insert,
  remove,
  update,
};
