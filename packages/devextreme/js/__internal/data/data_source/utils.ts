import ArrayStore from '@js/common/data/array_store';
import { CustomStore } from '@js/common/data/custom_store';
import { normalizeSortingInfo } from '@js/common/data/utils';
import ajaxUtils from '@js/core/utils/ajax';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isObject, isPlainObject } from '@js/core/utils/type';
import Store from '@ts/data/abstract_store';

import type { NormalizedDataSourceOptions } from './types';

export const CANCELED_TOKEN = 'canceled';

export type Mapper = (item: unknown) => unknown;

interface GroupItem {
  items?: unknown[];
}

export interface NormalizationOptions {
  fromUrlLoadMode?: string;
}

interface DataSourceOptionsInput {
  store?: unknown;
}

export const isPending = (deferred: DeferredObj<unknown>): boolean => deferred.state() === 'pending';

export const normalizeStoreLoadOptionAccessorArguments = (
  originalArguments: unknown[],
): unknown => {
  switch (originalArguments.length) {
    case 0:
      return undefined;
    case 1:
      return originalArguments[0];
    default:
      return originalArguments.slice();
  }
};

const mapRecursive = (items: unknown, level: number, mapper: Mapper): unknown => {
  if (!Array.isArray(items)) return items;

  if (!level) {
    return items.map(mapper);
  }

  return items.map((item) => {
    const groupItem: GroupItem = isObject(item) ? item : {};

    return {
      ...groupItem,
      items: mapRecursive(groupItem.items, level - 1, mapper),
    };
  });
};

export const mapDataRespectingGrouping = (
  items: unknown[],
  mapper: Mapper,
  groupInfo?: unknown,
): unknown[] => {
  const level = groupInfo ? normalizeSortingInfo(groupInfo).length : 0;
  const mapped = mapRecursive(items, level, mapper);

  return Array.isArray(mapped) ? mapped : [];
};

export interface NormalizedLoadResult {
  data: unknown[];
  extra: unknown;
}

export const normalizeLoadResult = (data: unknown, extra?: unknown): NormalizedLoadResult => {
  const loadResult: { data?: unknown } = isObject(data) ? data : {};

  const resultData: unknown = loadResult.data ? loadResult.data : data;
  const resultExtra: unknown = loadResult.data ? data : extra;

  return {
    data: Array.isArray(resultData) ? resultData : [resultData],
    extra: resultExtra,
  };
};

const CUSTOM_STORE_OPTION_NAMES = [
  'useDefaultSearch', 'key', 'load', 'loadMode', 'cacheRawData', 'byKey',
  'lookup', 'totalCount', 'insert', 'update', 'remove',
];

const createCustomStoreFromLoadFunc = (options: DataSourceOptionsInput): CustomStore => {
  const storeConfig: Record<string, unknown> = {};

  CUSTOM_STORE_OPTION_NAMES.forEach((optionName) => {
    storeConfig[optionName] = options[optionName];
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete options[optionName];
  });

  return new CustomStore(storeConfig);
};

const createStoreFromConfig = (storeConfig: Record<string, unknown>): Store => {
  const alias = String(storeConfig.type);

  delete storeConfig.type;

  const store: Store = Store.create(alias, storeConfig);

  return store;
};

const createCustomStoreFromUrl = (
  url: string,
  normalizationOptions?: NormalizationOptions,
): CustomStore => new CustomStore({
  load: (): unknown => ajaxUtils.sendRequest({ url, dataType: 'json' }),
  loadMode: normalizationOptions?.fromUrlLoadMode,
});

const resolveStore = (options: DataSourceOptionsInput): Store => {
  if ('load' in options) {
    return createCustomStoreFromLoadFunc(options);
  }

  const { store } = options;

  if (Array.isArray(store)) {
    return new ArrayStore(store);
  }
  if (isPlainObject(store)) {
    return createStoreFromConfig(extend({}, store));
  }

  // Anything else is passed through the way it was before this module was typed:
  // a value that is not a store fails later, in the data source itself.
  // @ts-expect-error the `store` option is user-provided and is not necessarily a Store
  const passedThrough: Store = store;

  return passedThrough;
};

export const normalizeDataSourceOptions = (
  options: unknown,
  normalizationOptions?: NormalizationOptions,
): NormalizedDataSourceOptions => {
  let source: unknown = options;

  if (typeof source === 'string') {
    source = {
      paginate: false,
      store: createCustomStoreFromUrl(source, normalizationOptions),
    };
  }

  if (source === undefined) {
    source = [];
  }

  const normalized: DataSourceOptionsInput = Array.isArray(source) || source instanceof Store
    ? { store: source }
    : extend({}, source);

  if (normalized.store === undefined) {
    normalized.store = [];
  }

  const store = resolveStore(normalized);

  return {
    ...normalized,
    store,
  };
};
