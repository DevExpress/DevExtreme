/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @stylistic/comma-dangle */
/* eslint-disable @stylistic/max-len */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/init-declarations */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import ArrayStore from '@js/common/data/array_store';
import query from '@js/common/data/query';
import storeHelper from '@js/common/data/store_helper';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import type { DataSource } from '@ts/data/data_source/data_source';
import type { CustomLoader, CustomLoadResult } from '@ts/grids/grid_core/data_source_adapter/custom_loader';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';

import type { LoadOperation, TreeNode } from '../types';
import { createIdFilter } from './create_id_filter';

export interface LoadBranchesContext {
  dataSource: DataSource,
  customLoader: CustomLoader,
  rootValue: any;
  maxFilterLengthInRequest: any;
  parentIdExpr: any;
  keyExpr: any;
  _parentIdGetter: (data: any) => any;
  _keyGetter: (data: any) => any;
  isRowExpanded: (data: any) => boolean;
  getCachedData: () => any;
  setCachedData: (data: any) => void;
  getLastOperationId: () => any,
  getNodeByKey: (key: any) => TreeNode | undefined,
}

const { queryByOptions } = storeHelper;

const applySorting = (data: any[], sort: any): any => queryByOptions(
  query(data),
  {
    sort,
  },
).toArray();

const isOperationIdOutdated = (context: LoadBranchesContext, operationId): boolean => {
  const lastOperationId = context.getLastOperationId();

  return operationId !== undefined
    && lastOperationId !== undefined
    && operationId !== lastOperationId;
};

const generateInfoToLoad = (context: LoadBranchesContext, data, needChildren) => {
  let key;
  const keyMap = {};
  const resultKeyMap = {};
  const resultKeys: any[] = [];
  const { rootValue } = context;
  let i;

  for (i = 0; i < data.length; i++) {
    key = needChildren ? context._parentIdGetter(data[i]) : context._keyGetter(data[i]);
    keyMap[key] = true;
  }

  for (i = 0; i < data.length; i++) {
    key = needChildren ? context._keyGetter(data[i]) : context._parentIdGetter(data[i]);
    const needToLoad = needChildren ? context.isRowExpanded(key) : key !== rootValue;

    if (!keyMap[key] && !resultKeyMap[key] && needToLoad) {
      resultKeyMap[key] = true;
      resultKeys.push(key);
    }
  }

  return {
    keyMap: resultKeyMap,
    keys: resultKeys,
  };
};

const loadParentsOrChildren = (context: LoadBranchesContext, data, options, needChildren?): any => {
  if (isOperationIdOutdated(context, options.operationId)) {
    context.dataSource.cancel(options.operationId);
    const rejectedDeferred = Deferred();
    rejectedDeferred.reject();
    return rejectedDeferred;
  }

  let filter;
  let needLocalFiltering;
  const { keys, keyMap } = generateInfoToLoad(context, data, needChildren);
  // @ts-expect-error
  const d = new Deferred();
  const isRemoteFiltering = options.remoteOperations.filtering;
  const { maxFilterLengthInRequest } = context;
  const sort = options.storeLoadOptions?.sort ?? options.loadOptions?.sort;
  let loadOptions = isRemoteFiltering ? options.storeLoadOptions : options.loadOptions;

  const concatLoadedData = (loadedData): any => {
    if (isRemoteFiltering) {
      const updatedData = applySorting(
        context.getCachedData().concat(loadedData),
        sort,
      );

      context.setCachedData(updatedData);
    }

    return applySorting(
      data.concat(loadedData),
      sort,
    );
  };

  if (!keys.length) {
    return d.resolve(data);
  }

  let cachedNodes = keys
    .map((id) => context.getNodeByKey(id))
    .filter((node) => node?.data) as TreeNode[];

  if (cachedNodes.length === keys.length) {
    if (needChildren) {
      cachedNodes = cachedNodes.reduce((result: TreeNode[], node) => result.concat(node.children), []);
    }

    if (cachedNodes.length) {
      return loadParentsOrChildren(
        context,
        concatLoadedData(cachedNodes.map((node) => node.data)),
        options,
        needChildren
      );
    }
  }

  const keyExpr = needChildren ? context.parentIdExpr : context.keyExpr;
  filter = createIdFilter(keyExpr, keys);
  const filterLength = encodeURI(JSON.stringify(filter)).length;

  if (filterLength > maxFilterLengthInRequest) {
    filter = (itemData) => {
      const key = needChildren
        ? context._parentIdGetter(itemData)
        : context._keyGetter(itemData);
      return keyMap[key];
    };

    needLocalFiltering = isRemoteFiltering;
  }

  loadOptions = extend({}, loadOptions, {
    filter: !needLocalFiltering ? filter : null,
  });

  const loadBranchItemsDeferred = options.fullData
    ? new ArrayStore(options.fullData).load(loadOptions)
    : context.customLoader.loadFromStore(loadOptions);

  loadBranchItemsDeferred
    .done((loadResult: CustomLoadResult | unknown[]) => {
      let loadedData = Array.isArray(loadResult) ? loadResult : loadResult.data;

      if (isOperationIdOutdated(context, options.operationId)) {
        d.reject();
        return;
      }

      if (loadedData.length) {
        if (needLocalFiltering) {
          loadedData = query(loadedData).filter(filter).toArray();
        }

        loadParentsOrChildren(
          context,
          concatLoadedData(loadedData),
          options,
          needChildren
        ).done(d.resolve).fail(d.reject);
      } else {
        d.resolve(data);
      }
    })
    .fail(d.reject);

  return d;
};

export const loadBranches = (
  context: LoadBranchesContext,
  data: RawItemData[],
  options: LoadOperation,
  needChildren: boolean,
): DeferredObj<RawItemData[]> => {
  const d = Deferred<RawItemData[]>();

  loadParentsOrChildren(context, data, options)
    .done((data) => {
      if (!needChildren) {
        d.resolve(data);
        return;
      }

      loadParentsOrChildren(context, data, options, true)
        .done(d.resolve)
        .fail(d.reject);
    })
    .fail(d.reject);

  return d;
};
