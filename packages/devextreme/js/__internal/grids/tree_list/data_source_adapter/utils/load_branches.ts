import ArrayStore from '@js/common/data/array_store';
import query from '@js/common/data/query';
import storeHelper from '@js/common/data/store_helper';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import type { DataSource } from '@ts/data/data_source/data_source';
import type { StoreLoadOptions } from '@ts/data/data_source/types';
import type { DataFilter, DataFilterPredicate } from '@ts/grids/grid_core/data_controller/types';
import type { CustomLoader, CustomLoadResult } from '@ts/grids/grid_core/data_source_adapter/custom_loader';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';

import type { LoadOperation, TreeNode } from '../types';
import { createIdFilter } from './create_id_filter';

const { queryByOptions } = storeHelper;

export interface LoadBranchesContext {
  dataSource: DataSource;
  customLoader: CustomLoader;
  rootValue: unknown;
  maxFilterLengthInRequest: number;
  parentIdExpr: unknown;
  keyExpr: unknown;
  _parentIdGetter: (data: unknown) => unknown;
  _keyGetter: (data: unknown) => unknown;
  isRowExpanded: (key: unknown) => boolean;
  getCachedData: () => RawItemData[] | undefined;
  setCachedData: (data: RawItemData[]) => void;
  getLastOperationId: () => number | undefined;
  getNodeByKey: (key: unknown) => TreeNode | undefined;
}

interface InfoToLoad {
  keyMap: Record<string, boolean>;
  keys: unknown[];
}

const applySorting = (
  data: RawItemData[],
  sort: StoreLoadOptions['sort'],
): RawItemData[] => queryByOptions(
  query(data),
  {
    sort,
  },
).toArray() as RawItemData[];

const isOperationIdOutdated = (
  context: LoadBranchesContext,
  operationId: number | undefined,
): boolean => {
  const lastOperationId = context.getLastOperationId();

  return operationId !== undefined
    && lastOperationId !== undefined
    && operationId !== lastOperationId;
};

const generateInfoToLoad = (
  context: LoadBranchesContext,
  data: RawItemData[],
  needChildren?: boolean,
): InfoToLoad => {
  const keyMap: Record<string, boolean> = {};
  const resultKeyMap: Record<string, boolean> = {};
  const resultKeys: unknown[] = [];
  const { rootValue } = context;

  for (const item of data) {
    const key = needChildren
      ? context._parentIdGetter(item)
      : context._keyGetter(item);

    keyMap[key as string] = true;
  }

  for (const item of data) {
    const key = needChildren
      ? context._keyGetter(item)
      : context._parentIdGetter(item);
    const needToLoad = needChildren
      ? context.isRowExpanded(key)
      : key !== rootValue;

    if (!keyMap[key as string] && !resultKeyMap[key as string] && needToLoad) {
      resultKeyMap[key as string] = true;
      resultKeys.push(key);
    }
  }

  return {
    keyMap: resultKeyMap,
    keys: resultKeys,
  };
};

const loadParentsOrChildren = (
  context: LoadBranchesContext,
  data: RawItemData[],
  options: LoadOperation,
  needChildren?: boolean,
): DeferredObj<RawItemData[]> => {
  const d = Deferred<RawItemData[]>();

  if (isOperationIdOutdated(context, options.operationId)) {
    context.dataSource.cancel(options.operationId as number);
    return d.reject();
  }

  const { keys, keyMap } = generateInfoToLoad(context, data, needChildren);

  const isRemoteFiltering = !!options.remoteOperations?.filtering;
  const sort = options.storeLoadOptions?.sort ?? options.loadOptions?.sort;

  const concatLoadedData = (loadedData: RawItemData[]): RawItemData[] => {
    if (isRemoteFiltering) {
      const cachedData = context.getCachedData() as RawItemData[];
      const sortedData = applySorting(cachedData.concat(loadedData), sort);

      context.setCachedData(sortedData);
    }

    return applySorting(data.concat(loadedData), sort);
  };

  if (!keys.length) {
    return d.resolve(data);
  }

  let cachedNodes = keys
    .map((key) => context.getNodeByKey(key))
    .filter((node): node is TreeNode => !!node?.data);

  if (cachedNodes.length === keys.length) {
    if (needChildren) {
      cachedNodes = cachedNodes.flatMap((node) => node.children);
    }

    if (cachedNodes.length) {
      return loadParentsOrChildren(
        context,
        concatLoadedData(cachedNodes.map((node) => node.data as RawItemData)),
        options,
        needChildren,
      );
    }
  }

  const keyExpr = needChildren ? context.parentIdExpr : context.keyExpr;
  const idFilter = createIdFilter(keyExpr, keys);
  const filterLength = encodeURI(JSON.stringify(idFilter)).length;
  const isFilterTooLong = filterLength > context.maxFilterLengthInRequest;

  const keyMapFilter: DataFilterPredicate = (itemData) => {
    const key = needChildren
      ? context._parentIdGetter(itemData)
      : context._keyGetter(itemData);

    return !!keyMap[key as string];
  };

  const filter: DataFilter = isFilterTooLong ? keyMapFilter : idFilter;
  // A remote store cannot run the predicate, so it loads unfiltered
  // and the predicate is applied to the result below.
  const needLocalFiltering = isFilterTooLong && isRemoteFiltering;

  const loadOptions = extend(
    {},
    isRemoteFiltering ? options.storeLoadOptions : options.loadOptions,
    {
      filter: needLocalFiltering ? null : filter,
    },
  );

  const loadBranchItemsDeferred = options.fullData
    ? new ArrayStore(options.fullData).load(loadOptions)
    : context.customLoader.loadFromStore(loadOptions);

  loadBranchItemsDeferred
    .done((loadResult: CustomLoadResult | unknown[]) => {
      const loadedData = Array.isArray(loadResult)
        ? loadResult as RawItemData[]
        : loadResult.data;

      if (isOperationIdOutdated(context, options.operationId)) {
        d.reject();
        return;
      }

      if (!loadedData.length) {
        d.resolve(data);
        return;
      }

      const branchData = needLocalFiltering
        ? query(loadedData).filter(keyMapFilter).toArray() as RawItemData[]
        : loadedData;

      loadParentsOrChildren(context, concatLoadedData(branchData), options, needChildren)
        .done((nextLoadedData: RawItemData[]): void => { d.resolve(nextLoadedData); })
        // @ts-expect-error badly typed Deferred.fail
        .fail((...args: unknown[]): void => { d.reject(...args); });
    })
    // @ts-expect-error badly typed Deferred.fail
    .fail((...args: unknown[]): void => { d.reject(...args); });

  return d;
};

export const loadBranches = (
  context: LoadBranchesContext,
  data: RawItemData[],
  options: LoadOperation,
  needChildren: boolean,
): DeferredObj<RawItemData[]> => {
  const d = Deferred<RawItemData[]>();
  const resolve = (branchData: RawItemData[]): void => { d.resolve(branchData); };
  const reject = (...args: unknown[]): void => {
    // @ts-expect-error badly typed Deferred.reject
    d.reject(...args);
  };

  loadParentsOrChildren(context, data, options)
    .done((parentsData) => {
      if (!needChildren) {
        resolve(parentsData);
        return;
      }

      loadParentsOrChildren(context, parentsData, options, true)
        .done(resolve)
        .fail(reject);
    })
    .fail(reject);

  return d;
};
